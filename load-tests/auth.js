/**
 * k6 load test — auth login
 * Run: k6 run load-tests/auth.js
 * Uses demo credentials from AGENTS.md
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const DEMO_EMAIL = __ENV.DEMO_EMAIL || 'demo@aqarkom.sa';
const DEMO_PASSWORD = __ENV.DEMO_PASSWORD || 'demo123';

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '40s', target: 10 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(res, { 'status 200': (r) => r.status === 200 });
  check(res, { 'has token': (r) => {
    try {
      const body = JSON.parse(r.body);
      return !!body.token;
    } catch { return false; }
  }});
  sleep(2);
}
