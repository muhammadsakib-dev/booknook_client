import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Reuse MongoClient in development to prevent connection exhaustion
const uri =
  process.env.MONGODB_URL ||
  "mongodb+srv://assignment_08:0LWjCTAqpWskwG1W@cluster0.p16xpfx.mongodb.net/";

const client = new MongoClient(uri);
const db = client.db("assignment-08");

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "booknook_super_secure_jwt_secret_32_chars_key_2026!",
  database: mongodbAdapter(db),
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
      jwt: {
        issuer: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        audience: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        expirationTime: "15m",
      },
    }),
  ],
});
