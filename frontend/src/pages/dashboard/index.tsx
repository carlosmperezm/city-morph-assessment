import { useEffect, useState, type JSX } from "react";
import {
  getDashboardData,
  getSignedImageUrls,
} from "../../services/apiService";
import type {
  DashboardData,
  DashboardPageProps,
  SignedImage,
} from "../../types";
import Navbar from "../../components/navbar";
import styles from "./styles.module.css";
import Product from "../../components/product";
import { ThreeDot } from "react-loading-indicators";

export default function DashboardPage({
  user,
  setUser,
}: DashboardPageProps): JSX.Element {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [productImages, setProductImages] = useState<SignedImage[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      try {
        const dashboardData: DashboardData = await getDashboardData();
        const imagesKeys: string[] = dashboardData.products.map(
          (product) => product.image_key,
        );
        const imagesUrls: SignedImage[] = await getSignedImageUrls(imagesKeys);

        setDashboardData(dashboardData);
        setProductImages(imagesUrls);
        setIsLoading(false);
      } catch (err) {
        console.log("Failed to load dashboard", err);
        setIsLoading(false);
        setError(String(err));
      }
    }
    fetchData();
  }, [user]);

  if (isLoading) {
    return <ThreeDot color="#3b82f6" size="medium" text="" textColor="" />;
  }
  if (error) {
    return <h1>{error}</h1>;
  }
  if (!(dashboardData && productImages)) {
    return <h1>No data available</h1>;
  }
  if (!user) {
    return <h1>Login in first</h1>;
  }
  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <header>
        <h2>Products</h2>
      </header>
      <section>
        <ul className={styles.products}>
          {dashboardData.products.map((product) => {
            const imageData: SignedImage | undefined = productImages.find(
              (image) => image.key === product.image_key,
            );
            if (
              !imageData ||
              (user["custom:role"] === "standard" &&
                product.role !== "standard")
            ) {
              return null;
            }
            return (
              <li key={product.id} className="product">
                <Product
                  product={product}
                  signedUrl={imageData.signedUrl}
                  user={user}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
