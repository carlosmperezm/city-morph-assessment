import * as lambda from "aws-lambda";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";
import { isValidDbSecret } from "../shared/validators";

export async function seedDb(): Promise<lambda.APIGatewayProxyResult> {
  const secretsClient: SecretsManagerClient = new SecretsManagerClient({
    region: "us-west-1",
  });
  try {
    const secretArn: string | undefined = process.env.DB_SECRET_ARN;

    if (!secretArn) {
      throw new Error("DB_SECRET_ARN environment variable is not set");
    }

    const response: GetSecretValueCommandOutput = await secretsClient.send(
      new GetSecretValueCommand({ SecretId: secretArn }),
    );

    if (!response.SecretString) {
      throw new Error("Secret not found");
    }

    const secret: unknown = JSON.parse(response.SecretString);

    if (!isValidDbSecret(secret)) {
      throw new Error("Invalid secret format");
    }

    const pool: Pool = new Pool({
      host: secret.host,
      port: secret.port,
      database: secret.dbname,
      user: secret.username,
      password: secret.password,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await pool.query(`
      DROP TABLE IF EXISTS products;
      
      CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price FLOAT DEFAULT 0.00,
      image_key VARCHAR(255),
      role VARCHAR(255)
      );

      INSERT INTO products(name, price, image_key, role)
      VALUES
      ('AirPods', 10.99, 'images/AirPods.jpg', 'admin'),
      ('Lotion', 2.89, 'images/Lotion.jpg', 'standard'),
      ('Perfume', 47.81, 'images/Perfume.jpg', 'admin'),
      ('Shoes', 65.00, 'images/Shoes.jpg', 'standard'),
      ('Watch', 15.50, 'images/Watch.jpg', 'admin'),
      ('Headphones', 89.99, 'images/Headphones.jpg', 'standard'),
      ('Keyboard', 75.00, 'images/Keyboard.jpg', 'admin'),
      ('Sandals', 35.00, 'images/Sandals.jpg', 'standard'),
      ('Coffee Maker', 99.99, 'images/Coffee Maker.jpg', 'admin'),
      ('Women Accessories', 45.00, 'images/Women Accessories.jpg', 'admin')
      ON CONFLICT DO NOTHING;
    `);

    await pool.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "DB initialized successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Database initialization failed",
        message: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}
