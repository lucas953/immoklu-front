"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@immoklu/ui";
import { useArchiveTenantMutation, useCreateTenantMutation, useTenantsQuery, useUnarchiveTenantMutation, useUpdateTenantMutation } from "@immoklu/api-client";
import type { CreateTenantInput, TenantRecord, UpdateTenantInput } from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const tenantSchema = z.object({
  fullName: z.string().min(2),
  email: z.union([z.string().email(), z.literal("")]),
  phone: z.string().optional(),
  tenantType: z.enum(["INDIVIDUAL", "COMPANY"]),
  notes: z.string().optional()
});

type TenantFormValues = z.infer<typeof tenantSchema>;

const emptyValues: TenantFormValues = {
  fullName: "",
  email: "",
  phone: "",
  tenantType: "INDIVIDUAL",
  notes: ""
};

export function TenantsPageContent() {
  const tenantsQuery = useTenantsQuery();
  const createMutation = useCreateTenantMutation();
  const updateMutation = useUpdateTenantMutation();
  const archiveMutation = useArchiveTenantMutation();
  const unarchiveMutation = useUnarchiveTenantMutation();
  const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!selectedTenant) {
      form.reset(emptyValues);
      return;
    }

    form.reset({
      fullName: selectedTenant.fullName,
      email: selectedTenant.email ?? "",
      phone: selectedTenant.phone ?? "",
      tenantType: selectedTenant.tenantType,
      notes: selectedTenant.notes ?? ""
    });
  }, [form, selectedTenant]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreateTenantInput = {
      fullName: values.fullName,
      tenantType: values.tenantType
    };

    if (values.email) payload.email = values.email;
    if (values.phone) payload.phone = values.phone;
    if (values.notes) payload.notes = values.notes;

    if (selectedTenant) {
      await updateMutation.mutateAsync({
        tenantId: selectedTenant.id,
        input: payload as UpdateTenantInput
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setSelectedTenant(null);
    form.reset(emptyValues);
  });

  const activeMutationError =
    createMutation.error?.message ??
    updateMutation.error?.message ??
    archiveMutation.error?.message ??
    unarchiveMutation.error?.message;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Tenants"
        title="Tenant records"
        description="Track who is renting across your portfolio, with enough structure to support lease history and payment tracking."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Directory</h2>
            <span className="text-sm text-neutral-600">{tenantsQuery.data?.length ?? 0} tenants</span>
          </div>

          {tenantsQuery.isPending ? <p className="text-sm text-neutral-600">Loading tenants...</p> : null}

          <div className="space-y-4">
            {tenantsQuery.data?.map((tenant) => (
              <article key={tenant.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{tenant.fullName}</h3>
                    <p className="mt-1 text-sm text-neutral-700">{tenant.email ?? "No email set"}</p>
                  </div>
                  <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                    {tenant.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">Type</dt>
                    <dd>{tenant.tenantType}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Phone</dt>
                    <dd>{tenant.phone ?? "Not set"}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTenant(tenant)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  {tenant.status === "ACTIVE" ? (
                    <button
                      type="button"
                      onClick={() => void archiveMutation.mutateAsync(tenant.id)}
                      className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void unarchiveMutation.mutateAsync(tenant.id)}
                      className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </article>
            ))}

            {tenantsQuery.data?.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                No tenants yet. Add a tenant before you create your first lease.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedTenant ? "Edit tenant" : "New tenant"}</h2>
            {selectedTenant ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedTenant(null);
                  form.reset(emptyValues);
                }}
                className="text-sm font-medium text-[var(--accent)]"
              >
                Clear
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <input {...form.register("fullName")} className={inputClassName} />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email" error={form.formState.errors.email?.message}>
                <input {...form.register("email")} type="email" className={inputClassName} />
              </Field>
              <Field label="Phone">
                <input {...form.register("phone")} className={inputClassName} />
              </Field>
            </div>

            <Field label="Tenant type">
              <select {...form.register("tenantType")} className={inputClassName}>
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
              </select>
            </Field>

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
                : selectedTenant
                  ? "Update tenant"
                  : "Create tenant"}
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
