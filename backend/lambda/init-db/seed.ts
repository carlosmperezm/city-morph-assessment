import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

export async function seedDb() {
  const secretsClient = new SecretsManagerClient({ region: "us-west-1" });
  try {
    const secretArn = process.env.DB_SECRET_ARN!;
    const response = await secretsClient.send(
      new GetSecretValueCommand({ SecretId: secretArn }),
    );
    const secret = JSON.parse(response.SecretString!);
    const pool = new Pool({
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
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_key VARCHAR(255),
        role VARCHAR(255)
    );

      INSERT INTO products(name,image_key, role)
        VALUES
          ('Product 1','images/product1.jpg', 'standard'),
          ('Product 2','images/product2.jpg', 'admin'),
          ('Product 3','images/product3.jpg', 'admin'),
          ('Product 4','images/product4.jpg', 'standard')
        ON CONFLICT DO NOTHING;
  `);

    await pool.end();
    return { statusCode: 200, body: "DB initialized" };
  } catch (error) {
    return {
      statusCode: 400,
      body: `And error occurred: ${error instanceof Error ? error.message : error}`,
    };
  }
}
