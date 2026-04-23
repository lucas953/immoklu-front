import { apiRequest } from "./http";
export function getProperties() {
    return apiRequest("/properties", {
        method: "GET"
    });
}
export function createProperty(input) {
    return apiRequest("/properties", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updateProperty(propertyId, input) {
    return apiRequest(`/properties/${propertyId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function archiveProperty(propertyId) {
    return apiRequest(`/properties/${propertyId}/archive`, {
        method: "POST"
    });
}
export function unarchiveProperty(propertyId) {
    return apiRequest(`/properties/${propertyId}/unarchive`, {
        method: "POST"
    });
}
