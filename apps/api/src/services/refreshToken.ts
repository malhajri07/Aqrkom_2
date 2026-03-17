/**
 * Refresh token management.
 * Tokens stored hashed in DB; httpOnly cookie for client.
 */

import crypto from 'crypto';
import { query } from '../db.js';

const REFRESH_EXPIRY_DAYS = 7;

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRY_DAYS);

  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
  return token;
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  const tokenHash = hashToken(token);
  const r = await query<{ user_id: string }>(
    `SELECT user_id FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
    [tokenHash]
  );
  if (!r.rows[0]) return null;
  return { userId: r.rows[0].user_id };
}

export async function revokeRefreshToken(token: string): Promise<boolean> {
  const tokenHash = hashToken(token);
  const r = await query(
    `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
  return (r.rowCount ?? 0) > 0;
}
