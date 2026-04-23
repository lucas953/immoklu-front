"use client";

import type { CreatePaymentInput, PaymentStatusInput, UpdatePaymentInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getPayments,
  markPaymentOverdue,
  markPaymentPaid,
  markPaymentPending,
  updatePayment
} from "../payments";

export const paymentsQueryKey = ["payments"] as const;

export function usePaymentsQuery() {
  return useQuery({
    queryKey: paymentsQueryKey,
    queryFn: getPayments
  });
}

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentInput) => createPayment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
    }
  });
}

export function useUpdatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, input }: { paymentId: string; input: UpdatePaymentInput }) =>
      updatePayment(paymentId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
    }
  });
}

export function useMarkPaymentPaidMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, input }: { paymentId: string; input?: PaymentStatusInput }) =>
      markPaymentPaid(paymentId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
    }
  });
}

export function useMarkPaymentPendingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => markPaymentPending(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
    }
  });
}

export function useMarkPaymentOverdueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => markPaymentOverdue(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsQueryKey });
    }
  });
}
