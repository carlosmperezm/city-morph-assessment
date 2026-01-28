import { useEffect, useState, type JSX } from "react";
import { getDashboardData, getSignedImageUrls } from "../services/apiService";
import type { DashboardData, ImagesResponse } from "../types";
import { signOut } from "aws-amplify/auth";

export default function DashboardPage(): JSX.Element {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [productImages, setProductImages] = useState<ImagesResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function handleSignout(): Promise<void> {
    return await signOut();
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardData = await getDashboardData();
        const imagesKeys: string[] = dashboardData.products.map(
          (product) => product.image_key,
        );
        const imagesUrls = await getSignedImageUrls(imagesKeys);

        setDashboardData(dashboardData);
        setProductImages(imagesUrls);
        setIsLoading(false);
      } catch (err) {
        console.log("Failed to load dashboard", err);
        setIsLoading(false);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard. Please try again ",
        );
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <h1>Loading</h1>;
  }
  if (error) {
    return <h1>{error}</h1>;
  }
  if (!(dashboardData && productImages)) {
    return <h1>No data available</h1>;
  }
  return (
    <>
      <h1>Hello {dashboardData.user.name}</h1>
      <button onClick={handleSignout}>Sign Out</button>
    </>
  );
}
