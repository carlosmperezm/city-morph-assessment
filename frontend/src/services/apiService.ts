import { get } from "aws-amplify/api";
import type { DashboardData, ImagesResponse } from "../types";

const API_NAME: string = "cityMorphAPI";

export async function getDashboardData(): Promise<DashboardData> {
  const path: string = "/data";
  const response = await get({ apiName: API_NAME, path }).response;
  const data = (await response.body.json()) as unknown;
  return data as DashboardData;
}

export async function getSignedImageUrls(
  keys: string[],
): Promise<ImagesResponse> {
  const path: string = "/images";
  const response = await get({
    apiName: API_NAME,
    path,
    options: { queryParams: { keys: keys.join(",") } },
  }).response;
  const data = (await response.body.json()) as unknown;
  return data as ImagesResponse;
}
