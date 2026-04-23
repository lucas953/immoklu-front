import type { CreateReportInput, ReportResponse } from "@immoklu/types";
import { getApiBaseUrl } from "./http";
import { apiRequest } from "./http";

export function getReports() {
  return apiRequest<ReportResponse[]>("/reports", {
    method: "GET"
  });
}

export function createReport(input: CreateReportInput) {
  return apiRequest<ReportResponse>("/reports", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getReport(reportId: string) {
  return apiRequest<ReportResponse>(`/reports/${reportId}`, {
    method: "GET"
  });
}

export async function downloadReport(reportId: string) {
  const response = await fetch(`${getApiBaseUrl()}/v1/reports/${reportId}/download`, {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error(`Report download failed with status ${response.status}.`);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition");
  const fileNameMatch = disposition?.match(/filename="([^"]+)"/);

  return {
    blob,
    fileName: fileNameMatch?.[1] ?? `report-${reportId}`
  };
}
