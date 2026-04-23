import type { PaymentMethod, PaymentRecord, RentPaymentStatus } from "../domain/payment";

export interface CreatePaymentInput {
  leaseId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  paidDate?: string;
  amountDue: string;
  amountPaid?: string;
  currency: string;
  paymentMethod?: PaymentMethod;
  status: RentPaymentStatus;
  notes?: string;
}

export type UpdatePaymentInput = Partial<CreatePaymentInput>;

export interface PaymentStatusInput {
  paidDate?: string;
  amountPaid?: string;
  paymentMethod?: PaymentMethod;
}

export type PaymentResponse = PaymentRecord;
