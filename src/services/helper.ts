import { getAuthToken } from "@/lib/auth-client";

export const API_BASE_URL = process.env.API_URL || "http://localhost:8000";

/**
 * Returns authorization headers with JWT Bearer token if user session is active.
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Emits a global inventory update event to synchronize book copies across
 * Showcase, Catalog, and Book Details pages in real time.
 */
export function notifyInventoryUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("booknook:inventory-updated"));
  }
}
