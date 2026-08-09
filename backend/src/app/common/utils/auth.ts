import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../../../db";
import * as schema from "../../../db/schema";

const rawAuthUrl = process.env.BETTER_AUTH_URL || "http://localhost:8080";
const baseURL = rawAuthUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const trustedOrigins = Array.from(
  new Set(
    [
      "http://localhost:5173",
      "http://localhost:8080",
      frontendUrl.replace(/\/$/, ""),
      baseURL,
    ].filter(Boolean)
  )
);

const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  advanced: {
    useSecureCookies: isProduction,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
      accessType: "offline",
      prompt: "consent",
    },
  },
});
