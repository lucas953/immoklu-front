import type {
  CreateDocumentInput,
  DeleteDocumentResponse,
  DocumentDownloadUrlResponse,
  DocumentResponse,
  InitiateDocumentUploadInput,
  InitiateDocumentUploadResponse,
  UpdateDocumentInput
} from "@immoklu/types";
import { apiRequest } from "./http";

export function getDocuments() {
  return apiRequest<DocumentResponse[]>("/documents", {
    method: "GET"
  });
}

export function initiateDocumentUpload(input: InitiateDocumentUploadInput) {
  return apiRequest<InitiateDocumentUploadResponse>("/documents/uploads/initiate", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function createDocument(input: CreateDocumentInput) {
  return apiRequest<DocumentResponse>("/documents", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateDocument(documentId: string, input: UpdateDocumentInput) {
  return apiRequest<DocumentResponse>(`/documents/${documentId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteDocument(documentId: string) {
  return apiRequest<DeleteDocumentResponse>(`/documents/${documentId}`, {
    method: "DELETE"
  });
}

export function getDocumentDownloadUrl(documentId: string) {
  return apiRequest<DocumentDownloadUrlResponse>(`/documents/${documentId}/download-url`, {
    method: "GET"
  });
}
