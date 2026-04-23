import type {
  CreateExpenseCategoryInput,
  ExpenseCategoryResponse,
  UpdateExpenseCategoryInput
} from "@immoklu/types";
import { apiRequest } from "./http";

export function getExpenseCategories() {
  return apiRequest<ExpenseCategoryResponse[]>("/expense-categories", {
    method: "GET"
  });
}

export function createExpenseCategory(input: CreateExpenseCategoryInput) {
  return apiRequest<ExpenseCategoryResponse>("/expense-categories", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateExpenseCategory(categoryId: string, input: UpdateExpenseCategoryInput) {
  return apiRequest<ExpenseCategoryResponse>(`/expense-categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function archiveExpenseCategory(categoryId: string) {
  return apiRequest<ExpenseCategoryResponse>(`/expense-categories/${categoryId}/archive`, {
    method: "POST"
  });
}
