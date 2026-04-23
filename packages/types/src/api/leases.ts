import type { LeaseRecord, LeaseStatus, PaymentFrequency } from "../domain/lease";

export interface CreateLeaseInput {
  propertyId: string;
  unitId?: string;
  tenantId: string;
  startDate: string;
  endDate?: string;
  monthlyRent: string;
  depositAmount?: string;
  currency: string;
  paymentFrequency: PaymentFrequency;
  paymentDayOfMonth: number;
  status: LeaseStatus;
  notes?: string;
}

export type UpdateLeaseInput = Partial<CreateLeaseInput>;

export interface TerminateLeaseInput {
  terminatedAt?: string;
  notes?: string;
}

export type LeaseResponse = LeaseRecord;
