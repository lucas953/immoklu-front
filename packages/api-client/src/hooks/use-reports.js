"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReport, downloadReport, getReport, getReports } from "../reports";
export const reportsQueryKey = ["reports"];
export function useReportsQuery() {
    return useQuery({
        queryKey: reportsQueryKey,
        queryFn: getReports
    });
}
export function useCreateReportMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createReport(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: reportsQueryKey });
        }
    });
}
export function useReportQuery(reportId, enabled = true) {
    return useQuery({
        queryKey: [...reportsQueryKey, reportId],
        queryFn: () => getReport(reportId),
        enabled
    });
}
export function useDownloadReportMutation() {
    return useMutation({
        mutationFn: (reportId) => downloadReport(reportId)
    });
}
