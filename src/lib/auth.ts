// OK

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Reuse MongoClient in development to prevent connection exhaustion
const uri = (process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.NEXT_PUBLIC_MONGODB_URI ||
  "mongodb://localhost:27017/assignment-08") as string;

const client = new MongoClient(uri);
const db = client.db("assignment-08");

const googleClientId = (process.env.GOOGLE_CLIENT_ID || "") as string;
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "") as string;
const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

// In-memory store for demo reset tokens
export const demoResetTokens = new Map<string, string>();

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.APP_URL ||
    "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "booknook_super_secure_jwt_secret_32_chars_key_2026!",
  database: mongodbAdapter(db),
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
        issuer:
          process.env.BETTER_AUTH_URL ||
          process.env.APP_URL ||
          "http://localhost:3000",
        audience:
          process.env.API_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000",
        expirationTime: "10000m",
      },
    }),
  ],
});
