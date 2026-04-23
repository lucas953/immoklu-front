import { getApiBaseUrl } from "./http";
import { apiRequest } from "./http";
export function getReports() {
    return apiRequest("/reports", {
        method: "GET"
    });
}
export function createReport(input) {
    return apiRequest("/reports", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function getReport(reportId) {
    return apiRequest(`/reports/${reportId}`, {
        method: "GET"
    });
}
export async function downloadReport(reportId) {
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
