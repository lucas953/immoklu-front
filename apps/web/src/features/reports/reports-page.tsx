"use client";

import { useState } from "react";
import { PageHeader } from "@immoklu/ui";
import { useCreateReportMutation, useDownloadReportMutation, usePropertiesQuery, useReportsQuery } from "@immoklu/api-client";
import type { CreateReportInput, FinancialReportRecord, ReportFormat, ReportType } from "@immoklu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "@/components/form-message";

const reportSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "PNL", "PORTFOLIO_SUMMARY"]),
  format: z.enum(["CSV", "PDF"]),
  fromDate: z.string().min(1),
  toDate: z.string().min(1),
  propertyId: z.string().optional()
});

type ReportFormValues = z.infer<typeof reportSchema>;

const emptyValues: ReportFormValues = {
  type: "PNL",
  format: "CSV",
  fromDate: startOfYear(),
  toDate: today(),
  propertyId: ""
};

const reportTypeLabels: Record<ReportType, string> = {
  INCOME: "Income report",
  EXPENSE: "Expense report",
  PNL: "P&L report",
  PORTFOLIO_SUMMARY: "Portfolio summary"
};

const reportFormatLabels: Record<ReportFormat, string> = {
  CSV: "CSV",
  PDF: "PDF"
};

export function ReportsPageContent() {
  const reportsQuery = useReportsQuery();
  const propertiesQuery = usePropertiesQuery();
  const createMutation = useCreateReportMutation();
  const downloadMutation = useDownloadReportMutation();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: emptyValues
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreateReportInput = {
      type: values.type,
      format: values.format,
      fromDate: values.fromDate,
      toDate: values.toDate
    };

    if (values.propertyId) {
      payload.propertyId = values.propertyId;
    }

    const report = await createMutation.mutateAsync(payload);
    setSelectedReportId(report.id);
  });

  const activeMutationError = createMutation.error?.message ?? downloadMutation.error?.message;
  const activeProperties = propertiesQuery.data?.filter((property) => property.status === "ACTIVE") ?? [];

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Reports"
        title="Reporting and export"
        description="Generate income, expense, P&L, and portfolio summary reports, then export them as CSV or PDF."
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Generate report</h2>
            <p className="mt-1 text-sm text-neutral-600">Choose a date range and export format for a new report snapshot.</p>
          </div>

          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Report type" error={form.formState.errors.type?.message}>
                <select {...form.register("type")} className={inputClassName}>
                  <option value="INCOME">Income report</option>
                  <option value="EXPENSE">Expense report</option>
                  <option value="PNL">P&L report</option>
                  <option value="PORTFOLIO_SUMMARY">Portfolio summary</option>
                </select>
              </Field>
              <Field label="Format" error={form.formState.errors.format?.message}>
                <select {...form.register("format")} className={inputClassName}>
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="From" error={form.formState.errors.fromDate?.message}>
                <input {...form.register("fromDate")} type="date" className={inputClassName} />
              </Field>
              <Field label="To" error={form.formState.errors.toDate?.message}>
                <input {...form.register("toDate")} type="date" className={inputClassName} />
              </Field>
            </div>

            <Field label="Property filter">
              <select {...form.register("propertyId")} className={inputClassName}>
                <option value="">Whole portfolio</option>
                {activeProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </Field>

            {selectedReportId ? (
              <FormMessage tone="success">Report generated. It is now available in the report history below.</FormMessage>
            ) : null}

            {activeMutationError ? <FormMessage tone="error">{activeMutationError}</FormMessage> : null}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)]"
            >
              {createMutation.isPending ? "Generating..." : "Generate report"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Report history</h2>
              <p className="mt-1 text-sm text-neutral-600">Every generated report stays available for re-download.</p>
            </div>
            <span className="text-sm text-neutral-600">{reportsQuery.data?.length ?? 0} reports</span>
          </div>

          {reportsQuery.isPending ? <p className="text-sm text-neutral-600">Loading reports...</p> : null}

          <div className="space-y-4">
            {reportsQuery.data?.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isDownloading={downloadMutation.isPending && selectedReportId === report.id}
                onDownload={async () => {
                  setSelectedReportId(report.id);
                  const download = await downloadMutation.mutateAsync(report.id);
                  const url = window.URL.createObjectURL(download.blob);
                  const anchor = document.createElement("a");
                  anchor.href = url;
                  anchor.download = download.fileName;
                  document.body.appendChild(anchor);
                  anchor.click();
                  anchor.remove();
                  window.URL.revokeObjectURL(url);
                }}
              />
            ))}

            {reportsQuery.data?.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-neutral-600">
                No reports generated yet. Create your first export to validate the reporting layer.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportCard({
  report,
  onDownload,
  isDownloading
}: Readonly<{
  report: FinancialReportRecord;
  onDownload: () => Promise<void>;
  isDownloading: boolean;
}>) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{reportTypeLabels[report.type]}</h3>
          <p className="mt-1 text-sm text-neutral-700">
            {report.fromDate.slice(0, 10)} to {report.toDate.slice(0, 10)}
          </p>
        </div>
        <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
          {reportFormatLabels[report.format]} • {report.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
        <div>
          <dt className="font-medium">Currency</dt>
          <dd>{report.baseCurrency}</dd>
        </div>
        <div>
          <dt className="font-medium">Generated</dt>
          <dd>{report.generatedAt ? report.generatedAt.slice(0, 10) : "Pending"}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onDownload()}
          disabled={report.status !== "READY" || isDownloading}
          className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>
    </article>
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

function today() {
  return new Date().toISOString().slice(0, 10);
}

function startOfYear() {
  const date = new Date();
  return `${date.getUTCFullYear()}-01-01`;
}

const inputClassName = "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none";
