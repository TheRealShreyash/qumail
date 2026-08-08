import express from "express";

export function createApplication() {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "Server healthy" });
  });

  return app;
}
