// OK

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { demoResetTokens } from "./demo-tokens";

export { demoResetTokens };
const uri = (process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.NEXT_PUBLIC_MONGODB_URI ||
  "mongodb+srv://assignment_08:0LWjCTAqpWskwG1W@cluster0.p16xpfx.mongodb.net/assignment-08?retryWrites=true&w=majority") as string;

const client = new MongoClient(uri);
const db = client.db("assignment-08");

const googleClientId = (process.env.GOOGLE_CLIENT_ID || "") as string;
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "") as string;
const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

// Initialize BetterAuth instance
export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "booknook-client-gamma-five.vercel.app",
      "*.vercel.app",
    ],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    fallback: "https://booknook-client-gamma-five.vercel.app",
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://booknook-client-gamma-five.vercel.app",
    "https://*.vercel.app",
  ],
  advanced: {
    trustedProxyHeaders: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "A6aErmnfAplYP1ZxrLMyAPzbsRlzcbTr",
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
        issuer:
          process.env.NODE_ENV === "production"
            ? "https://booknook-client-gamma-five.vercel.app"
            : "http://localhost:3000",
        audience:
          process.env.API_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          (process.env.NODE_ENV === "production"
            ? "https://booksnook-backend.vercel.app"
            : "http://localhost:8000"),
        expirationTime: "10000m",
      },
    }),
    nextCookies(),
  ],
});
