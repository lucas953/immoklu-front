import { apiRequest } from "./http";
export function getTenants() {
    return apiRequest("/tenants", {
        method: "GET"
    });
}
export function createTenant(input) {
    return apiRequest("/tenants", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updateTenant(tenantId, input) {
    return apiRequest(`/tenants/${tenantId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function archiveTenant(tenantId) {
    return apiRequest(`/tenants/${tenantId}/archive`, {
        method: "POST"
    });
}
export function unarchiveTenant(tenantId) {
    return apiRequest(`/tenants/${tenantId}/unarchive`, {
        method: "POST"
    });
}
