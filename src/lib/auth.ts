// Ready
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI as string;

const client = new MongoClient(mongodbUri);
const dbName = process.env.DB_NAME;
const db = client.db(dbName);

/**
 * BetterAuth Secret & Environment Settings
 */
const authSecret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

const appUrl = process.env.APP_URL || "http://localhost:3000";
const apiUrl = process.env.API_URL || "http://localhost:8000";

let appHost = "localhost:3000";
try {
  appHost = new URL(appUrl).host;
} catch {
  // fallback to localhost
}

const allowedHosts = Array.from(
  new Set(["localhost:3000", appHost, "*.vercel.app"]),
);

const trustedOrigins = Array.from(
  new Set([
    "http://localhost:3000",
    appUrl,
    "https://*.vercel.app",
    ...(apiUrl ? [apiUrl] : []),
  ]),
);

// Initialize BetterAuth instance
export const auth = betterAuth({
  baseURL: {
    allowedHosts,
    protocol: appUrl.startsWith("https") ? "https" : "http",
    fallback: appUrl,
  },
  trustedOrigins,
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
