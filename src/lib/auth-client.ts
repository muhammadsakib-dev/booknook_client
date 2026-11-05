// Completed

import { createAuthClient } from "better-auth/react";

const getClientBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://booknook-client-gamma-five.vercel.app";
  }
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getClientBaseUrl(),
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
