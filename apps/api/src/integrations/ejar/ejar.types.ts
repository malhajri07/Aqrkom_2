/**
 * Ejar (إيجار) — Rental contract types
 * Ministry of Housing platform for digital contract registration
 */

export interface EjarContractData {
  transactionId: string;
  propertyType: 'residential' | 'commercial';
  propertyUsage?: 'housing' | 'office' | 'retail' | 'warehouse';
  deedNumber?: string;
  buildingNumber?: string;
  unitNumber?: string;
  city: string;
  district: string;
  postalCode?: string;
  landlordNIN?: string;
  landlordName: string;
  landlordPhone: string;
  landlordBankIBAN?: string;
  tenantNIN?: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  securityDeposit?: number;
  maintenanceResponsibility?: 'landlord' | 'tenant' | 'shared';
  electricityAccount?: string;
  waterAccount?: string;
  brokerLicenseNumber?: string;
  brokerCommission?: number;
}

export interface EjarContractResult {
  contractNumber: string;
  status: 'pending_verification' | 'active' | 'rejected';
  message?: string;
}
