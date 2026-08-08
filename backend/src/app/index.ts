import express from "express";
import kmRouter from "./modules/km/km.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./common/utils/auth";

export function createApplication() {
  const app = express();

  app.all("/api/auth/*", toNodeHandler(auth));
  app.use(express.json());
  app.use("/api/km", kmRouter);

  app.get("/health", (req, res) => {
    res.json({ status: "Server healthy" });
  });

  return app;
}
