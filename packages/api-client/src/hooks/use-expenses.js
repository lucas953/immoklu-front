"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "../expenses";
export const expensesQueryKey = ["expenses"];
export function useExpensesQuery() {
    return useQuery({
        queryKey: expensesQueryKey,
        queryFn: getExpenses
    });
}
export function useCreateExpenseMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createExpense(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
        }
    });
}
export function useUpdateExpenseMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ expenseId, input }) => updateExpense(expenseId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
        }
    });
}
export function useDeleteExpenseMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (expenseId) => deleteExpense(expenseId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: expensesQueryKey });
        }
    });
}
