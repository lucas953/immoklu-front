import type {
  CreateDocumentInput,
  DeleteDocumentResponse,
  DirectDocumentUploadResponse,
  DocumentDownloadUrlResponse,
  DocumentExtractionResponse,
  DocumentResponse,
  InitiateDocumentUploadInput,
  InitiateDocumentUploadResponse,
  UpdateDocumentInput
} from "@immoklu/types";
import { ApiError, apiRequest, getApiBaseUrl } from "./http";

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

export async function uploadDocumentFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBaseUrl()}/v1/documents/uploads/direct`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });

  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Document upload failed with status ${response.status}.`;

    throw new ApiError(message, response.status, data);
  }

  return data as DirectDocumentUploadResponse;
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

export function extractDocumentText(documentId: string) {
  return apiRequest<NonNullable<DocumentExtractionResponse>>(`/documents/${documentId}/extract-text`, {
    method: "POST"
  });
}

export function getDocumentExtraction(documentId: string) {
  return apiRequest<DocumentExtractionResponse>(`/documents/${documentId}/extraction`, {
    method: "GET"
  });
}

export function parseDocument(documentId: string) {
  return apiRequest<NonNullable<DocumentExtractionResponse>>(`/documents/${documentId}/parse`, {
    method: "POST"
  });
}
