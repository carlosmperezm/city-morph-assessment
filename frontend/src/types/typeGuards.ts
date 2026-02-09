import type { DashboardData, SignedImage } from "../types/index";

export function isDashboardData(data: unknown): data is DashboardData {
  return (
    typeof data === "object" &&
    data !== null &&
    "products" in data &&
    Array.isArray((data as DashboardData).products)
  );
}

export function isSignedImageArray(data: unknown): data is SignedImage[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "signedUrl" in item &&
        typeof item.key === "string" &&
        typeof item.signedUrl == "string",
    )
  );
}

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
