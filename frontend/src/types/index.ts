export interface User {
  id: number;
  email: string;
  name: string;
  role: "standard" | "admin";
}
export interface Product {
  id: number;
  name: string;
  description: string;
  image_key: string;
  price: number;
  visible_to_role: "standard" | "admin";
}
