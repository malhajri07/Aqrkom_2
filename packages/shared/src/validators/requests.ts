/**
 * Property request validation schemas - shared FE/BE
 */
import { z } from 'zod';

const requestTypeEnum = z.enum(['buy', 'rent_annual', 'rent_monthly', 'rent_daily']);
const requestStatusEnum = z.enum([
  'open', 'offers_received', 'in_review', 'in_negotiation', 'closed', 'expired',
]);

const propertyTypeEnum = z.enum([
  'apartment', 'villa', 'land', 'building', 'floor', 'shop', 'office',
  'restHouse', 'chalet', 'farm', 'warehouse', 'room', 'camp', 'other',
]);

export const requestCreateSchema = z.object({
  request_type: requestTypeEnum.default('buy'),
  property_type: propertyTypeEnum.default('apartment'),
  city: z.string().min(1, 'City required').max(100),
  districts: z.array(z.string()).min(1, 'At least one district required'),
  budget_min: z.number().positive().optional().nullable(),
  budget_max: z.number().positive('Budget max required'),
  bedrooms_min: z.number().int().min(0).optional().nullable(),
  area_min_sqm: z.number().positive().optional().nullable(),
  move_in_date: z.string().optional().nullable(),
  additional_requirements: z.string().optional(),
});

export const requestStatusSchema = z.object({
  status: requestStatusEnum,
});

export const publicRequestSubmitSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Phone required'),
  email: z.string().email().optional().or(z.literal('')),
  request_type: requestTypeEnum.optional(),
  property_type: propertyTypeEnum.optional(),
  city: z.string().optional(),
  districts: z.union([z.array(z.string()), z.string()]).optional(),
  budget_min: z.union([z.number(), z.string()]).optional(),
  budget_max: z.union([z.number().positive(), z.string().min(1, 'Budget max required')]),
  bedrooms_min: z.union([z.number(), z.string()]).optional(),
  description: z.string().optional(),
});

export type RequestCreateInput = z.infer<typeof requestCreateSchema>;
export type RequestStatusInput = z.infer<typeof requestStatusSchema>;
export type PublicRequestSubmitInput = z.infer<typeof publicRequestSubmitSchema>;
