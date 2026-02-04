import type { UserAttributeKey } from "aws-amplify/auth";

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
export interface DashboardPageProps {
  user: Partial<Record<UserAttributeKey, string>>;
  setUser: (user: Partial<Record<UserAttributeKey, string>> | null) => null;
}
export interface LoginPageProps {
  setUser: (user: Partial<Record<UserAttributeKey, string>> | null) => null;
}

export interface SignUpPageProps {
  setUser: (user: Partial<Record<UserAttributeKey, string>> | null) => null;
}
export interface NavbarProps {
  user: Partial<Record<UserAttributeKey, string>>;
  setUser: (user: Partial<Record<UserAttributeKey, string>> | null) => null;
}
