import type { CreateTenantInput, TenantResponse, UpdateTenantInput } from "@immoklu/types";
import { apiRequest } from "./http";

export function getTenants() {
  return apiRequest<TenantResponse[]>("/tenants", {
    method: "GET"
  });
}

export function createTenant(input: CreateTenantInput) {
  return apiRequest<TenantResponse>("/tenants", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateTenant(tenantId: string, input: UpdateTenantInput) {
  return apiRequest<TenantResponse>(`/tenants/${tenantId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function archiveTenant(tenantId: string) {
  return apiRequest<TenantResponse>(`/tenants/${tenantId}/archive`, {
    method: "POST"
  });
}

export function unarchiveTenant(tenantId: string) {
  return apiRequest<TenantResponse>(`/tenants/${tenantId}/unarchive`, {
    method: "POST"
  });
}
