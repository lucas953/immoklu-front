import type { CreatePropertyInput, PropertyResponse, UpdatePropertyInput } from "@immoklu/types";
import { apiRequest } from "./http";

export function getProperties() {
  return apiRequest<PropertyResponse[]>("/properties", {
    method: "GET"
  });
}

export function createProperty(input: CreatePropertyInput) {
  return apiRequest<PropertyResponse>("/properties", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateProperty(propertyId: string, input: UpdatePropertyInput) {
  return apiRequest<PropertyResponse>(`/properties/${propertyId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function archiveProperty(propertyId: string) {
  return apiRequest<PropertyResponse>(`/properties/${propertyId}/archive`, {
    method: "POST"
  });
}

export function unarchiveProperty(propertyId: string) {
  return apiRequest<PropertyResponse>(`/properties/${propertyId}/unarchive`, {
    method: "POST"
  });
}
