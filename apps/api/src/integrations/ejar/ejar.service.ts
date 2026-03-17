/**
 * Ejar (إيجار) — Rental contract registration service
 * Sandbox/mock when EJAR_API_URL not set; real API when configured
 */

import type { EjarContractData, EjarContractResult } from './ejar.types.js';

const EJAR_API_URL = process.env.EJAR_API_URL;

export async function createEjarContract(data: EjarContractData): Promise<EjarContractResult> {
  if (!EJAR_API_URL) {
    // Sandbox: generate mock contract number for development
    const mockNumber = `EJAR-MOCK-${Date.now().toString(36).toUpperCase()}`;
    return {
      contractNumber: mockNumber,
      status: 'pending_verification',
      message: 'Sandbox mode: Contract created locally. Configure EJAR_API_URL for production.',
    };
  }

  // Production: call Ejar API
  const res = await fetch(`${EJAR_API_URL}/contracts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EJAR_API_KEY || ''}` },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Ejar API error: ${res.status}`);
  }

  const body = (await res.json()) as EjarContractResult;
  return body;
}
