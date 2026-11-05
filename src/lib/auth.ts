// OK

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { demoResetTokens } from "./demo-tokens";

export { demoResetTokens };
const uri = (process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.NEXT_PUBLIC_MONGODB_URI ||
  "mongodb://localhost:27017/assignment-08") as string;

const client = new MongoClient(uri);
const db = client.db("assignment-08");

const googleClientId = (process.env.GOOGLE_CLIENT_ID || "") as string;
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "") as string;
const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

// Dynamic auth base URL resolution for localhost and production (Vercel)
const getAuthBaseUrl = () => {
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

const authBaseUrl = getAuthBaseUrl();

// Initialize BetterAuth instance
export const auth = betterAuth({
  baseURL: authBaseUrl,
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "booknook_super_secure_jwt_secret_32_chars_key_2026!",
  trustedOrigins: [
    "http://localhost:3000",
    "https://booknook-client-gamma-five.vercel.app",
    authBaseUrl,
    process.env.BETTER_AUTH_URL || "",
    process.env.APP_URL || "",
  ].filter(Boolean),
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
      jwt: {
        issuer: authBaseUrl,
        audience:
          process.env.API_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000",
        expirationTime: "10000m",
      },
    }),
  ],
});
