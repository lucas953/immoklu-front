"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@immoklu/ui";
import { useArchivePropertyMutation, useCreatePropertyMutation, usePropertiesQuery, useUnarchivePropertyMutation, useUpdatePropertyMutation } from "@immoklu/api-client";
import type { CreatePropertyInput, PropertyRecord, UpdatePropertyInput } from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const propertySchema = z.object({
  name: z.string().min(2),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().min(2),
  stateRegion: z.string().optional(),
  countryCode: z.string().length(2),
  type: z.enum(["RESIDENTIAL_LONG_TERM", "SHORT_TERM_RENTAL", "MULTI_UNIT", "COMMERCIAL"]),
  purchasePrice: z.string().min(1),
  acquisitionDate: z.string().min(1),
  currentValue: z.string().optional(),
  currency: z.string().length(3),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  notes: z.string().optional()
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const propertyTypeLabels: Record<PropertyFormValues["type"], string> = {
  RESIDENTIAL_LONG_TERM: "Residential",
  SHORT_TERM_RENTAL: "Short-term rental",
  MULTI_UNIT: "Multi-unit",
  COMMERCIAL: "Commercial"
};

const emptyValues: PropertyFormValues = {
  name: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  stateRegion: "",
  countryCode: "ES",
  type: "RESIDENTIAL_LONG_TERM",
  purchasePrice: "",
  acquisitionDate: "",
  currentValue: "",
  currency: "EUR",
  status: "ACTIVE",
  notes: ""
};

export function PropertiesPageContent() {
  const propertiesQuery = usePropertiesQuery();
  const createMutation = useCreatePropertyMutation();
  const updateMutation = useUpdatePropertyMutation();
  const archiveMutation = useArchivePropertyMutation();
  const unarchiveMutation = useUnarchivePropertyMutation();
  const [selectedProperty, setSelectedProperty] = useState<PropertyRecord | null>(null);
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!selectedProperty) {
      form.reset(emptyValues);
      return;
    }

    form.reset({
      name: selectedProperty.name,
      addressLine1: selectedProperty.addressLine1,
      addressLine2: selectedProperty.addressLine2 ?? "",
      postalCode: selectedProperty.postalCode ?? "",
      city: selectedProperty.city,
      stateRegion: selectedProperty.stateRegion ?? "",
      countryCode: selectedProperty.countryCode,
      type: selectedProperty.type,
      purchasePrice: selectedProperty.purchasePrice ?? "",
      acquisitionDate: selectedProperty.acquisitionDate ? selectedProperty.acquisitionDate.slice(0, 10) : "",
      currentValue: selectedProperty.currentValue ?? "",
      currency: selectedProperty.currency,
      status: selectedProperty.status,
      notes: selectedProperty.notes ?? ""
    });
  }, [form, selectedProperty]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreatePropertyInput = {
      name: values.name,
      addressLine1: values.addressLine1,
      city: values.city,
      countryCode: values.countryCode,
      type: values.type,
      purchasePrice: values.purchasePrice,
      acquisitionDate: values.acquisitionDate,
      currency: values.currency,
      status: values.status
    };

    if (values.addressLine2) payload.addressLine2 = values.addressLine2;
    if (values.postalCode) payload.postalCode = values.postalCode;
    if (values.stateRegion) payload.stateRegion = values.stateRegion;
    if (values.currentValue) payload.currentValue = values.currentValue;
    if (values.notes) payload.notes = values.notes;

    if (selectedProperty) {
      await updateMutation.mutateAsync({
        propertyId: selectedProperty.id,
        input: payload as UpdatePropertyInput
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setSelectedProperty(null);
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
        eyebrow="Properties"
        title="Property management"
        description="Capture the core property records that every lease, payment, expense, and report will depend on."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Portfolio</h2>
              <span className="text-sm text-neutral-600">{propertiesQuery.data?.length ?? 0} properties</span>
            </div>

            {propertiesQuery.isPending ? <p className="text-sm text-neutral-600">Loading properties...</p> : null}

            <div className="space-y-4">
              {propertiesQuery.data?.map((property) => (
                <article key={property.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{property.name}</h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        {property.addressLine1}, {property.city}, {property.countryCode}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                      {property.status}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium">Type</dt>
                      <dd>{propertyTypeLabels[property.type]}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Currency</dt>
                      <dd>{property.currency}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Purchase price</dt>
                      <dd>{property.purchasePrice ?? "Not set"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Acquired</dt>
                      <dd>{property.acquisitionDate ? property.acquisitionDate.slice(0, 10) : "Not set"}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProperty(property)}
                      className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      Edit
                    </button>
                    {property.status === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={() => void archiveMutation.mutateAsync(property.id)}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void unarchiveMutation.mutateAsync(property.id)}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {propertiesQuery.data?.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                  No properties yet. Create your first property to anchor the rest of the operating system.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedProperty ? "Edit property" : "New property"}</h2>
            {selectedProperty ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedProperty(null);
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
              <Field label="Name" error={form.formState.errors.name?.message}>
                <input {...form.register("name")} className={inputClassName} />
              </Field>
              <Field label="Type" error={form.formState.errors.type?.message}>
                <select {...form.register("type")} className={inputClassName}>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Address" error={form.formState.errors.addressLine1?.message}>
              <input {...form.register("addressLine1")} className={inputClassName} />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="City" error={form.formState.errors.city?.message}>
                <input {...form.register("city")} className={inputClassName} />
              </Field>
              <Field label="Country code" error={form.formState.errors.countryCode?.message}>
                <input {...form.register("countryCode")} className={inputClassName} />
              </Field>
              <Field label="Currency" error={form.formState.errors.currency?.message}>
                <input {...form.register("currency")} className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Purchase price" error={form.formState.errors.purchasePrice?.message}>
                <input {...form.register("purchasePrice")} className={inputClassName} />
              </Field>
              <Field label="Acquisition date" error={form.formState.errors.acquisitionDate?.message}>
                <input {...form.register("acquisitionDate")} type="date" className={inputClassName} />
              </Field>
              <Field label="Current value">
                <input {...form.register("currentValue")} className={inputClassName} />
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
                : selectedProperty
                  ? "Update property"
                  : "Create property"}
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
