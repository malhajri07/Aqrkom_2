/**
 * Property validation schemas - shared FE/BE
 */
import { z } from 'zod';

const propertyTypeEnum = z.enum([
  'apartment', 'villa', 'land', 'building', 'floor', 'shop', 'office',
  'restHouse', 'chalet', 'farm', 'warehouse', 'room', 'camp', 'other',
]);

const transactionTypeEnum = z.enum([
  'sale', 'annual_rent', 'monthly_rent', 'daily_rent', 'sale_and_rent',
]);

const propertyStatusEnum = z.enum([
  'active', 'pending', 'under_contract', 'sold', 'leased', 'withdrawn', 'expired',
]);

const priceTypeEnum = z.enum(['total', 'per_sqm', 'yearly', 'monthly', 'daily']);
const furnishedEnum = z.enum(['unfurnished', 'partially', 'fully']);

export const propertyCreateSchema = z.object({
  rega_ad_license: z.string().min(1, 'REGA license required').max(30),
  property_type: propertyTypeEnum,
  transaction_type: transactionTypeEnum,
  title_ar: z.string().min(1, 'Arabic title required').max(500),
  title_en: z.string().max(500).optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  city: z.string().min(1, 'City required').max(100),
  district: z.string().min(1, 'District required').max(100),
  street: z.string().max(255).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  price: z.number().positive('Price must be positive'),
  price_type: priceTypeEnum.default('total'),
  area_sqm: z.number().positive().optional().nullable(),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
  living_rooms: z.number().int().min(0).optional().nullable(),
  floor_number: z.number().int().min(0).optional().nullable(),
  total_floors: z.number().int().min(0).optional().nullable(),
  year_built: z.number().int().min(1900).max(2100).optional().nullable(),
  furnished: furnishedEnum.optional().nullable(),
  features: z.record(z.unknown()).optional().nullable(),
  photos: z.array(z.string()).optional().nullable(),
  video_url: z.string().url().optional().nullable().or(z.literal('')),
  virtual_tour_url: z.string().url().optional().nullable().or(z.literal('')),
  expiration_date: z.string().optional().nullable(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial().extend({
  status: propertyStatusEnum.optional(),
});

export const propertyStatusSchema = z.object({
  status: propertyStatusEnum,
});

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
export type PropertyStatusInput = z.infer<typeof propertyStatusSchema>;
