/**
 * ZATCA (هيئة الزكاة والضريبة) — E-Invoicing service
 * Generates commission invoices with 15% VAT, QR code (TLV)
 */

import type { ZATCAInvoice } from './zatca.types.js';

const VAT_RATE = 0.15;

export function generateCommissionInvoice(params: {
  transactionId: string;
  buyerName: string;
  buyerVatNumber?: string;
  description: string;
  amountExclVat: number;
  invoiceNumber: string;
}): ZATCAInvoice {
  const vatAmount = Math.round(params.amountExclVat * VAT_RATE * 100) / 100;
  const totalAmount = params.amountExclVat + vatAmount;
  const now = new Date();

  const invoice: ZATCAInvoice = {
    invoiceNumber: params.invoiceNumber,
    invoiceType: 'standard',
    issueDate: now.toISOString().slice(0, 10),
    issueTime: now.toTimeString().slice(0, 8),
    currencyCode: 'SAR',
    seller: {
      name: process.env.ZATCA_SELLER_NAME || 'Aqarkom Real Estate',
      vatNumber: process.env.ZATCA_VAT_NUMBER || '300000000000003',
      city: 'Riyadh',
      countryCode: 'SA',
    },
    buyer: {
      name: params.buyerName,
      vatNumber: params.buyerVatNumber,
    },
    lineItems: [
      {
        description: params.description,
        quantity: 1,
        unitPrice: params.amountExclVat,
        vatCategory: 'S',
        vatRate: VAT_RATE,
        vatAmount,
        lineTotal: totalAmount,
      },
    ],
    subtotal: params.amountExclVat,
    totalDiscount: 0,
    totalVAT: vatAmount,
    totalAmount,
  };

  // QR code (TLV) - simplified for sandbox; production requires full ZATCA spec
  if (process.env.ZATCA_GENERATE_QR === 'true') {
    invoice.qrCode = generateSimplifiedQR(invoice);
  }

  return invoice;
}

function generateSimplifiedQR(invoice: ZATCAInvoice): string {
  // TLV format for ZATCA QR: Seller name, VAT number, Timestamp, Total, VAT
  const segments = [
    { tag: 1, value: invoice.seller.name },
    { tag: 2, value: invoice.seller.vatNumber },
    { tag: 3, value: `${invoice.issueDate}T${invoice.issueTime}` },
    { tag: 4, value: invoice.totalAmount.toString() },
    { tag: 5, value: invoice.totalVAT.toString() },
  ];
  const tlv = segments.map((s) => s.tag.toString(16).padStart(2, '0') + s.value.length.toString(16).padStart(2, '0') + s.value).join('');
  return Buffer.from(tlv, 'utf8').toString('base64');
}
