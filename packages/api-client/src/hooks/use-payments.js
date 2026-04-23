"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPayment, getPayments, markPaymentOverdue, markPaymentPaid, markPaymentPending, updatePayment } from "../payments";
export const paymentsQueryKey = ["payments"];
export function usePaymentsQuery() {
    return useQuery({
        queryKey: paymentsQueryKey,
        queryFn: getPayments
    });
}
export function useCreatePaymentMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createPayment(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
        }
    });
}
export function useUpdatePaymentMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ paymentId, input }) => updatePayment(paymentId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
        }
    });
}
export function useMarkPaymentPaidMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ paymentId, input }) => markPaymentPaid(paymentId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
        }
    });
}
export function useMarkPaymentPendingMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (paymentId) => markPaymentPending(paymentId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
        }
    });
}
export function useMarkPaymentOverdueMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (paymentId) => markPaymentOverdue(paymentId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
        }
    });
}
