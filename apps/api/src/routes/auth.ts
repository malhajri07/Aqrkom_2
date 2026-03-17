import { Router, Request } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken, signAccessToken } from '../middleware/auth.js';
import { createRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/refreshToken.js';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from '../middleware/refreshCookie.js';
import { loginSchema, registerSchema, otpSendSchema, otpVerifySchema } from '@aqarkom/shared';
import { getRedis } from '../redis.js';
import { initNafath, handleNafathCallback } from '../integrations/nafath/nafath.service.js';

const router: Router = Router();

function setAuthResponse(
  res: import('express').Response,
  user: { id: string; email: string; role: string; first_name_ar?: string; last_name_ar?: string },
  refreshToken: string
) {
  setRefreshTokenCookie(res, refreshToken);
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name_ar: user.first_name_ar,
      last_name_ar: user.last_name_ar,
    },
    token: accessToken,
    expiresIn: '15m',
  });
}

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse({
      ...req.body,
      role: req.body.role || 'broker',
    });
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const { email, phone, password, role, first_name_ar, last_name_ar, rega_license_number } = parsed.data;

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query<{ id: string; email: string }>(
      `INSERT INTO users (email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email`,
      [email, phone, passwordHash, role ?? 'broker', first_name_ar, last_name_ar, rega_license_number ?? null]
    );

    const user = result.rows[0];
    const userRole = role ?? 'broker';
    const refreshToken = await createRefreshToken(user.id);
    res.status(201);
    setAuthResponse(res, { ...user, role: userRole }, refreshToken);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23505') {
      return res.status(409).json({ error: 'Email or phone already registered' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const { email, password } = parsed.data;

    const result = await query<{
      id: string;
      email: string;
      password_hash: string;
      role: string;
      first_name_ar: string;
      last_name_ar: string;
      is_active: boolean;
    }>(
      'SELECT id, email, password_hash, role, first_name_ar, last_name_ar, is_active FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const refreshToken = await createRefreshToken(user.id);
    setAuthResponse(res, user, refreshToken);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const token = getRefreshTokenFromCookie(req as Request & { cookies?: { refresh_token?: string } });
    if (!token) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: 'Refresh token required', message_en: 'Refresh token required' });
    }

    const payload = await verifyRefreshToken(token);
    if (!payload) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: 'Invalid or expired refresh token', message_en: 'Invalid or expired refresh token' });
    }

    const r = await query<{ id: string; email: string; role: string; first_name_ar: string; last_name_ar: string }>(
      'SELECT id, email, role, first_name_ar, last_name_ar FROM users WHERE id = $1 AND is_active = true',
      [payload.userId]
    );
    const user = r.rows[0];
    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: 'User not found', message_en: 'User not found' });
    }

    await revokeRefreshToken(token);
    const newRefreshToken = await createRefreshToken(user.id);
    setRefreshTokenCookie(res, newRefreshToken);

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name_ar: user.first_name_ar,
        last_name_ar: user.last_name_ar,
      },
      token: accessToken,
      expiresIn: '15m',
    });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

router.post('/nafath/init', async (_req, res) => {
  try {
    const result = await initNafath();
    if (!result) {
      return res.status(503).json({ error: 'Nafath غير متاح', message_en: 'Nafath not available' });
    }
    res.json(result);
  } catch (err) {
    console.error('Nafath init error:', err);
    res.status(500).json({ error: 'فشل تهيئة نفاذ', message_en: 'Nafath init failed' });
  }
});

