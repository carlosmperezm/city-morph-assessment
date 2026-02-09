import * as lambda from "aws-lambda";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";
import { Pool, QueryResult } from "pg";
import { allowedOrigins } from "../shared/cors";
import { isValidDbSecret } from "../shared/validators";

const secretsClient: SecretsManagerClient = new SecretsManagerClient();
let dbPool: Pool | null = null;

async function getDbPool(): Promise<Pool> {
  if (dbPool) return dbPool;

  const secretArn: string | undefined = process.env.DB_SECRET_ARN;

  if (!secretArn) throw new Error("DB_SECRET_ARN not set");

  const response: GetSecretValueCommandOutput = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: secretArn }),
  );

  if (!response.SecretString) throw new Error("Secret not found");

  const secret: unknown = JSON.parse(response.SecretString);

  if (!isValidDbSecret(secret)) {
    throw new Error("Invalid secret format");
  }

  dbPool = new Pool({
    host: secret.host,
    port: secret.port,
    database: secret.dbname,
    user: secret.username,
    password: secret.password,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return dbPool;
}

export async function getData(
  event: lambda.APIGatewayProxyEvent,
): Promise<lambda.APIGatewayProxyResult> {
  const origin: string = event.headers.origin || event.headers.Origin || "";
  const corsOrigin: string = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  try {
    const pool: Pool = await getDbPool();
    const result: QueryResult = await pool.query("SELECT * FROM products ");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
      body: JSON.stringify({
        products: result.rows,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
      body: JSON.stringify({
        error: "Could not fetch the data from the database",
        message: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}
