export type ReportType = "INCOME" | "EXPENSE" | "PNL" | "PORTFOLIO_SUMMARY";
export type ReportFormat = "CSV" | "PDF";
export type ReportStatus = "PENDING" | "GENERATING" | "READY" | "FAILED";

export interface FinancialReportRecord {
  id: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  fromDate: string;
  toDate: string;
  baseCurrency: string;
  propertyId: string | null;
  fileName: string | null;
  generatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}
