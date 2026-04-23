"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@immoklu/ui";
import {
  useCreatePaymentMutation,
  useLeasesQuery,
  useMarkPaymentOverdueMutation,
  useMarkPaymentPaidMutation,
  useMarkPaymentPendingMutation,
  usePaymentsQuery,
  useUpdatePaymentMutation
} from "@immoklu/api-client";
import type {
  CreatePaymentInput,
  PaymentMethod,
  PaymentRecord,
  PaymentStatusInput,
  UpdatePaymentInput
} from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const paymentMethodOptions = ["BANK_TRANSFER", "CASH", "CARD", "DIRECT_DEBIT", "OTHER"] as const;

const paymentSchema = z.object({
  leaseId: z.string().uuid(),
  periodStart: z.string().min(1),
  periodEnd: z.string().min(1),
  dueDate: z.string().min(1),
  paidDate: z.string().optional(),
  amountDue: z.string().min(1),
  amountPaid: z.string().optional(),
  currency: z.string().length(3),
  paymentMethod: z.union([z.enum(paymentMethodOptions), z.literal("")]),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "PARTIALLY_PAID"]),
  notes: z.string().optional()
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const emptyValues: PaymentFormValues = {
  leaseId: "",
  periodStart: "",
  periodEnd: "",
  dueDate: "",
  paidDate: "",
  amountDue: "",
  amountPaid: "",
  currency: "EUR",
  paymentMethod: "",
  status: "PENDING",
  notes: ""
};

