"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@immoklu/ui";
import { useCreateLeaseMutation, useLeasesQuery, usePropertiesQuery, useTenantsQuery, useTerminateLeaseMutation, useUpdateLeaseMutation } from "@immoklu/api-client";
import type { CreateLeaseInput, LeaseRecord, UpdateLeaseInput } from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const leaseSchema = z.object({
  propertyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  monthlyRent: z.string().min(1),
  depositAmount: z.string().optional(),
  currency: z.string().length(3),
  paymentFrequency: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"]),
  paymentDayOfMonth: z.number().int().min(1).max(31),
  status: z.enum(["DRAFT", "ACTIVE", "ENDED", "TERMINATED"]),
  notes: z.string().optional()
});

type LeaseFormValues = z.infer<typeof leaseSchema>;

const emptyValues: LeaseFormValues = {
  propertyId: "",
  tenantId: "",
  startDate: "",
  endDate: "",
  monthlyRent: "",
  depositAmount: "",
  currency: "EUR",
  paymentFrequency: "MONTHLY",
  paymentDayOfMonth: 1,
  status: "ACTIVE",
  notes: ""
};

export function LeasesPageContent() {
  const leasesQuery = useLeasesQuery();
  const propertiesQuery = usePropertiesQuery();
  const tenantsQuery = useTenantsQuery();
  const createMutation = useCreateLeaseMutation();
  const updateMutation = useUpdateLeaseMutation();
  const terminateMutation = useTerminateLeaseMutation();
  const [selectedLease, setSelectedLease] = useState<LeaseRecord | null>(null);
  const form = useForm<LeaseFormValues>({
    resolver: zodResolver(leaseSchema),
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!selectedLease) {
      form.reset(emptyValues);
      return;
    }

    form.reset({
      propertyId: selectedLease.propertyId,
      tenantId: selectedLease.tenantId,
      startDate: selectedLease.startDate.slice(0, 10),
      endDate: selectedLease.endDate ? selectedLease.endDate.slice(0, 10) : "",
      monthlyRent: selectedLease.monthlyRent,
      depositAmount: selectedLease.depositAmount ?? "",
      currency: selectedLease.currency,
      paymentFrequency: selectedLease.paymentFrequency,
      paymentDayOfMonth: selectedLease.paymentDayOfMonth,
      status: selectedLease.status,
      notes: selectedLease.notes ?? ""
    });
  }, [form, selectedLease]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreateLeaseInput = {
      propertyId: values.propertyId,
      tenantId: values.tenantId,
      startDate: values.startDate,
      monthlyRent: values.monthlyRent,
      currency: values.currency,
      paymentFrequency: values.paymentFrequency,
      paymentDayOfMonth: values.paymentDayOfMonth,
      status: values.status
    };

    if (values.endDate) payload.endDate = values.endDate;
    if (values.depositAmount) payload.depositAmount = values.depositAmount;
    if (values.notes) payload.notes = values.notes;

    if (selectedLease) {
      await updateMutation.mutateAsync({
        leaseId: selectedLease.id,
        input: payload as UpdateLeaseInput
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setSelectedLease(null);
    form.reset(emptyValues);
  });

  const activeMutationError =
    createMutation.error?.message ?? updateMutation.error?.message ?? terminateMutation.error?.message;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Leases"
        title="Lease history"
        description="Connect tenants to properties over time, with the contract terms your rent tracking and reporting will rely on."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Leases</h2>
            <span className="text-sm text-neutral-600">{leasesQuery.data?.length ?? 0} leases</span>
          </div>

          {leasesQuery.isPending ? <p className="text-sm text-neutral-600">Loading leases...</p> : null}

          <div className="space-y-4">
            {leasesQuery.data?.map((lease) => (
              <article key={lease.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{lease.property.name}</h3>
                    <p className="mt-1 text-sm text-neutral-700">{lease.tenant.fullName}</p>
                  </div>
                  <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                    {lease.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">Rent</dt>
                    <dd>
                      {lease.monthlyRent} {lease.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Frequency</dt>
                    <dd>{lease.paymentFrequency}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Start date</dt>
                    <dd>{lease.startDate.slice(0, 10)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Payment day</dt>
                    <dd>{lease.paymentDayOfMonth}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLease(lease)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  {lease.status !== "TERMINATED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        void terminateMutation.mutateAsync({
                          leaseId: lease.id,
                          input: {
                            terminatedAt: new Date().toISOString()
                          }
                        })
                      }
                      className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      Terminate
                    </button>
                  ) : null}
                </div>
              </article>
            ))}

            {leasesQuery.data?.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                No leases yet. Create the contract record that links a tenant to a property.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedLease ? "Edit lease" : "New lease"}</h2>
            {selectedLease ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedLease(null);
                  form.reset(emptyValues);
                }}
                className="text-sm font-medium text-[var(--accent)]"
              >
                Clear
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Property" error={form.formState.errors.propertyId?.message}>
                <select {...form.register("propertyId")} className={inputClassName}>
                  <option value="">Select property</option>
                  {propertiesQuery.data
                    ?.filter((property) => property.status === "ACTIVE")
                    .map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Tenant" error={form.formState.errors.tenantId?.message}>
                <select {...form.register("tenantId")} className={inputClassName}>
                  <option value="">Select tenant</option>
                  {tenantsQuery.data
                    ?.filter((tenant) => tenant.status === "ACTIVE")
                    .map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.fullName}
                      </option>
                    ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Start date" error={form.formState.errors.startDate?.message}>
                <input {...form.register("startDate")} type="date" className={inputClassName} />
              </Field>
              <Field label="End date">
                <input {...form.register("endDate")} type="date" className={inputClassName} />
              </Field>
              <Field label="Status">
                <select {...form.register("status")} className={inputClassName}>
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ENDED">Ended</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Monthly rent" error={form.formState.errors.monthlyRent?.message}>
                <input {...form.register("monthlyRent")} className={inputClassName} />
              </Field>
              <Field label="Deposit">
                <input {...form.register("depositAmount")} className={inputClassName} />
              </Field>
              <Field label="Currency" error={form.formState.errors.currency?.message}>
                <input {...form.register("currency")} className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Payment frequency">
                <select {...form.register("paymentFrequency")} className={inputClassName}>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="ANNUALLY">Annually</option>
                </select>
              </Field>
              <Field label="Payment day" error={form.formState.errors.paymentDayOfMonth?.message}>
                <input
                  {...form.register("paymentDayOfMonth", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  max={31}
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="Notes">
              <textarea {...form.register("notes")} rows={4} className={inputClassName} />
            </Field>

            {activeMutationError ? <FormMessage tone="error">{activeMutationError}</FormMessage> : null}

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : selectedLease
                  ? "Update lease"
                  : "Create lease"}
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
