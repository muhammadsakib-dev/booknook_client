// Completed

import { getAuthToken } from "@/lib/auth-client";

const getApiBaseUrl = () => {
  const url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (process.env.NODE_ENV === "production") {
    if (url && !url.includes("localhost")) {
      return url.replace(/\/+$/, "");
    }
    return "https://booksnook-backend.vercel.app";
  }
  return url || "http://localhost:8000";
};

export const API_BASE_URL = getApiBaseUrl();

// Get headers with optional JWT Bearer token

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function notifyInventoryUpdated(): void {}
