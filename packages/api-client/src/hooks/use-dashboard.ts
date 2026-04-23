"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardCashFlow,
  getDashboardOccupancy,
  getDashboardOverduePayments,
  getDashboardProfitability,
  getDashboardSummary
} from "../dashboard";

export const dashboardSummaryQueryKey = ["dashboard", "summary"] as const;
export const dashboardCashFlowQueryKey = ["dashboard", "cash-flow"] as const;
export const dashboardProfitabilityQueryKey = ["dashboard", "profitability"] as const;
export const dashboardOccupancyQueryKey = ["dashboard", "occupancy"] as const;
export const dashboardOverduePaymentsQueryKey = ["dashboard", "overdue-payments"] as const;

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
