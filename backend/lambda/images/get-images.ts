import * as lambda from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client();

export async function getImages(
  event: lambda.APIGatewayProxyEvent,
): Promise<lambda.APIGatewayProxyResult> {
  try {
    const bucketName: string | undefined = process.env.BUCKET_NAME;
    const imageKeys: string[] = [
      "images/Airpods.jpg",
      "images/Lotion.jpg",
      "images/Perfume.jpg",
      "images/Shoes.jpg",
      "images/Watch.jpg",
      "images/Headphones.jpg",
      "images/Keyboard.jpg",
      "images/Sandals.jpg",
      "images/Coffee Maker.jpg",
      "images/Women Accessories.jpg",
    ];
    if (!bucketName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bucket name is needed from env variables",
        }),
      };
    }
    const signedUrl = await Promise.all(
      imageKeys.map(async (key) => {
        const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { key, signedUrl: url };
      }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify(signedUrl),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: String(error) }),
    };
  }
}
