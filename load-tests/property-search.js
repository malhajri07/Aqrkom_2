/**
 * k6 load test — property search (public API)
 * Run: k6 run load-tests/property-search.js
 * Requires: API running at BASE_URL (default http://localhost:3000)
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const params = [
    {},
    { city: 'الرياض' },
    { property_type: 'apartment', transaction_type: 'sale' },
    { min_price: '100000', max_price: '500000' },
    { bedrooms: '3' },
  ];
  const q = params[Math.floor(Math.random() * params.length)];
  const url = `${BASE_URL}/api/v1/public/properties?${new URLSearchParams(q).toString()}`;
  const res = http.get(url);

  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
