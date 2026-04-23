export type PaymentFrequency = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";
export type LeaseStatus = "DRAFT" | "ACTIVE" | "ENDED" | "TERMINATED";

export interface LeaseSummaryRelation {
  id: string;
  name?: string;
  fullName?: string;
}

export interface LeaseRecord {
  id: string;
  propertyId: string;
  unitId: string | null;
  tenantId: string;
  property: {
    id: string;
    name: string;
  };
  tenant: {
    id: string;
    fullName: string;
  };
  startDate: string;
  endDate: string | null;
  monthlyRent: string;
  depositAmount: string | null;
  currency: string;
  paymentFrequency: PaymentFrequency;
  paymentDayOfMonth: number;
  status: LeaseStatus;
  terminatedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
