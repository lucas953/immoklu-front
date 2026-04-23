import type {
  DashboardCashFlowResponse,
  DashboardOccupancyResponse,
  DashboardOverduePaymentsResponse,
  DashboardProfitabilityResponse,
  DashboardSummaryResponse
} from "@immoklu/types";
import { apiRequest } from "./http";

export function getDashboardSummary() {
  return apiRequest<DashboardSummaryResponse>("/dashboard/summary", {
    method: "GET"
  });
}

export function getDashboardCashFlow() {
  return apiRequest<DashboardCashFlowResponse>("/dashboard/cash-flow", {
    method: "GET"
  });
}

export function getDashboardProfitability() {
  return apiRequest<DashboardProfitabilityResponse>("/dashboard/profitability", {
    method: "GET"
  });
}

export function getDashboardOccupancy() {
  return apiRequest<DashboardOccupancyResponse>("/dashboard/occupancy", {
    method: "GET"
  });
}

export function getDashboardOverduePayments() {
  return apiRequest<DashboardOverduePaymentsResponse>("/dashboard/overdue-payments", {
    method: "GET"
  });
}
