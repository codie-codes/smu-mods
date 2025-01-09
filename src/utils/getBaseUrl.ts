import { env } from "@/env";

const PROD_URL = `https://smumods.sg`;
export function getBaseUrl(getProductionUrl = false) {
  if (getProductionUrl) return PROD_URL;
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL && env.NEXT_PUBLIC_NODE_ENV == "production")
    return PROD_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
