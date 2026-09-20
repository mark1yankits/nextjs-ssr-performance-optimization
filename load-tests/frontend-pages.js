import http from "k6/http";
import { check, sleep } from "k6";

// Compares rendering strategies under load: run with -e PAGE=/ssr, /isr, /streaming.
// Run against a production build (`npm run build && npm run start`) — `npm run dev`
// always renders live and would make ISR look identical to SSR.
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const PAGE = __ENV.PAGE || "/ssr";

// /streaming has a deliberate 2s artificial delay (see SlowArticleSection.tsx),
// so it needs a much looser latency threshold than the other pages.
const DURATION_THRESHOLD_MS = PAGE === "/streaming" ? 5000 : 500;

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_duration: [`p(95)<${DURATION_THRESHOLD_MS}`],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}${PAGE}`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(0.1);
}
