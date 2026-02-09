import { get } from "aws-amplify/api";
import type { DashboardData, SignedImage } from "../types";
import { isDashboardData, isSignedImageArray } from "../types/typeGuards";

const API_NAME: string = "cityMorphAPI";

export async function getDashboardData(): Promise<DashboardData> {
  const path: string = "/data";
  const response = await get({ apiName: API_NAME, path }).response;
  const data: unknown = await response.body.json();

  if (!isDashboardData(data)) {
    throw new Error("Invalid dashboard data format received from API");
  }

  return data;
}

export async function getSignedImageUrls(
  keys: string[],
): Promise<SignedImage[]> {
  const path: string = "/images";
  const response = await get({
    apiName: API_NAME,
    path,
    options: { queryParams: { keys: keys.join(",") } },
  }).response;
  const data: unknown = await response.body.json();

  if (!isSignedImageArray(data)) {
    throw new Error("Invalid image URLs format received from API");
  }

  return data;
}