router.get('/nafath/callback', async (req, res) => {
  try {
    const { transactionId, mock, nationalId, fullNameAr, fullNameEn } = req.query;
    const payload = {
      transactionId: String(transactionId || ''),
      token: mock ? 'mock' : '',
      nationalId: nationalId ? String(nationalId) : undefined,
      fullNameAr: fullNameAr ? String(fullNameAr) : undefined,
      fullNameEn: fullNameEn ? String(fullNameEn) : undefined,
    };
    const user = await handleNafathCallback(payload);
    if (!user) {
      const appUrl = process.env.APP_URL || 'http://localhost:5173';
      return res.redirect(`${appUrl}/login?error=nafath_failed`);
    }
    const refreshToken = await createRefreshToken(user.id);
    setRefreshTokenCookie(res, refreshToken);
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    res.redirect(`${appUrl}/dashboard?token=${accessToken}`);
  } catch (err) {
    console.error('Nafath callback error:', err);
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    res.redirect(`${appUrl}/login?error=nafath_failed`);
  }
});

router.post('/nafath/callback', async (req, res) => {
  try {
    const payload = {
      transactionId: req.body.transactionId || '',
      token: req.body.token || '',
      nationalId: req.body.nationalId,
      fullNameAr: req.body.fullNameAr,
      fullNameEn: req.body.fullNameEn,
    };
    const user = await handleNafathCallback(payload);
    if (!user) {
      return res.status(400).json({ error: 'فشل التحقق من نفاذ', message_en: 'Nafath verification failed' });
    }
    const refreshToken = await createRefreshToken(user.id);
    setRefreshTokenCookie(res, refreshToken);
    setAuthResponse(res, user, refreshToken);
  } catch (err) {
    console.error('Nafath callback error:', err);
    res.status(500).json({ error: 'فشل التحقق من نفاذ', message_en: 'Nafath verification failed' });
  }
});

router.post('/logout', async (req, res) => {
  const token = getRefreshTokenFromCookie(req as Request & { cookies?: { refresh_token?: string } });
  if (token) {
    await revokeRefreshToken(token).catch(() => {});
  }
  clearRefreshTokenCookie(res);
  res.json({ message: 'Logged out', message_en: 'Logged out' });
});

router.post('/otp/send', async (req, res) => {
  try {
    const parsed = otpSendSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const { phone } = parsed.data;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const redis = getRedis();
    if (redis) {
      await redis.setex(`otp:${phone}`, 600, code);
    } else {
      const store = (globalThis as unknown as { __otpStore?: Map<string, { code: string; expires: number }> }).__otpStore ??= new Map();
      store.set(phone, {
        code,
        expires: Date.now() + 600000,
      });
    }
    // TODO: Send via Unifonic when UNIFONIC_APP_SID set
    if (process.env.UNIFONIC_APP_SID) {
      // await sendSms(phone, `رمز التحقق: ${code}`);
    } else {
      console.log(`[OTP] ${phone} -> ${code} (dev mode, SMS not configured)`);
    }

    res.json({ message: 'OTP sent', message_en: 'OTP sent', expiresIn: 600 });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const { phone, code } = parsed.data;

    const redis = getRedis();
    let stored: string | null = null;
    if (redis) {
      stored = await redis.get(`otp:${phone}`);
      if (stored) await redis.del(`otp:${phone}`);
    } else {
      const store = (globalThis as unknown as { __otpStore?: Map<string, { code: string; expires: number }> }).__otpStore;
      const entry = store?.get(phone);
      if (entry && entry.expires > Date.now()) {
        stored = entry.code;
        store?.delete(phone);
      }
    }

    if (!stored || stored !== code) {
      return res.status(400).json({ error: 'Invalid or expired OTP', message_en: 'Invalid or expired OTP' });
    }

    const r = await query<{ id: string; email: string; role: string; first_name_ar: string; last_name_ar: string }>(
      'SELECT id, email, role, first_name_ar, last_name_ar FROM users WHERE phone = $1 AND is_active = true',
      [phone]
    );
    const user = r.rows[0];
    if (!user) {
      return res.json({ verified: true, message: 'OTP verified', message_en: 'OTP verified' });
    }

    const refreshToken = await createRefreshToken(user.id);
    setRefreshTokenCookie(res, refreshToken);
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      verified: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name_ar: user.first_name_ar,
        last_name_ar: user.last_name_ar,
      },
      token: accessToken,
      expiresIn: '15m',
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

export default router;
