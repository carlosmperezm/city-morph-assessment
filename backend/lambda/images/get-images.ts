import * as lambda from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { allowedOrigins } from "../shared/cors";

const s3Client = new S3Client();

export async function getImages(
  event: lambda.APIGatewayProxyEvent,
): Promise<lambda.APIGatewayProxyResult> {
  const origin: string = event.headers.origin || event.headers.Origin || "";
  const corsOrigin: string = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  try {
    const bucketName: string | undefined = process.env.BUCKET_NAME;
    const keysParam: string | undefined =
      event.queryStringParameters?.keys?.trim();
    const imageKeys: string[] = keysParam
      ? keysParam
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    if (!bucketName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bucket name is needed from env variables",
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      };
    }
    if (imageKeys.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No image keys provided" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      };
    }

    const signedUrl = await Promise.all(
      imageKeys.map(async (key) => {
        const command: GetObjectCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        });
        const url: string = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        return { key, signedUrl: url };
      }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify(signedUrl),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: String(error) }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    };
  }
}
