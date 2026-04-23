"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardCashFlow, getDashboardOccupancy, getDashboardOverduePayments, getDashboardProfitability, getDashboardSummary } from "../dashboard";
export const dashboardSummaryQueryKey = ["dashboard", "summary"];
export const dashboardCashFlowQueryKey = ["dashboard", "cash-flow"];
export const dashboardProfitabilityQueryKey = ["dashboard", "profitability"];
export const dashboardOccupancyQueryKey = ["dashboard", "occupancy"];
export const dashboardOverduePaymentsQueryKey = ["dashboard", "overdue-payments"];
export function useDashboardSummaryQuery() {
    return useQuery({
        queryKey: dashboardSummaryQueryKey,
        queryFn: getDashboardSummary
    });
}
export function useDashboardCashFlowQuery() {
    return useQuery({
        queryKey: dashboardCashFlowQueryKey,
        queryFn: getDashboardCashFlow
    });
}
export function useDashboardProfitabilityQuery() {
    return useQuery({
        queryKey: dashboardProfitabilityQueryKey,
        queryFn: getDashboardProfitability
    });
}
export function useDashboardOccupancyQuery() {
    return useQuery({
        queryKey: dashboardOccupancyQueryKey,
        queryFn: getDashboardOccupancy
    });
}
export function useDashboardOverduePaymentsQuery() {
    return useQuery({
        queryKey: dashboardOverduePaymentsQueryKey,
        queryFn: getDashboardOverduePayments
    });
}
