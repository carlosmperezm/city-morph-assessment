import type { UserAttributeKey } from "aws-amplify/auth";
import type { Dispatch, SetStateAction } from "react";

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
  setUser: Dispatch<
    SetStateAction<Partial<Record<UserAttributeKey, string>> | null>
  >;
}
export interface LoginPageProps {
  setUser: Dispatch<
    SetStateAction<Partial<Record<UserAttributeKey, string>> | null>
  >;
}

export interface SignUpPageProps {
  setUser: Dispatch<
    SetStateAction<Partial<Record<UserAttributeKey, string>> | null>
  >;
}
export interface NavbarProps {
  user: Partial<Record<UserAttributeKey, string>>;
  setUser: Dispatch<
    SetStateAction<Partial<Record<UserAttributeKey, string>> | null>
  >;
}
export interface ProductProps {
  product: Product;
  signedUrl: string;
  user: Partial<Record<UserAttributeKey, string>>;
}
