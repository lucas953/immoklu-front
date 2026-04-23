import type { CreateLeaseInput, LeaseResponse, TerminateLeaseInput, UpdateLeaseInput } from "@immoklu/types";
import { apiRequest } from "./http";

export function getLeases() {
  return apiRequest<LeaseResponse[]>("/leases", {
    method: "GET"
  });
}

export function createLease(input: CreateLeaseInput) {
  return apiRequest<LeaseResponse>("/leases", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateLease(leaseId: string, input: UpdateLeaseInput) {
  return apiRequest<LeaseResponse>(`/leases/${leaseId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function terminateLease(leaseId: string, input: TerminateLeaseInput = {}) {
  return apiRequest<LeaseResponse>(`/leases/${leaseId}/terminate`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}
