import { apiRequest } from "./http";
export function getDocuments() {
    return apiRequest("/documents", {
        method: "GET"
    });
}
export function initiateDocumentUpload(input) {
    return apiRequest("/documents/uploads/initiate", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function createDocument(input) {
    return apiRequest("/documents", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updateDocument(documentId, input) {
    return apiRequest(`/documents/${documentId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function deleteDocument(documentId) {
    return apiRequest(`/documents/${documentId}`, {
        method: "DELETE"
    });
}
export function getDocumentDownloadUrl(documentId) {
    return apiRequest(`/documents/${documentId}/download-url`, {
        method: "GET"
    });
}
