/**
 * Auth validation schemas - shared FE/BE
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
});

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10, 'Phone required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name_ar: z.string().min(1, 'First name required'),
  last_name_ar: z.string().min(1, 'Last name required'),
  role: z.enum(['admin', 'broker', 'agent', 'assistant', 'viewer', 'seeker', 'owner']).optional(),
  rega_license_number: z.string().optional(),
});

export const otpSendSchema = z.object({
  phone: z.string().regex(/^\+966[0-9]{9}$/, 'Saudi phone required (+966XXXXXXXXX)'),
});

export const otpVerifySchema = z.object({
  phone: z.string().regex(/^\+966[0-9]{9}$/, 'Saudi phone required'),
  code: z.string().length(6, 'OTP must be 6 digits'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpSendInput = z.infer<typeof otpSendSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
