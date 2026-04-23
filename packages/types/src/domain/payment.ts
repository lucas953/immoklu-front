export type RentPaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "PARTIALLY_PAID";
export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "CARD" | "DIRECT_DEBIT" | "OTHER";

export interface PaymentRecord {
  id: string;
  leaseId: string;
  propertyId: string;
  tenantId: string;
  property: {
    id: string;
    name: string;
  };
  tenant: {
    id: string;
    fullName: string;
  };
  lease: {
    id: string;
    startDate: string;
    endDate: string | null;
  };
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  paidDate: string | null;
  amountDue: string;
  amountPaid: string;
  currency: string;
  paymentMethod: PaymentMethod | null;
  status: RentPaymentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
