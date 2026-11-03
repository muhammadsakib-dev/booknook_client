
import { getAuthToken } from "@/lib/auth-client";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


// Get headers with optional JWT Bearer token
 
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


export function notifyInventoryUpdated(): void {}
