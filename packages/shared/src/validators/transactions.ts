/**
 * Transaction validation schemas - shared FE/BE
 */
import { z } from 'zod';

const transactionStatusEnum = z.enum([
  'initiated', 'active', 'under_contract', 'pending_close', 'closed', 'cancelled',
]);

export const transactionUpdateSchema = z.object({
  status: transactionStatusEnum.optional(),
  list_price: z.number().positive().optional().nullable(),
  final_price: z.number().positive().optional().nullable(),
  commission_rate: z.number().min(0).max(1).optional().nullable(),
  commission_amount: z.number().min(0).optional().nullable(),
  vat_amount: z.number().min(0).optional().nullable(),
  contract_date: z.string().optional().nullable(),
  closing_date: z.string().optional().nullable(),
  lease_start: z.string().optional().nullable(),
  lease_end: z.string().optional().nullable(),
  lease_monthly_rent: z.number().min(0).optional().nullable(),
  deposit_amount: z.number().min(0).optional().nullable(),
  ejar_contract_number: z.string().max(50).optional().nullable(),
}).strict();

export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>;
