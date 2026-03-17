/**
 * REGA (هيئة العقار) — Ad License Validation
 * Format validation + API validation (when REGA_API_KEY set) + Redis cache (24h)
 */

import { getRedis } from '../../redis.js';
import type { RegaValidationResult } from './rega.types.js';

const REGA_LICENSE_PATTERN = /^[A-Za-z0-9\-]{8,30}$/;
const CACHE_TTL = 86400; // 24 hours
const CACHE_PREFIX = 'rega:';

function formatValidate(license: string): RegaValidationResult {
  if (!license || typeof license !== 'string') {
    return { valid: false, error: 'REGA license is required' };
  }
  const trimmed = license.trim();
  if (trimmed.length < 8 || trimmed.length > 30) {
    return { valid: false, error: 'REGA license must be 8-30 characters' };
  }
  if (!REGA_LICENSE_PATTERN.test(trimmed)) {
    return { valid: false, error: 'REGA license format invalid (alphanumeric and hyphens only)' };
  }
  return { valid: true, licenseNumber: trimmed };
}

async function getCachedResult(license: string): Promise<RegaValidationResult | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const cached = await redis.get(`${CACHE_PREFIX}${license}`);
    if (cached) {
      const parsed = JSON.parse(cached) as RegaValidationResult;
      return { ...parsed, cached: true };
    }
  } catch {
    // ignore
  }
  return null;
}

async function setCachedResult(license: string, result: RegaValidationResult): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.setex(`${CACHE_PREFIX}${license}`, CACHE_TTL, JSON.stringify(result));
  } catch {
    // ignore
  }
}

async function validateWithApi(license: string): Promise<RegaValidationResult> {
  const apiKey = process.env.REGA_API_KEY;
  const apiUrl = process.env.REGA_API_URL || 'https://api.rega.gov.sa';

  if (!apiKey) {
    return { ...formatValidate(license), status: 'active' };
  }

  try {
    const res = await fetch(`${apiUrl}/v1/licenses/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ licenseNumber: license }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[REGA] API error:', res.status, errText);
      return { ...formatValidate(license), status: 'active' };
    }

    const data = (await res.json()) as { valid?: boolean; status?: string };
    const result: RegaValidationResult = {
      valid: data.valid !== false,
      licenseNumber: license,
      status: (data.status as RegaValidationResult['status']) || 'active',
    };
    if (!result.valid) {
      result.error = 'REGA license invalid or expired';
    }
    return result;
  } catch (err) {
    console.error('[REGA] API request failed:', err);
    return { ...formatValidate(license), status: 'active' };
  }
}

export async function validateRegaLicense(license: string): Promise<RegaValidationResult> {
  const formatResult = formatValidate(license);
  if (!formatResult.valid) return formatResult;

  const cached = await getCachedResult(formatResult.licenseNumber!);
  if (cached) return cached;

  const apiResult = await validateWithApi(formatResult.licenseNumber!);
  await setCachedResult(formatResult.licenseNumber!, apiResult);
  return apiResult;
}
