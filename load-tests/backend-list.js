import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Load test for GET /api/articles. Run it twice against the backend to compare
// with/without cache:
//   1. normal backend (cache on)         -> npm run dev
//   2. DISABLE_CACHE=true npm run dev    -> cache off, every request hits Postgres
const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

const cacheHitRate = new Rate("cache_hit_rate");

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/articles?page=1&limit=20`);

  check(res, { "status is 200": (r) => r.status === 200 });
  cacheHitRate.add(res.headers["X-Cache"] === "HIT");

  sleep(0.1);
}
