export type DocumentCategory =
  | "LEASE_CONTRACT"
  | "INVOICE"
  | "UTILITY_BILL"
  | "MORTGAGE_CONTRACT"
  | "INSURANCE"
  | "BUILDING_MEETING"
  | "TAX"
  | "MISCELLANEOUS";

export type DocumentExtractionStatus = "NOT_STARTED" | "EXTRACTED" | "NEEDS_OCR" | "FAILED";

export type DocumentParsingStatus = "NOT_STARTED" | "PARSED" | "NEEDS_REVIEW" | "CONFIRMED" | "FAILED";

export interface DocumentRecord {
  id: string;
  category: DocumentCategory;
  title: string | null;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  extractionStatus: DocumentExtractionStatus;
  parsingStatus: DocumentParsingStatus;
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

export interface DocumentDirectUploadResult {
  objectKey: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface DocumentDownloadUrlResult {
  url: string;
  expiresAt: string;
}

export interface DocumentExtractionRecord {
  id: string;
  documentId: string;
  documentExtractionStatus: DocumentExtractionStatus;
  documentParsingStatus: DocumentParsingStatus;
  extractionMethod: string;
  rawText: string | null;
  normalizedText: string | null;
  parsedJson: ParsedInvoiceData | null;
  correctedJson: ParsedInvoiceData | null;
  parserName: string | null;
  parserVersion: string | null;
  confidenceScore: string | null;
  warnings: unknown;
  missingFields: unknown;
  textChecksum: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedInvoiceData {
  document_type: string;
  supplier_name: string | null;
  supplier_tax_id: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  period_start: string | null;
  period_end: string | null;
  service_address: string | null;
  property_reference: string | null;
  total_amount: string | null;
  tax_amount: string | null;
  net_amount: string | null;
  currency: string | null;
  utility_type: string | null;
  expense_category: string | null;
  line_items: Array<Record<string, unknown>>;
  iban_last_digits: string | null;
  contract_number: string | null;
  meter_number: string | null;
  confidence: number;
  parser_name: string;
  parser_version: string;
  warnings: string[];
  missing_fields: string[];
}
