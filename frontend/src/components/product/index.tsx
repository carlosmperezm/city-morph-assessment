import type { JSX } from "react";
import type { ProductProps } from "../../types";
import styles from "./styles.module.css";

export default function Product({
  product,
  signedUrl,
}: ProductProps): JSX.Element {
  return (
    <div className={styles.product}>
      <img src={signedUrl} alt={product.name} className={styles.image} />
      <p className="product-name">Name: {product.name}</p>
      <p className="product-price">Price: ${product.price}</p>
    </div>
  );
}
