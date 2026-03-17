-- Migration 007: encrypted_nin for Nafath verification
-- NIN stored encrypted (AES-256-GCM) when user verifies via Nafath

ALTER TABLE users ADD COLUMN IF NOT EXISTS encrypted_nin TEXT;
