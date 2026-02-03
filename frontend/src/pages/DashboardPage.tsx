import { useEffect, useState, type JSX } from "react";
import { getDashboardData, getSignedImageUrls } from "../services/apiService";
import type { DashboardData, SignedImage } from "../types";
import { signOut } from "aws-amplify/auth";

export default function DashboardPage(): JSX.Element {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [productImages, setProductImages] = useState<SignedImage[] | null>(
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
        console.log(dashboardData);
        const imagesKeys: string[] = dashboardData.products.map(
          (product) => product.image_key,
        );
        const imagesUrls = await getSignedImageUrls(imagesKeys);
        console.log("images urls: ", imagesUrls);

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
    <div className="dashboard">
      <header>
        <h1>City Morph Studio</h1>
        <button onClick={handleSignout}>Sign Out</button>
      </header>
      <section className="user-section">
        <h2>Hello {dashboardData.user.name}</h2>
      </section>
      <section className="product-section">
        <ul>
          {dashboardData.products.map((product) => {
            console.info("Iterating products: ");
            console.log("Product: ", product);
            console.log("Product Images: ", productImages);
            const imageData: SignedImage | undefined = productImages.find(
              (image) => image.key === product.image_key,
            );
            console.log("Image Data: ", imageData);
            if (
              !imageData ||
              (dashboardData.user.role === "standard" &&
                product.visible_to_role !== "standard")
            ) {
              return null;
            }
            return (
              <li key={product.id} className="product">
                <img src={imageData.signedUrl} alt={product.name} />
                <p className="product-name">{product.name}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
