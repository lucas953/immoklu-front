"use client";

import type { CreateExpenseInput, UpdateExpenseInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "../expenses";

export const expensesQueryKey = ["expenses"] as const;

export function useExpensesQuery() {
  return useQuery({
    queryKey: expensesQueryKey,
    queryFn: getExpenses
  });
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseInput) => createExpense(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    }
  });
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, input }: { expenseId: string; input: UpdateExpenseInput }) =>
      updateExpense(expenseId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    }
  });
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => deleteExpense(expenseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    }
  });
}
