// Completed

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NODE_ENV === "production"
        ? "https://booknook-client-gamma-five.vercel.app"
        : "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  requestPasswordReset,
  resetPassword,
} = authClient;

export const forgetPassword = authClient.requestPasswordReset;

/**
 * Retrieves the short-lived API JWT from the active BetterAuth session.
 * Used to populate Authorization: Bearer <token> on requests to the Express backend.
 */

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.token || null;
  } catch (error) {
    console.error("Failed to retrieve auth token:", error);
    return null;
  }
}
