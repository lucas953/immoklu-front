import type { TenantRecord, TenantType } from "../domain/tenant";

export interface CreateTenantInput {
  fullName: string;
  email?: string;
  phone?: string;
  tenantType: TenantType;
  notes?: string;
}

export type UpdateTenantInput = Partial<CreateTenantInput>;

export type TenantResponse = TenantRecord;
