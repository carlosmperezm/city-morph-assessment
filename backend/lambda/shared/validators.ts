import type { Role, DbSecret } from "./types";

export function isValidRole(value: string | undefined): value is Role {
  return value === "admin" || value === "standard";
}

export function isValidDbSecret(value: unknown): value is DbSecret {
  return (
    typeof value === "object" &&
    value !== null &&
    "host" in value &&
    "port" in value &&
    "dbname" in value &&
    "username" in value &&
    "password" in value &&
    typeof (value as DbSecret).host === "string" &&
    typeof (value as DbSecret).port === "number" &&
    typeof (value as DbSecret).dbname === "string" &&
    typeof (value as DbSecret).username === "string" &&
    typeof (value as DbSecret).password === "string"
  );
}
