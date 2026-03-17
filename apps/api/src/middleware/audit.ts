/**
 * Audit Trail - ADM-007
 */

import { Response, NextFunction } from 'express';
import { query } from '../db.js';
import { AuthRequest } from './auth.js';

export function auditLog(action: string, entityType?: string, entityId?: string) {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (req.user?.userId) {
        await query(
          `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
           VALUES ($1, $2, $3, $4, $5)`,
          [req.user.userId, action, entityType || null, entityId || req.params?.id || null, JSON.stringify(req.body || {})]
        );
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }
    next();
  };
}
