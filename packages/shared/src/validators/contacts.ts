/**
 * Contact validation schemas - shared FE/BE
 */
import { z } from 'zod';

const contactTypeEnum = z.enum(['buyer', 'seller', 'tenant', 'landlord', 'vendor', 'investor']);
const leadSourceEnum = z.enum(['aqar', 'dealapp', 'website', 'whatsapp', 'walkin', 'social', 'referral']);
const leadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'nurture', 'lost', 'converted']);

export const contactCreateSchema = z.object({
  contact_type: contactTypeEnum,
  first_name_ar: z.string().min(1, 'First name required').max(100),
  last_name_ar: z.string().min(1, 'Last name required').max(100),
  first_name_en: z.string().max(100).optional(),
  last_name_en: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone required (10+ digits)').max(20),
  whatsapp: z.string().max(20).optional(),
  national_id: z.string().max(20).optional(),
  company: z.string().max(255).optional(),
  lead_source: leadSourceEnum.optional(),
  lead_score: z.number().int().min(0).max(100).optional(),
  lead_status: leadStatusEnum.optional(),
  assigned_agent_id: z.string().uuid().optional().nullable(),
  pipeline_stage_id: z.string().uuid().optional().nullable(),
  tags: z.record(z.unknown()).optional().nullable(),
  notes: z.string().optional(),
});

export const contactUpdateSchema = contactCreateSchema.partial();

export type ContactCreateInput = z.infer<typeof contactCreateSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
