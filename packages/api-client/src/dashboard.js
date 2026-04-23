import { apiRequest } from "./http";
export function getDashboardSummary() {
    return apiRequest("/dashboard/summary", {
        method: "GET"
    });
}
export function getDashboardCashFlow() {
    return apiRequest("/dashboard/cash-flow", {
        method: "GET"
    });
}
export function getDashboardProfitability() {
    return apiRequest("/dashboard/profitability", {
        method: "GET"
    });
}
export function getDashboardOccupancy() {
    return apiRequest("/dashboard/occupancy", {
        method: "GET"
    });
}
export function getDashboardOverduePayments() {
    return apiRequest("/dashboard/overdue-payments", {
        method: "GET"
    });
}
