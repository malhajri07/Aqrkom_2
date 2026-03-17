/**
 * Refresh token cookie helpers.
 * httpOnly, 7 days, SameSite=Lax.
 */

import { Response } from 'express';

const COOKIE_NAME = 'refresh_token';
const MAX_AGE_DAYS = 7;
const MAX_AGE_SEC = MAX_AGE_DAYS * 24 * 60 * 60;

export function setRefreshTokenCookie(res: Response, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: MAX_AGE_SEC,
    path: '/api/v1/auth',
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    path: '/api/v1/auth',
  });
}

export function getRefreshTokenFromCookie(req: { cookies?: { refresh_token?: string } }): string | null {
  return req.cookies?.[COOKIE_NAME] ?? null;
}
