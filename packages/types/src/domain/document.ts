export type DocumentCategory =
  | "LEASE_CONTRACT"
  | "INVOICE"
  | "UTILITY_BILL"
  | "MORTGAGE_CONTRACT"
  | "INSURANCE"
  | "BUILDING_MEETING"
  | "TAX"
  | "MISCELLANEOUS";

export interface DocumentRecord {
  id: string;
  category: DocumentCategory;
  title: string | null;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  propertyId: string | null;
  unitId: string | null;
  tenantId: string | null;
  leaseId: string | null;
  expenseId: string | null;
  property: {
    id: string;
    name: string;
  } | null;
  unit: {
    id: string;
    name: string;
  } | null;
  tenant: {
    id: string;
    fullName: string;
  } | null;
  lease: {
    id: string;
    startDate: string;
    endDate: string | null;
  } | null;
  expense: {
    id: string;
    amount: string;
    currency: string;
    expenseDate: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    color: string | null;
  }>;
  metadata: Record<string, unknown> | null;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadInitResult {
  objectKey: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadUrl: string;
  expiresAt: string;
  headers: Record<string, string>;
}

export interface DocumentDownloadUrlResult {
  url: string;
  expiresAt: string;
}
