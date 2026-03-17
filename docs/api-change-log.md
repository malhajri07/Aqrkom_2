# API Change Log

All API changes are documented here. Breaking changes require deprecation notice.

---

## 2026-03-17 (Sprint B)

### Added
- `POST /api/v1/auth/nafath/init` — Initialize Nafath SSO; returns `{ transactionId, nafathUrl, expiresIn }`
- `GET /api/v1/auth/nafath/callback` — Nafath callback (sandbox redirect)
- `POST /api/v1/auth/nafath/callback` — Nafath callback (production POST)
- REGA integration: `integrations/rega/rega.service.ts` — API validation + Redis cache (24h)

### Changed
- Property create/update: REGA validation now async, uses API when REGA_API_KEY set, caches in Redis

---

## 2026-03-17 (Sprint A)

### Added
- `POST /api/v1/auth/refresh` — Refresh access token using httpOnly cookie (reads `refresh_token` cookie)
- `POST /api/v1/auth/otp/send` — Send OTP to Saudi phone (+966XXXXXXXXX). Body: `{ phone }`
- `POST /api/v1/auth/otp/verify` — Verify OTP. Body: `{ phone, code }`. Returns user + token if user exists
- BullMQ queues: `property.photos.process`, `request.match.auto`, `notification.send`, `rega.license.revalidate`
- Property photo upload now queues `property.photos.process` job when Redis available

### Changed
- Auth: Access token expiry 15min (was 7d); refresh token 7 days in httpOnly cookie
- Login/Register: Now return access token + set refresh token cookie
- Logout: Invalidates refresh token in DB and clears cookie
