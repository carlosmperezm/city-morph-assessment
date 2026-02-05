import * as lambda from "aws-lambda";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

const secretsClient = new SecretsManagerClient();
let dbPool: Pool | null = null;

interface DbSecret {
  username: string;
  password: string;
  host: string;
  port: number;
  dbname: string;
}

async function getDbPool(): Promise<Pool> {
  if (dbPool) return dbPool;

  const secretArn = process.env.DB_SECRET_ARN;
  if (!secretArn) throw new Error("DB_SECRET_ARN not set");

  const response = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: secretArn }),
  );

  if (!response.SecretString) throw new Error("Secret not found");

  const secret: DbSecret = JSON.parse(response.SecretString);

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
const allowedOrigins = [
  "http://localhost:5173",
  "http://city-morph-assessment.s3-website-us-west-1.amazonaws.com",
  "https://d3i40ylfe83sb1.cloudfront.net",
];

export async function getData(
  event: lambda.APIGatewayProxyEvent,
): Promise<lambda.APIGatewayProxyResult> {
  try {
    const pool = await getDbPool();
    const result = await pool.query("SELECT * FROM products ");

    const origin = event.headers.origin || event.headers.Origin || "";
    const corsOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

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
    console.error("Error:", error);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Oops there's an error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
