import type { JSX } from "react";
import type { ProductProps } from "../../types";
import styles from "./styles.module.css";

export default function Product({
  product,
  signedUrl,
  user,
}: ProductProps): JSX.Element {
  const isUserAdmin: boolean = user["custom:role"] === "admin";

  return (
    <div className={styles.product}>
      <img src={signedUrl} alt={product.name} className={styles.image} />
      {isUserAdmin ? (
        <div className={styles.productDetails}>
          <p>Name: {product.name}</p>
          <p>Product Id: {product.id}</p>
          <p>Price: ${product.price}</p>
          <p>S3 key: {product.image_key}</p>
        </div>
      ) : (
        <div className={styles.productDetails}>
          <p>Name: {product.name}</p>
          <p>Price: ${product.price}</p>
        </div>
      )}
    </div>
  );
}
