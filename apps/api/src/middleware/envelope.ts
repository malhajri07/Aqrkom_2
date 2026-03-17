/**
 * Response envelope middleware — wraps all JSON responses per backend_engineer spec
 * Success: { success: true, data, meta? }
 * Error: { success: false, error: { code, message, message_en, details } }
 */
import { Request, Response, NextFunction } from 'express';

const SKIP_PATHS = ['/api/health', '/api/v1/health'];

export function envelopeMiddleware(req: Request, res: Response, next: NextFunction) {
  const skip = SKIP_PATHS.some((p) => req.path === p || req.path.startsWith(p + '/'));
  if (skip) return next();

  const originalJson = res.json.bind(res);
  res.json = function (body: unknown) {
    if (body && typeof body === 'object' && 'success' in body) {
      return originalJson(body);
    }
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return originalJson({ success: true, data: body });
    }
    const err = body as { error?: string; message?: string; code?: string; message_en?: string; details?: unknown };
    const msg = err?.message || err?.error || 'Unknown error';
    return originalJson({
      success: false,
      error: {
        code: err?.code || `HTTP_${res.statusCode}`,
        message: msg,
        message_en: err?.message_en || msg,
        details: err && typeof err === 'object' && 'details' in err ? (err as { details: unknown }).details : {},
      },
    });
  };
  next();
}
