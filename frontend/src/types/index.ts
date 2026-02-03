export type Role = "standard" | "admin";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  image_key: string;
  price: number;
  role: Role;
}
export interface DashboardData {
  products: Product[];
}
export interface SignedImage {
  key: string;
  signedUrl: string;
}
