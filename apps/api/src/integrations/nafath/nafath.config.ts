/**
 * Nafath configuration
 */

export function getNafathConfig(): {
  enabled: boolean;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
} {
  const clientId = process.env.NAFATH_CLIENT_ID || '';
  const clientSecret = process.env.NAFATH_CLIENT_SECRET || '';
  const environment = (process.env.NAFATH_ENV || 'sandbox') as 'sandbox' | 'production';
  const enabled = !!(clientId && clientSecret) || environment === 'sandbox';
  const baseUrl =
    environment === 'production'
      ? 'https://nafath.sdaia.gov.sa'
      : 'https://sandbox.nafath.sdaia.gov.sa';
  const callbackUrl = `${process.env.API_URL || 'http://localhost:3000'}/api/v1/auth/nafath/callback`;

  return {
    enabled,
    baseUrl,
    clientId,
    clientSecret,
    callbackUrl,
    environment,
  };
}
