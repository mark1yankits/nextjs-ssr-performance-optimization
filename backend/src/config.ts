import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl:
    process.env.DATABASE_URL ?? "postgres://practic:practic@localhost:5433/practic",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  // Lets load tests run an identical scenario with caching fully bypassed,
  // for a clean "without cache" vs "with cache" comparison.
  cacheEnabled: process.env.DISABLE_CACHE !== "true",
};
