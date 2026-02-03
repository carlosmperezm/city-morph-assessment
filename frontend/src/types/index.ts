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
  role: "standard" | "admin";
}
export interface DashboardData {
  user: User;
  products: Product[];
}
export interface SignedImage {
  key: string;
  signedUrl: string;
}
