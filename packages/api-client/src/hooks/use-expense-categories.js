"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveExpenseCategory, createExpenseCategory, getExpenseCategories, updateExpenseCategory } from "../expense-categories";
export const expenseCategoriesQueryKey = ["expense-categories"];
export function useExpenseCategoriesQuery() {
    return useQuery({
        queryKey: expenseCategoriesQueryKey,
        queryFn: getExpenseCategories
    });
}
export function useCreateExpenseCategoryMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createExpenseCategory(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: expenseCategoriesQueryKey });
        }
    });
}
export function useUpdateExpenseCategoryMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ categoryId, input }) => updateExpenseCategory(categoryId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: expenseCategoriesQueryKey });
        }
    });
}
export function useArchiveExpenseCategoryMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (categoryId) => archiveExpenseCategory(categoryId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: expenseCategoriesQueryKey });
        }
    });
}
