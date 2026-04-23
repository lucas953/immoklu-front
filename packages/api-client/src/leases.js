import { apiRequest } from "./http";
export function getLeases() {
    return apiRequest("/leases", {
        method: "GET"
    });
}
export function createLease(input) {
    return apiRequest("/leases", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updateLease(leaseId, input) {
    return apiRequest(`/leases/${leaseId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function terminateLease(leaseId, input = {}) {
    return apiRequest(`/leases/${leaseId}/terminate`, {
        method: "POST",
        body: JSON.stringify(input)
    });
}
