export type Role = "admin" | "standard";

export interface DbSecret {
  username: string;
  password: string;
  host: string;
  port: number;
  dbname: string;
}

export interface SignedImage {
  key: string;
  signedUrl: string;
}
