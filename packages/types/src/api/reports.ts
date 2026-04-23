import type { FinancialReportRecord, ReportFormat, ReportType } from "../domain/report";

export interface CreateReportInput {
  type: ReportType;
  format: ReportFormat;
  fromDate: string;
  toDate: string;
  propertyId?: string;
}

export type ReportResponse = FinancialReportRecord;
