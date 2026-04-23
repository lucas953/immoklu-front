import type { ExpenseCategoryRecord } from "../domain/expense-category";

export interface CreateExpenseCategoryInput {
  name: string;
  slug?: string;
  color?: string;
}

export type UpdateExpenseCategoryInput = Partial<CreateExpenseCategoryInput>;

export type ExpenseCategoryResponse = ExpenseCategoryRecord;
