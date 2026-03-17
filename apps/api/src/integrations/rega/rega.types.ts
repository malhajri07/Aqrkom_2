/**
 * REGA (هيئة العقار) — Real Estate General Authority types
 */

export interface RegaValidationResult {
  valid: boolean;
  error?: string;
  cached?: boolean;
  licenseNumber?: string;
  status?: 'active' | 'expired' | 'suspended' | 'cancelled';
}
