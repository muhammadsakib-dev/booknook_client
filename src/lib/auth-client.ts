// Ready - But I don't understand  everything in this file. I need Time

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.APP_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signUp } = authClient;

// In-memory token cache for high-performance JWT handling
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Clears the in-memory original JWT cache.
 */
export function clearAuthTokenCache(): void {
  cachedToken = null;
  tokenExpiresAt = 0;
}

/**
 * Custom signOut wrapper that purges in-memory token cache before signing out.
 */
const rawSignOut = authClient.signOut;
export const signOut: typeof rawSignOut = async (...args) => {
  clearAuthTokenCache();
  return rawSignOut(...args);
};

/**
 * Retrieves the short-lived API JWT from the active BetterAuth session.
 * Features smart in-memory caching with TTL buffer to eliminate duplicate network calls.
 * Used to populate Authorization: Bearer <token> on requests to the Express backend.
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const now = Date.now();
  // Return cached token if it has > 30s remaining validity
  if (cachedToken && tokenExpiresAt > now + 30_000) {
    return cachedToken;
  }

  try {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      clearAuthTokenCache();
      return null;
    }

    const data = await res.json();
    if (data.token && typeof data.token === "string") {
      cachedToken = data.token;

      // Extract expiration (exp claim) from JWT payload
      try {
        const payloadBase64 = data.token.split(".")[1];
        if (payloadBase64) {
          const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
              .join(""),
          );
          const parsed = JSON.parse(jsonPayload);
          if (parsed.exp && typeof parsed.exp === "number") {
            tokenExpiresAt = parsed.exp * 1000;
          } else {
            tokenExpiresAt = now + 5 * 60 * 1000; // 5 min fallback
          }
        }
      } catch {
        tokenExpiresAt = now + 5 * 60 * 1000;
      }

      return cachedToken;
    }

    clearAuthTokenCache();
    return null;
  } catch (error) {
    console.error("Failed to retrieve auth token:", error);
    clearAuthTokenCache();
    return null;
  }
}
