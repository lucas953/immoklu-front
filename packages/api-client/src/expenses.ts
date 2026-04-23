import type {
  CreateExpenseInput,
  DeleteExpenseResponse,
  ExpenseResponse,
  UpdateExpenseInput
} from "@immoklu/types";
import { apiRequest } from "./http";

export function getExpenses() {
  return apiRequest<ExpenseResponse[]>("/expenses", {
    method: "GET"
  });
}

export function createExpense(input: CreateExpenseInput) {
  return apiRequest<ExpenseResponse>("/expenses", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateExpense(expenseId: string, input: UpdateExpenseInput) {
  return apiRequest<ExpenseResponse>(`/expenses/${expenseId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteExpense(expenseId: string) {
  return apiRequest<DeleteExpenseResponse>(`/expenses/${expenseId}`, {
    method: "DELETE"
  });
}
