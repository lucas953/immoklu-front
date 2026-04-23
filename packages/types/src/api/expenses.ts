import type { ExpenseRecord } from "../domain/expense";

export interface CreateExpenseInput {
  propertyId?: string;
  categoryId?: string;
  amount: string;
  currency: string;
  expenseDate: string;
  vendorPayee?: string;
  notes?: string;
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export type ExpenseResponse = ExpenseRecord;

export interface DeleteExpenseResponse {
  success: boolean;
}
