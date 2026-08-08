import express from "express";
import kmRouter from "./modules/km/km.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./common/utils/auth";

export function createApplication() {
  const app = express();

  app.use((req, res, next) => {
    const origin = req.headers.origin || "http://localhost:5173";
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.all('/api/auth/{*any}', toNodeHandler(auth));
  app.use(express.json());
  app.use("/api/km", kmRouter);

  app.get("/health", (req, res) => {
    res.json({ status: "Server healthy" });
  });

  return app;
}

