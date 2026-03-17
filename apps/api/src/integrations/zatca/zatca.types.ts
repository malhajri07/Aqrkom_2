/**
 * ZATCA (هيئة الزكاة والضريبة) — E-Invoicing types
 * Fatoorah format for Saudi VAT compliance
 */

export interface ZATCAInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  vatCategory: 'S' | 'Z' | 'E' | 'O';
  vatRate: number;
  vatAmount: number;
  lineTotal: number;
}

export interface ZATCAInvoice {
  invoiceNumber: string;
  invoiceType: 'standard' | 'simplified' | 'credit_note' | 'debit_note';
  issueDate: string;
  issueTime: string;
  currencyCode: 'SAR';
  seller: {
    name: string;
    vatNumber: string;
    streetName?: string;
    buildingNumber?: string;
    city: string;
    postalCode?: string;
    countryCode: 'SA';
  };
  buyer: {
    name: string;
    vatNumber?: string;
    address?: string;
  };
  lineItems: ZATCAInvoiceLine[];
  subtotal: number;
  totalDiscount: number;
  totalVAT: number;
  totalAmount: number;
  qrCode?: string;
  xmlHash?: string;
  digitalSignature?: string;
}
