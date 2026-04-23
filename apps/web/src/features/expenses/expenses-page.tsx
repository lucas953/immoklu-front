"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@immoklu/ui";
import {
  useArchiveExpenseCategoryMutation,
  useCreateExpenseCategoryMutation,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useExpenseCategoriesQuery,
  useExpensesQuery,
  usePropertiesQuery,
  useUpdateExpenseMutation
} from "@immoklu/api-client";
import type {
  CreateExpenseCategoryInput,
  CreateExpenseInput,
  ExpenseRecord,
  UpdateExpenseInput
} from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const expenseSchema = z.object({
  propertyId: z.union([z.string().uuid(), z.literal("")]),
  categoryId: z.union([z.string().uuid(), z.literal("")]),
  amount: z.string().min(1),
  currency: z.string().length(3),
  expenseDate: z.string().min(1),
  vendorPayee: z.string().optional(),
  notes: z.string().optional()
});

const categorySchema = z.object({
  name: z.string().min(2),
  color: z.string().optional()
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;

const emptyExpenseValues: ExpenseFormValues = {
  propertyId: "",
  categoryId: "",
  amount: "",
  currency: "EUR",
  expenseDate: "",
  vendorPayee: "",
  notes: ""
};

const emptyCategoryValues: CategoryFormValues = {
  name: "",
  color: ""
};

export function ExpensesPageContent() {
  const expensesQuery = useExpensesQuery();
  const propertiesQuery = usePropertiesQuery();
  const categoriesQuery = useExpenseCategoriesQuery();
  const createMutation = useCreateExpenseMutation();
  const updateMutation = useUpdateExpenseMutation();
  const deleteMutation = useDeleteExpenseMutation();
  const createCategoryMutation = useCreateExpenseCategoryMutation();
  const archiveCategoryMutation = useArchiveExpenseCategoryMutation();
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);
  const expenseForm = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: emptyExpenseValues
  });
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyCategoryValues
  });

  useEffect(() => {
    if (!selectedExpense) {
      expenseForm.reset(emptyExpenseValues);
      return;
    }

    expenseForm.reset({
      propertyId: selectedExpense.propertyId ?? "",
      categoryId: selectedExpense.categoryId ?? "",
      amount: selectedExpense.amount,
      currency: selectedExpense.currency,
      expenseDate: selectedExpense.expenseDate.slice(0, 10),
      vendorPayee: selectedExpense.vendorPayee ?? "",
      notes: selectedExpense.notes ?? ""
    });
  }, [expenseForm, selectedExpense]);

  const onExpenseSubmit = expenseForm.handleSubmit(async (values) => {
    const payload: CreateExpenseInput = {
      amount: values.amount,
      currency: values.currency,
      expenseDate: values.expenseDate
    };

    if (values.propertyId) payload.propertyId = values.propertyId;
    if (values.categoryId) payload.categoryId = values.categoryId;
    if (values.vendorPayee) payload.vendorPayee = values.vendorPayee;
    if (values.notes) payload.notes = values.notes;

    if (selectedExpense) {
      await updateMutation.mutateAsync({
        expenseId: selectedExpense.id,
        input: payload as UpdateExpenseInput
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setSelectedExpense(null);
    expenseForm.reset(emptyExpenseValues);
  });

  const onCategorySubmit = categoryForm.handleSubmit(async (values) => {
    const payload: CreateExpenseCategoryInput = {
      name: values.name
    };

    if (values.color) payload.color = values.color;

    await createCategoryMutation.mutateAsync(payload);
    categoryForm.reset(emptyCategoryValues);
  });

  const activeExpenseMutationError =
    createMutation.error?.message ?? updateMutation.error?.message ?? deleteMutation.error?.message;
  const activeCategoryMutationError =
    createCategoryMutation.error?.message ?? archiveCategoryMutation.error?.message;

  const activeProperties =
    propertiesQuery.data?.filter((property) => property.status === "ACTIVE") ?? [];
  const visibleCategories =
    categoriesQuery.data?.filter((category) => !category.archivedAt) ?? [];

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Expenses"
        title="Expense tracking"
        description="Keep every outgoing cost attached to the right property, category, and date range so portfolio performance stays trustworthy."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Expense register</h2>
            <span className="text-sm text-neutral-600">{expensesQuery.data?.length ?? 0} expenses</span>
          </div>

          {expensesQuery.isPending ? <p className="text-sm text-neutral-600">Loading expenses...</p> : null}

          <div className="space-y-4">
            {expensesQuery.data?.map((expense) => (
              <article key={expense.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {expense.amount} {expense.currency}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-700">
                      {expense.category?.name ?? "Uncategorized"} • {expense.property?.name ?? "Portfolio level"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                    {expense.expenseDate.slice(0, 10)}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">Vendor / payee</dt>
                    <dd>{expense.vendorPayee ?? "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Category</dt>
                    <dd>{expense.category?.name ?? "None"}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedExpense(expense)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteMutation.mutateAsync(expense.id);
                      if (selectedExpense?.id === expense.id) {
                        setSelectedExpense(null);
                        expenseForm.reset(emptyExpenseValues);
                      }
                    }}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {expensesQuery.data?.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                No expenses yet. Add a first expense to start separating cash outflows by property and category.
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{selectedExpense ? "Edit expense" : "New expense"}</h2>
              {selectedExpense ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExpense(null);
                    expenseForm.reset(emptyExpenseValues);
                  }}
                  className="text-sm font-medium text-[var(--accent)]"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <form className="space-y-4" onSubmit={(event) => void onExpenseSubmit(event)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Property">
                  <select {...expenseForm.register("propertyId")} className={inputClassName}>
                    <option value="">Portfolio level</option>
                    {activeProperties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Category">
                  <select {...expenseForm.register("categoryId")} className={inputClassName}>
                    <option value="">Uncategorized</option>
                    {visibleCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Amount" error={expenseForm.formState.errors.amount?.message}>
                  <input {...expenseForm.register("amount")} className={inputClassName} />
                </Field>
                <Field label="Currency" error={expenseForm.formState.errors.currency?.message}>
                  <input {...expenseForm.register("currency")} className={inputClassName} />
                </Field>
                <Field label="Expense date" error={expenseForm.formState.errors.expenseDate?.message}>
                  <input {...expenseForm.register("expenseDate")} type="date" className={inputClassName} />
                </Field>
              </div>

              <Field label="Vendor / payee">
                <input {...expenseForm.register("vendorPayee")} className={inputClassName} />
              </Field>

              <Field label="Notes">
                <textarea {...expenseForm.register("notes")} rows={4} className={inputClassName} />
              </Field>

              {activeExpenseMutationError ? <FormMessage tone="error">{activeExpenseMutationError}</FormMessage> : null}

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : selectedExpense
                    ? "Update expense"
                    : "Create expense"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Expense categories</h2>
              <span className="text-sm text-neutral-600">{visibleCategories.length} active</span>
            </div>

            <form className="space-y-4" onSubmit={(event) => void onCategorySubmit(event)}>
              <div className="grid gap-4 md:grid-cols-[1fr_140px]">
                <Field label="Name" error={categoryForm.formState.errors.name?.message}>
                  <input {...categoryForm.register("name")} className={inputClassName} />
                </Field>
                <Field label="Color">
                  <input {...categoryForm.register("color")} placeholder="#D98B5F" className={inputClassName} />
                </Field>
              </div>

              {activeCategoryMutationError ? <FormMessage tone="error">{activeCategoryMutationError}</FormMessage> : null}

              <button
                type="submit"
                disabled={createCategoryMutation.isPending}
                className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
              >
                {createCategoryMutation.isPending ? "Saving..." : "Create category"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {visibleCategories.map((category) => (
                <article key={category.id} className="rounded-3xl border border-[var(--border)] bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">{category.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-600">
                        {category.isSystem ? "System category" : "Custom category"}
                      </p>
                    </div>
                    {category.color ? (
                      <span
                        className="h-5 w-5 rounded-full border border-[var(--border)]"
                        style={{ backgroundColor: category.color }}
                      />
                    ) : null}
                  </div>

                  {!category.isSystem ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => void archiveCategoryMutation.mutateAsync(category.id)}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                      >
                        Archive
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children
}: Readonly<{
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}>) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

const inputClassName = "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none";
