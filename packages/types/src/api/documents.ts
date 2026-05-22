import type {
  DocumentCategory,
  DocumentDirectUploadResult,
  DocumentDownloadUrlResult,
  DocumentExtractionRecord,
  DocumentRecord,
  DocumentUploadInitResult
} from "../domain/document";

export interface InitiateDocumentUploadInput {
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface CreateDocumentInput {
  category: DocumentCategory;
  title?: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  objectKey: string;
  checksum?: string;
  propertyId?: string;
  unitId?: string;
  tenantId?: string;
  leaseId?: string;
  expenseId?: string;
  tagNames: string[];
  metadata?: Record<string, unknown>;
}

export type UpdateDocumentInput = Partial<
  Pick<CreateDocumentInput, "category" | "title" | "propertyId" | "unitId" | "tenantId" | "leaseId" | "expenseId" | "metadata">
> & {
  tagNames?: string[];
};

export type DocumentResponse = DocumentRecord;
export type DocumentExtractionResponse = DocumentExtractionRecord | null;
export type InitiateDocumentUploadResponse = DocumentUploadInitResult;
export type DirectDocumentUploadResponse = DocumentDirectUploadResult;
export type DocumentDownloadUrlResponse = DocumentDownloadUrlResult;

export interface DeleteDocumentResponse {
  success: boolean;
}
