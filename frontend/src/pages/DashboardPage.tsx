import { useEffect, useState, type JSX } from "react";
import { getDashboardData, getSignedImageUrls } from "../services/apiService";
import type { DashboardData, DashboardPageProps, SignedImage } from "../types";
import { signOut } from "aws-amplify/auth";
import { useNavigate, type NavigateFunction } from "react-router-dom";

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

  const navigate: NavigateFunction = useNavigate();

  async function handleSignout(): Promise<void> {
    await signOut();
    await navigate("/login");
    setUser(null);
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
  }, [user]);

  if (isLoading) {
    return <h1>Loading</h1>;
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
  console.log("User from dash: ", user);
  return (
    <div className="dashboard">
      <header>
        <h1>City Morph Studio</h1>
        <button onClick={handleSignout}>Sign Out</button>
      </header>
      <section className="user-section">
        <h2>Hello {user.name}</h2>
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
              (user["custom:role"] === "standard" &&
                product.role !== "standard")
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
