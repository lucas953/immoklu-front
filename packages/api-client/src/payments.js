import { apiRequest } from "./http";
export function getPayments() {
    return apiRequest("/payments", {
        method: "GET"
    });
}
export function createPayment(input) {
    return apiRequest("/payments", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updatePayment(paymentId, input) {
    return apiRequest(`/payments/${paymentId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function markPaymentPaid(paymentId, input = {}) {
    return apiRequest(`/payments/${paymentId}/mark-paid`, {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function markPaymentPending(paymentId) {
    return apiRequest(`/payments/${paymentId}/mark-pending`, {
        method: "POST"
    });
}
export function markPaymentOverdue(paymentId) {
    return apiRequest(`/payments/${paymentId}/mark-overdue`, {
        method: "POST"
    });
}
