import * as lambda from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { allowedOrigins } from "../shared/cors";
import type { SignedImage } from "../shared/types";

const s3Client: S3Client = new S3Client();

export async function getImages(
  event: lambda.APIGatewayProxyEvent,
): Promise<lambda.APIGatewayProxyResult> {
  const origin: string = event.headers.origin || event.headers.Origin || "";
  const corsOrigin: string = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  try {
    const bucketName: string | undefined = process.env.BUCKET_NAME;

    if (!bucketName) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Bucket name is needed from env variables",
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      };
    }

    const keysParam: string | undefined =
      event.queryStringParameters?.keys?.trim();

    if (!keysParam) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No image keys provided",
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      };
    }

    const imageKeys: string[] = keysParam
      .split(",")
      .map((imageKey: string): string => imageKey.trim())
      .filter(Boolean);
    if (imageKeys.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No valid image keys provided" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOrigin,
        },
      };
    }

    const signedImage: SignedImage[] = await Promise.all(
      imageKeys.map(async (key: string): Promise<SignedImage> => {
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
      body: JSON.stringify(signedImage),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
      },
    };
  }
}
