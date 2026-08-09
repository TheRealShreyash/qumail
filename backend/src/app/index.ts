import express from "express";
import cors from "cors";
import kmRouter from "./modules/km/km.routes";
import emailRouter from "./modules/email/email.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./common/utils/auth";

const allowedOrigins = [
  "http://localhost:5173",
  "https://qumail-nine.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

export function createApplication() {
  const app = express();

  // Trust Vercel / reverse proxy headers so secure cookies & protocol checks work properly
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
  );

  app.all('/api/auth/{*any}', toNodeHandler(auth));
  app.use(express.json());
  app.use("/api/km", kmRouter);
  app.use("/api/email", emailRouter);

  app.get("/health", (req, res) => {
    res.json({ status: "Server healthy" });
  });

  return app;
}

