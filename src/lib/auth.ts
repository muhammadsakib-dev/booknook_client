// OK

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { demoResetTokens } from "./demo-tokens";

export { demoResetTokens };

/**
 * MongoDB Database Configuration
 * Strictly driven by environment variables to prevent secret leakage.
 * A safe local loopback address is provided as fallback during build-time module evaluation.
 */
const mongodbUri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb://127.0.0.1:27017/assignment-08";

const client = new MongoClient(mongodbUri);
const dbName = process.env.DB_NAME || "assignment-08";
const db = client.db(dbName);

/**
 * BetterAuth Secret & Environment Settings
 */
const authSecret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
const isProduction = process.env.NODE_ENV === "production";

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

const appUrl =
  process.env.APP_URL ||
  process.env.BETTER_AUTH_URL ||
  (isProduction
    ? "https://booknook-client-gamma-five.vercel.app"
    : "http://localhost:3000");

const apiUrl =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (isProduction
    ? "https://booksnook-backend.vercel.app"
    : "http://localhost:8000");

// Initialize BetterAuth instance
export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "booknook-client-gamma-five.vercel.app",
      "*.vercel.app",
    ],
    protocol: isProduction ? "https" : "http",
    fallback: appUrl,
  },
  trustedOrigins: Array.from(
    new Set([
      "http://localhost:3000",
      "https://booknook-client-gamma-five.vercel.app",
      "https://*.vercel.app",
      ...(appUrl ? [appUrl] : []),
    ]),
  ),
  advanced: {
    trustedProxyHeaders: true,
  },
  secret: authSecret,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireUppercase: true,
    requireLowercase: true,
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`[Password Reset] Link for ${user.email}: ${url}`);
      demoResetTokens.set(user.email.toLowerCase(), token);
    },
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      enabled: isGoogleEnabled,
      accessType: "offline",
    },
  },
  plugins: [
    jwt({
      jwks: {
        disablePrivateKeyEncryption: true,
      },
      jwt: {
        issuer: appUrl,
        audience: apiUrl,
        expirationTime: "10000m",
      },
    }),
    nextCookies(),
  ],
});
