# Database Change Log

All schema changes are documented here.

---

## 2026-03

### Migration 007: nafath_nin
- Added `encrypted_nin` column to users (for Nafath NIN storage)

### Migration 006: refresh_tokens
- Added `refresh_tokens` table for JWT refresh flow
- Columns: id, user_id, token_hash, expires_at, revoked_at, created_at