export function PaymentsPageContent() {
  const paymentsQuery = usePaymentsQuery();
  const leasesQuery = useLeasesQuery();
  const createMutation = useCreatePaymentMutation();
  const updateMutation = useUpdatePaymentMutation();
  const markPaidMutation = useMarkPaymentPaidMutation();
  const markPendingMutation = useMarkPaymentPendingMutation();
  const markOverdueMutation = useMarkPaymentOverdueMutation();
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!selectedPayment) {
      form.reset(emptyValues);
      return;
    }

    form.reset({
      leaseId: selectedPayment.leaseId,
      periodStart: selectedPayment.periodStart.slice(0, 10),
      periodEnd: selectedPayment.periodEnd.slice(0, 10),
      dueDate: selectedPayment.dueDate.slice(0, 10),
      paidDate: selectedPayment.paidDate ? selectedPayment.paidDate.slice(0, 10) : "",
      amountDue: selectedPayment.amountDue,
      amountPaid: selectedPayment.amountPaid,
      currency: selectedPayment.currency,
      paymentMethod: selectedPayment.paymentMethod ?? "",
      status: selectedPayment.status,
      notes: selectedPayment.notes ?? ""
    });
  }, [form, selectedPayment]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreatePaymentInput = {
      leaseId: values.leaseId,
      periodStart: values.periodStart,
      periodEnd: values.periodEnd,
      dueDate: values.dueDate,
      amountDue: values.amountDue,
      currency: values.currency,
      status: values.status
    };

    if (values.paidDate) payload.paidDate = values.paidDate;
    if (values.amountPaid) payload.amountPaid = values.amountPaid;
    if (values.paymentMethod) payload.paymentMethod = values.paymentMethod;
    if (values.notes) payload.notes = values.notes;

    if (selectedPayment) {
      await updateMutation.mutateAsync({
        paymentId: selectedPayment.id,
        input: payload as UpdatePaymentInput
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setSelectedPayment(null);
    form.reset(emptyValues);
  });

  const activeMutationError =
    createMutation.error?.message ??
    updateMutation.error?.message ??
    markPaidMutation.error?.message ??
    markPendingMutation.error?.message ??
    markOverdueMutation.error?.message;

  const overduePayments = paymentsQuery.data?.filter((payment) => payment.status === "OVERDUE").length ?? 0;
  const activeLeases =
    leasesQuery.data?.filter((lease) => lease.status === "ACTIVE" || lease.status === "ENDED") ?? [];

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Payments"
        title="Rent collection"
        description="Track each rent period manually, keep payment states accurate, and give the dashboard a clean source of cash flow truth."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Payment ledger</h2>
              <p className="mt-1 text-sm text-neutral-600">{overduePayments} overdue payments need attention</p>
            </div>
            <span className="text-sm text-neutral-600">{paymentsQuery.data?.length ?? 0} payments</span>
          </div>

          {paymentsQuery.isPending ? <p className="text-sm text-neutral-600">Loading payments...</p> : null}

          <div className="space-y-4">
            {paymentsQuery.data?.map((payment) => (
              <article key={payment.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{payment.property.name}</h3>
                    <p className="mt-1 text-sm text-neutral-700">{payment.tenant.fullName}</p>
                  </div>
                  <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                    {payment.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">Period</dt>
                    <dd>
                      {payment.periodStart.slice(0, 10)} to {payment.periodEnd.slice(0, 10)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Due date</dt>
                    <dd>{payment.dueDate.slice(0, 10)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Amount due</dt>
                    <dd>
                      {payment.amountDue} {payment.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Amount paid</dt>
                    <dd>
                      {payment.amountPaid} {payment.currency}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(payment)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const input: PaymentStatusInput = {
                        paidDate: new Date().toISOString(),
                        amountPaid: payment.amountDue
                      };
                      if (payment.paymentMethod) input.paymentMethod = payment.paymentMethod;
                      void markPaidMutation.mutateAsync({
                        paymentId: payment.id,
                        input
                      });
                    }}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Mark paid
                  </button>
                  <button
                    type="button"
                    onClick={() => void markPendingMutation.mutateAsync(payment.id)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Mark pending
                  </button>
                  <button
                    type="button"
                    onClick={() => void markOverdueMutation.mutateAsync(payment.id)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Mark overdue
                  </button>
                </div>
              </article>
            ))}

            {paymentsQuery.data?.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                No rent payments yet. Record the first payment period for an active lease to start building collection history.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedPayment ? "Edit payment" : "New payment"}</h2>
            {selectedPayment ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedPayment(null);
                  form.reset(emptyValues);
                }}
                className="text-sm font-medium text-[var(--accent)]"
              >
                Clear
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            <Field label="Lease" error={form.formState.errors.leaseId?.message}>
              <select {...form.register("leaseId")} className={inputClassName} disabled={activeLeases.length === 0}>
                <option value="">Select lease</option>
                {activeLeases.map((lease) => (
                  <option key={lease.id} value={lease.id}>
                    {lease.property.name} • {lease.tenant.fullName}
                  </option>
                ))}
              </select>
            </Field>

            {activeLeases.length === 0 ? (
              <FormMessage tone="error">Create an active lease before recording rent payments.</FormMessage>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Period start" error={form.formState.errors.periodStart?.message}>
                <input {...form.register("periodStart")} type="date" className={inputClassName} />
              </Field>
              <Field label="Period end" error={form.formState.errors.periodEnd?.message}>
                <input {...form.register("periodEnd")} type="date" className={inputClassName} />
              </Field>
              <Field label="Due date" error={form.formState.errors.dueDate?.message}>
                <input {...form.register("dueDate")} type="date" className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Amount due" error={form.formState.errors.amountDue?.message}>
                <input {...form.register("amountDue")} className={inputClassName} />
              </Field>
              <Field label="Amount paid">
                <input {...form.register("amountPaid")} className={inputClassName} />
              </Field>
              <Field label="Currency" error={form.formState.errors.currency?.message}>
                <input {...form.register("currency")} className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Status" error={form.formState.errors.status?.message}>
                <select {...form.register("status")} className={inputClassName}>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="PARTIALLY_PAID">Partially paid</option>
                </select>
              </Field>
              <Field label="Paid date">
                <input {...form.register("paidDate")} type="date" className={inputClassName} />
              </Field>
              <Field label="Payment method">
                <select {...form.register("paymentMethod")} className={inputClassName}>
                  <option value="">Not set</option>
                  <option value="BANK_TRANSFER">Bank transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="DIRECT_DEBIT">Direct debit</option>
                  <option value="OTHER">Other</option>
                </select>
              </Field>
            </div>

            <Field label="Notes">
              <textarea {...form.register("notes")} rows={4} className={inputClassName} />
            </Field>

            {activeMutationError ? <FormMessage tone="error">{activeMutationError}</FormMessage> : null}

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || activeLeases.length === 0}
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : selectedPayment
                  ? "Update payment"
                  : "Create payment"}
            </button>
          </form>
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
