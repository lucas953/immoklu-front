"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@immoklu/ui";
import {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useDirectDocumentUploadMutation,
  useDocumentDownloadUrlMutation,
  useDocumentExtractionQuery,
  useDocumentsQuery,
  useExpensesQuery,
  useExtractDocumentTextMutation,
  useLeasesQuery,
  useParseDocumentMutation,
  usePropertiesQuery,
  useTenantsQuery,
  useUpdateDocumentMutation
} from "@immoklu/api-client";
import type {
  CreateDocumentInput,
  DocumentCategory,
  DocumentRecord,
  ParsedInvoiceData,
  UpdateDocumentInput
} from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const documentCategories: Array<{ value: DocumentCategory; label: string }> = [
  { value: "LEASE_CONTRACT", label: "Lease contract" },
  { value: "INVOICE", label: "Invoice" },
  { value: "UTILITY_BILL", label: "Utility bill" },
  { value: "MORTGAGE_CONTRACT", label: "Mortgage contract" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "BUILDING_MEETING", label: "Building meeting" },
  { value: "TAX", label: "Tax" },
  { value: "MISCELLANEOUS", label: "Miscellaneous" }
];

const documentSchema = z.object({
  category: z.enum([
    "LEASE_CONTRACT",
    "INVOICE",
    "UTILITY_BILL",
    "MORTGAGE_CONTRACT",
    "INSURANCE",
    "BUILDING_MEETING",
    "TAX",
    "MISCELLANEOUS"
  ]),
  title: z.string().optional(),
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),
  leaseId: z.string().optional(),
  expenseId: z.string().optional(),
  tagsInput: z.string().optional(),
  metadataText: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || !value.trim()) {
        return true;
      }

      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
      } catch {
        return false;
      }
    }, "Metadata must be valid JSON object text")
});

type DocumentFormValues = z.infer<typeof documentSchema>;

const emptyValues: DocumentFormValues = {
  category: "LEASE_CONTRACT",
  title: "",
  propertyId: "",
  tenantId: "",
  leaseId: "",
  expenseId: "",
  tagsInput: "",
  metadataText: ""
};

