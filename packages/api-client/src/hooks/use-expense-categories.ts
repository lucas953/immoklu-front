"use client";

import type { CreateExpenseCategoryInput, UpdateExpenseCategoryInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveExpenseCategory,
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory
} from "../expense-categories";

export const expenseCategoriesQueryKey = ["expense-categories"] as const;

export function useExpenseCategoriesQuery() {
  return useQuery({
    queryKey: expenseCategoriesQueryKey,
    queryFn: getExpenseCategories
  });
}

export function useCreateExpenseCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseCategoryInput) => createExpenseCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseCategoriesQueryKey });
    }
  });
}

export function useUpdateExpenseCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, input }: { categoryId: string; input: UpdateExpenseCategoryInput }) =>
      updateExpenseCategory(categoryId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseCategoriesQueryKey });
    }
  });
}

export function useArchiveExpenseCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => archiveExpenseCategory(categoryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseCategoriesQueryKey });
    }
  });
}
