import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
  });

  return app;
}
