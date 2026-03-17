/**
 * Nafath (نفاذ) — Saudi National Digital Identity service
 * Sandbox: mock flow; Production: real Nafath API
 */

import crypto from 'crypto';
import { query } from '../../db.js';
import { getNafathConfig } from './nafath.config.js';
import type { NafathCallbackPayload } from './nafath.types.js';

const NIN_ENCRYPTION_KEY = process.env.NIN_ENCRYPTION_KEY || 'aqarkom-dev-32-byte-key-change-me!!';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

function encryptNIN(nin: string): string {
  const key = crypto.scryptSync(NIN_ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(nin, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export async function initNafath(): Promise<{ transactionId: string; nafathUrl: string; expiresIn: number } | null> {
  const config = getNafathConfig();
  if (!config.enabled) return null;

  const transactionId = crypto.randomUUID();

  if (config.environment === 'sandbox') {
    return {
      transactionId,
      nafathUrl: `${config.callbackUrl}?transactionId=${transactionId}&mock=1`,
      expiresIn: 300,
    };
  }

  const authUrl = `${config.baseUrl}/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.callbackUrl)}&response_type=code&scope=openid profile national_id&state=${transactionId}`;
  return {
    transactionId,
    nafathUrl: authUrl,
    expiresIn: 300,
  };
}

export async function handleNafathCallback(payload: NafathCallbackPayload): Promise<{
  id: string;
  email: string;
  role: string;
  first_name_ar: string;
  last_name_ar: string;
} | null> {
  const nationalId = payload.nationalId || '0000000000';
  const fullNameAr = payload.fullNameAr || 'مستخدم نفاذ';
  const fullNameEn = payload.fullNameEn || 'Nafath User';
  const parts = fullNameAr.trim().split(/\s+/);
  const first_name_ar = parts[0] || fullNameAr;
  const last_name_ar = parts.slice(1).join(' ') || fullNameAr;

  const existing = await query<{ id: string; email: string; role: string; first_name_ar: string; last_name_ar: string }>(
    'SELECT id, email, role, first_name_ar, last_name_ar FROM users WHERE email = $1',
    [`nafath-${nationalId}@nafath.sa`]
  );

  if (existing.rows[0]) {
    const u = existing.rows[0];
    await query(
      'UPDATE users SET nafath_verified = true, encrypted_nin = $1, first_name_ar = $2, last_name_ar = $3, updated_at = NOW() WHERE id = $4',
      [encryptNIN(nationalId), first_name_ar, last_name_ar, u.id]
    );
    return u;
  }

  const insert = await query<{ id: string }>(
    `INSERT INTO users (email, phone, password_hash, role, first_name_ar, last_name_ar, nafath_verified, encrypted_nin)
     VALUES ($1, $2, $3, $4, $5, $6, true, $7)
     RETURNING id`,
    [
      `nafath-${nationalId}@nafath.sa`,
      '+966500000000',
      crypto.randomBytes(32).toString('hex'),
      'broker',
      first_name_ar,
      last_name_ar,
      encryptNIN(nationalId),
    ]
  );
  const r = await query<{ id: string; email: string; role: string; first_name_ar: string; last_name_ar: string }>(
    'SELECT id, email, role, first_name_ar, last_name_ar FROM users WHERE id = $1',
    [insert.rows[0].id]
  );
  return r.rows[0];
}