export function DocumentsPageContent() {
  const documentsQuery = useDocumentsQuery();
  const propertiesQuery = usePropertiesQuery();
  const tenantsQuery = useTenantsQuery();
  const leasesQuery = useLeasesQuery();
  const expensesQuery = useExpensesQuery();
  const directUploadMutation = useDirectDocumentUploadMutation();
  const createMutation = useCreateDocumentMutation();
  const updateMutation = useUpdateDocumentMutation();
  const deleteMutation = useDeleteDocumentMutation();
  const downloadMutation = useDocumentDownloadUrlMutation();
  const extractTextMutation = useExtractDocumentTextMutation();
  const parseDocumentMutation = useParseDocumentMutation();
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord | null>(null);
  const selectedExtractionQuery = useDocumentExtractionQuery(selectedDocument?.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!selectedDocument) {
      form.reset(emptyValues);
      setSelectedFile(null);
      setFileError(null);
      return;
    }

    form.reset({
      category: selectedDocument.category,
      title: selectedDocument.title ?? "",
      propertyId: selectedDocument.propertyId ?? "",
      tenantId: selectedDocument.tenantId ?? "",
      leaseId: selectedDocument.leaseId ?? "",
      expenseId: selectedDocument.expenseId ?? "",
      tagsInput: selectedDocument.tags.map((tag) => tag.name).join(", "),
      metadataText: selectedDocument.metadata ? JSON.stringify(selectedDocument.metadata, null, 2) : ""
    });
    setSelectedFile(null);
    setFileError(null);
  }, [form, selectedDocument]);

  const onSubmit = form.handleSubmit(async (values) => {
    setFileError(null);

    const tagNames = parseTagNames(values.tagsInput);
    const metadata = parseMetadata(values.metadataText);

    if (selectedDocument) {
      const payload: UpdateDocumentInput = {
        category: values.category,
        tagNames
      };

      if (values.title) payload.title = values.title;
      if (values.propertyId) payload.propertyId = values.propertyId;
      if (values.tenantId) payload.tenantId = values.tenantId;
      if (values.leaseId) payload.leaseId = values.leaseId;
      if (values.expenseId) payload.expenseId = values.expenseId;
      if (metadata) payload.metadata = metadata;

      await updateMutation.mutateAsync({
        documentId: selectedDocument.id,
        input: payload
      });
    } else {
      if (!selectedFile) {
        setFileError("Choose a file before creating a document.");
        return;
      }

      const upload = await directUploadMutation.mutateAsync(selectedFile);

      const payload: CreateDocumentInput = {
        category: values.category,
        originalFileName: upload.originalFileName,
        mimeType: upload.mimeType,
        sizeBytes: upload.sizeBytes,
        objectKey: upload.objectKey,
        tagNames
      };

      if (values.title) payload.title = values.title;
      if (values.propertyId) payload.propertyId = values.propertyId;
      if (values.tenantId) payload.tenantId = values.tenantId;
      if (values.leaseId) payload.leaseId = values.leaseId;
      if (values.expenseId) payload.expenseId = values.expenseId;
      if (metadata) payload.metadata = metadata;

      await createMutation.mutateAsync(payload);
    }

    setSelectedDocument(null);
    setSelectedFile(null);
    form.reset(emptyValues);
  });

  const activeMutationError =
    directUploadMutation.error?.message ??
    createMutation.error?.message ??
    updateMutation.error?.message ??
    deleteMutation.error?.message ??
    downloadMutation.error?.message ??
    extractTextMutation.error?.message ??
    parseDocumentMutation.error?.message;

  const activeProperties =
    propertiesQuery.data?.filter((property) => property.status === "ACTIVE") ?? [];
  const activeTenants =
    tenantsQuery.data?.filter((tenant) => tenant.status === "ACTIVE") ?? [];
  const activeLeases =
    leasesQuery.data?.filter((lease) => lease.status === "ACTIVE" || lease.status === "ENDED") ?? [];

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Documents"
        title="Document hub"
        description="Upload contracts, invoices, bills, and supporting files, then link them back to the exact property, tenant, lease, or expense they belong to."
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Library</h2>
            <span className="text-sm text-neutral-600">{documentsQuery.data?.length ?? 0} documents</span>
          </div>

          {documentsQuery.isPending ? <p className="text-sm text-neutral-600">Loading documents...</p> : null}

          <div className="space-y-4">
            {documentsQuery.data?.map((document) => (
              <article key={document.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{document.title ?? document.originalFileName}</h3>
                    <p className="mt-1 text-sm text-neutral-700">
                      {categoryLabel(document.category)} • {formatFileSize(document.sizeBytes)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                    {document.uploadedAt.slice(0, 10)}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">Linked entities</dt>
                    <dd>{linkedEntitySummary(document)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Tags</dt>
                    <dd>{document.tags.length > 0 ? document.tags.map((tag) => tag.name).join(", ") : "No tags"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Extraction</dt>
                    <dd>{extractionStatusLabel(document.extractionStatus)}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDocument(document)}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const result = await downloadMutation.mutateAsync(document.id);
                      window.open(result.url, "_blank", "noopener,noreferrer");
                    }}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Download
                  </button>
                  {document.mimeType === "application/pdf" ? (
                    <button
                      type="button"
                      onClick={() => void extractTextMutation.mutateAsync(document.id)}
                      disabled={extractTextMutation.isPending}
                      className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      {extractTextMutation.isPending ? "Extracting..." : "Extract text"}
                    </button>
                  ) : null}
                  {document.extractionStatus === "EXTRACTED" || document.extractionStatus === "NEEDS_OCR" ? (
                    <button
                      type="button"
                      onClick={() => void parseDocumentMutation.mutateAsync(document.id)}
                      disabled={parseDocumentMutation.isPending}
                      className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      {parseDocumentMutation.isPending ? "Parsing..." : "Parse"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteMutation.mutateAsync(document.id);
                      if (selectedDocument?.id === document.id) {
                        setSelectedDocument(null);
                        setSelectedFile(null);
                        form.reset(emptyValues);
                      }
                    }}
                    className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {documentsQuery.data?.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                No documents yet. Upload the first lease, invoice, or tax file to start building the operating record.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedDocument ? "Edit document" : "Upload document"}</h2>
            {selectedDocument ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedDocument(null);
                  setSelectedFile(null);
                  form.reset(emptyValues);
                  setFileError(null);
                }}
                className="text-sm font-medium text-[var(--accent)]"
              >
                Clear
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            {!selectedDocument ? (
              <Field label="File" error={fileError ?? undefined}>
                <input
                  type="file"
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0] ?? null;
                    setSelectedFile(nextFile);
                    setFileError(null);
                  }}
                  className={inputClassName}
                />
              </Field>
            ) : (
              <FormMessage tone="success">
                Editing metadata for <strong>{selectedDocument.originalFileName}</strong>. To replace the file, create a new document.
              </FormMessage>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category" error={form.formState.errors.category?.message}>
                <select {...form.register("category")} className={inputClassName}>
                  {documentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Title">
                <input {...form.register("title")} className={inputClassName} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Property">
                <select {...form.register("propertyId")} className={inputClassName}>
                  <option value="">Not linked</option>
                  {activeProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tenant">
                <select {...form.register("tenantId")} className={inputClassName}>
                  <option value="">Not linked</option>
                  {activeTenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.fullName}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Lease">
                <select {...form.register("leaseId")} className={inputClassName}>
                  <option value="">Not linked</option>
                  {activeLeases.map((lease) => (
                    <option key={lease.id} value={lease.id}>
                      {lease.property.name} • {lease.tenant.fullName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Expense">
                <select {...form.register("expenseId")} className={inputClassName}>
                  <option value="">Not linked</option>
                  {expensesQuery.data?.map((expense) => (
                    <option key={expense.id} value={expense.id}>
                      {expense.amount} {expense.currency} • {expense.category?.name ?? "Uncategorized"}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Tags">
              <input {...form.register("tagsInput")} placeholder="lease, signed, 2026" className={inputClassName} />
            </Field>

            <Field label="Metadata JSON" error={form.formState.errors.metadataText?.message}>
              <textarea
                {...form.register("metadataText")}
                rows={5}
                placeholder='{"source":"web","notes":"Signed copy"}'
                className={inputClassName}
              />
            </Field>

            {activeMutationError ? <FormMessage tone="error">{activeMutationError}</FormMessage> : null}

            {selectedDocument ? (
              <div className="rounded-3xl border border-[var(--border)] bg-white p-4 text-sm text-neutral-700">
                <h3 className="text-base font-semibold text-neutral-900">Extraction</h3>
                <p className="mt-2">
                  Status: {extractionStatusLabel(selectedDocument.extractionStatus)} /{" "}
                  {parsingStatusLabel(selectedDocument.parsingStatus)}
                </p>
                {selectedExtractionQuery.isPending ? <p className="mt-2">Loading extraction details...</p> : null}
                {selectedExtractionQuery.data ? (
                  <div className="mt-3 space-y-2">
                    <p>
                      Method: {selectedExtractionQuery.data.extractionMethod} - Text length:{" "}
                      {selectedExtractionQuery.data.normalizedText?.length ?? 0}
                    </p>
                    {selectedExtractionQuery.data.parsedJson ? (
                      <ParsedInvoiceSummary parsed={selectedExtractionQuery.data.parsedJson} />
                    ) : selectedDocument.extractionStatus === "EXTRACTED" ||
                      selectedDocument.extractionStatus === "NEEDS_OCR" ? (
                      <button
                        type="button"
                        onClick={() => void parseDocumentMutation.mutateAsync(selectedDocument.id)}
                        disabled={parseDocumentMutation.isPending}
                        className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
                      >
                        {parseDocumentMutation.isPending ? "Parsing..." : "Parse extracted text"}
                      </button>
                    ) : null}
                    {Array.isArray(selectedExtractionQuery.data.warnings) &&
                    selectedExtractionQuery.data.warnings.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedExtractionQuery.data.warnings.map((warning: unknown, index: number) => (
                          <li key={`${warning}-${index}`}>{String(warning)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : selectedDocument.extractionStatus === "NOT_STARTED" ? (
                  <p className="mt-2">No extraction has been run for this document yet.</p>
                ) : null}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={
                directUploadMutation.isPending ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
            >
              {directUploadMutation.isPending || createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : selectedDocument
                  ? "Update document"
                  : "Upload document"}
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

function ParsedInvoiceSummary({ parsed }: Readonly<{ parsed: ParsedInvoiceData }>) {
  const rows = [
    ["Supplier", parsed.supplier_name],
    ["Invoice number", parsed.invoice_number],
    ["Invoice date", parsed.invoice_date],
    ["Due date", parsed.due_date],
    ["Period", parsed.period_start && parsed.period_end ? `${parsed.period_start} to ${parsed.period_end}` : null],
    ["Total", parsed.total_amount && parsed.currency ? `${parsed.total_amount} ${parsed.currency}` : parsed.total_amount],
    ["Utility", parsed.utility_type],
    ["Address", parsed.service_address],
    ["Confidence", `${Math.round(parsed.confidence * 100)}%`]
  ];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
      <h4 className="font-semibold text-neutral-900">Parsed fields</h4>
      <dl className="mt-3 grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[130px_1fr]">
            <dt className="font-medium text-neutral-700">{label}</dt>
            <dd className="text-neutral-900">{value || "Not detected"}</dd>
          </div>
        ))}
      </dl>
      {parsed.missing_fields.length > 0 ? (
        <p className="mt-3 text-sm text-amber-700">Missing: {parsed.missing_fields.join(", ")}</p>
      ) : null}
    </div>
  );
}

function parseTagNames(value?: string) {
  return value
    ? Array.from(
        new Set(
          value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      )
    : [];
}

function parseMetadata(value?: string) {
  if (!value || !value.trim()) {
    return undefined;
  }

  return JSON.parse(value) as Record<string, unknown>;
}

function linkedEntitySummary(document: DocumentRecord) {
  const parts = [
    document.property?.name,
    document.tenant?.fullName,
    document.lease ? `Lease ${document.lease.startDate.slice(0, 10)}` : null,
    document.expense ? `Expense ${document.expense.amount} ${document.expense.currency}` : null
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" • ") : "Not linked";
}

function categoryLabel(category: DocumentCategory) {
  return documentCategories.find((option) => option.value === category)?.label ?? category;
}

function extractionStatusLabel(status: DocumentRecord["extractionStatus"]) {
  const labels: Record<DocumentRecord["extractionStatus"], string> = {
    NOT_STARTED: "Not started",
    EXTRACTED: "Extracted",
    NEEDS_OCR: "Needs OCR",
    FAILED: "Failed"
  };

  return labels[status];
}

function parsingStatusLabel(status: DocumentRecord["parsingStatus"]) {
  const labels: Record<DocumentRecord["parsingStatus"], string> = {
    NOT_STARTED: "Not started",
    PARSED: "Parsed",
    NEEDS_REVIEW: "Needs review",
    CONFIRMED: "Confirmed",
    FAILED: "Failed"
  };

  return labels[status];
}

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

const inputClassName = "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none";
