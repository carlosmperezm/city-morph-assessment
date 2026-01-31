import { APIGatewayProxyResult } from "aws-lambda";

export async function handler(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        name: "Demo User",
        email: "demo@example.com",
        role: "standard",
      },
      products: [
        {
          id: "1",
          name: "Product 1",
          image_key: "product1.jpg",
        },
        {
          id: "2",
          name: "Product 2",
          image_key: "product2.jpg",
        },
      ],
    }),
  };
}
