export type TenantType = "INDIVIDUAL" | "COMPANY";
export type TenantStatus = "ACTIVE" | "ARCHIVED";

export interface TenantRecord {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  tenantType: TenantType;
  notes: string | null;
  status: TenantStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
