/**
 * Nafath (نفاذ) — Saudi National Digital Identity types
 */

export interface NafathConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  baseUrl: string;
  scope: 'openid' | 'profile' | 'national_id';
  environment: 'sandbox' | 'production';
}

export interface NafathUserData {
  nationalId: string;
  fullNameAr: string;
  fullNameEn: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  nationality: string;
  idExpiryDate?: string;
}

export interface NafathInitResult {
  transactionId: string;
  nafathUrl: string;
  expiresIn: number;
}

export interface NafathCallbackPayload {
  transactionId: string;
  token: string;
  nationalId?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F';
}
