import type {
  CreatePaymentInput,
  PaymentResponse,
  PaymentStatusInput,
  UpdatePaymentInput
} from "@immoklu/types";
import { apiRequest } from "./http";

export function getPayments() {
  return apiRequest<PaymentResponse[]>("/payments", {
    method: "GET"
  });
}

export function createPayment(input: CreatePaymentInput) {
  return apiRequest<PaymentResponse>("/payments", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updatePayment(paymentId: string, input: UpdatePaymentInput) {
  return apiRequest<PaymentResponse>(`/payments/${paymentId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function markPaymentPaid(paymentId: string, input: PaymentStatusInput = {}) {
  return apiRequest<PaymentResponse>(`/payments/${paymentId}/mark-paid`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function markPaymentPending(paymentId: string) {
  return apiRequest<PaymentResponse>(`/payments/${paymentId}/mark-pending`, {
    method: "POST"
  });
}

export function markPaymentOverdue(paymentId: string) {
  return apiRequest<PaymentResponse>(`/payments/${paymentId}/mark-overdue`, {
    method: "POST"
  });
}
