"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PageHeader } from "@immoklu/ui";
import {
  useAuthSessionQuery,
  useDashboardCashFlowQuery,
  useDashboardOccupancyQuery,
  useDashboardOverduePaymentsQuery,
  useDashboardProfitabilityQuery,
  useDashboardSummaryQuery
} from "@immoklu/api-client";
import { FormMessage } from "@/components/form-message";

export function DashboardPageContent() {
  const sessionQuery = useAuthSessionQuery();
  const summaryQuery = useDashboardSummaryQuery();
  const cashFlowQuery = useDashboardCashFlowQuery();
  const profitabilityQuery = useDashboardProfitabilityQuery();
  const occupancyQuery = useDashboardOccupancyQuery();
  const overduePaymentsQuery = useDashboardOverduePaymentsQuery();

  const session = sessionQuery.data;
  const summary = summaryQuery.data;
  const cashFlow = cashFlowQuery.data;
  const profitability = profitabilityQuery.data;
  const occupancy = occupancyQuery.data;
  const overduePayments = overduePaymentsQuery.data;

  const isLoading =
    summaryQuery.isPending ||
    cashFlowQuery.isPending ||
    profitabilityQuery.isPending ||
    occupancyQuery.isPending ||
    overduePaymentsQuery.isPending;

  const errorMessage =
    summaryQuery.error?.message ??
    cashFlowQuery.error?.message ??
    profitabilityQuery.error?.message ??
    occupancyQuery.error?.message ??
    overduePaymentsQuery.error?.message ??
    sessionQuery.error?.message;

  const chartCurrency = summary?.baseCurrency ?? session?.workspace.defaultCurrency ?? "EUR";
  const cashFlowChartData =
    cashFlow?.points.map((point) => ({
      ...point,
      incomeValue: Number(point.income),
      expensesValue: Number(point.expenses),
      netValue: Number(point.netCashFlow)
    })) ?? [];

  const profitabilityChartData =
    profitability?.properties.slice(0, 6).map((property) => ({
      ...property,
      netValue: Number(property.netCashFlow)
    })) ?? [];

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Portfolio performance"
        description="See how rental income, expenses, occupancy, and overdue collections are moving across the portfolio in one place."
      />

      {errorMessage ? <FormMessage tone="error">{errorMessage}</FormMessage> : null}

      {session ? (
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            label="Workspace"
            title={session.workspace.name}
            meta={`${session.workspace.countryCode} / ${session.workspace.defaultCurrency} / ${session.workspace.timezone}`}
          />
          <InfoCard label="Signed in as" title={session.user.fullName} meta={session.user.email} />
        </div>
      ) : null}

      {isLoading ? <p className="text-sm text-neutral-600">Loading dashboard metrics...</p> : null}

      {summary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Rental income"
            value={formatCurrency(summary.rentalIncome, summary.baseCurrency)}
            helper={`${summary.activeLeasesCount} active leases`}
          />
          <MetricCard
            label="Expenses"
            value={formatCurrency(summary.expenses, summary.baseCurrency)}
            helper={`${summary.tenantsCount} active tenants`}
          />
          <MetricCard
            label="Net cash flow"
            value={formatCurrency(summary.netCashFlow, summary.baseCurrency)}
            helper={formatPercent(summary.portfolioProfitability, "portfolio margin")}
          />
          <MetricCard
            label="Occupancy"
            value={`${summary.occupancyRate.toFixed(1)}%`}
            helper={`${summary.propertiesCount} active properties`}
          />
          <MetricCard
            label="Overdue payments"
            value={String(summary.overduePaymentsCount)}
            helper={formatCurrency(summary.overdueAmount, summary.baseCurrency)}
          />
          <MetricCard
            label="Portfolio value"
            value={formatCurrency(summary.portfolioValue, summary.baseCurrency)}
            helper="Based on current value or purchase price"
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Cash flow</h2>
            <p className="mt-1 text-sm text-neutral-600">Last six months of collected rent against recorded expenses.</p>
          </div>

          {cashFlowChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowChartData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A7C66" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2A7C66" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D98B5F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D98B5F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6D9C9" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => compactCurrency(value, chartCurrency)}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, chartCurrency)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="incomeValue"
                    stroke="#2A7C66"
                    fill="url(#incomeGradient)"
                    name="Income"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expensesValue"
                    stroke="#D98B5F"
                    fill="url(#expenseGradient)"
                    name="Expenses"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No cash flow data yet. Payments and expenses will populate this chart.</p>
          )}
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Occupancy</h2>
            <p className="mt-1 text-sm text-neutral-600">Current occupied versus vacant properties across the active portfolio.</p>
          </div>

          {occupancy ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard label="Occupied" value={String(occupancy.occupiedProperties)} helper="Properties with an active lease" />
                <MetricCard label="Vacant" value={String(occupancy.vacantProperties)} helper="Ready for a new lease" />
                <MetricCard label="Rate" value={`${occupancy.occupancyRate.toFixed(1)}%`} helper="Active portfolio occupancy" />
              </div>

              <div className="mt-6 space-y-3">
                {occupancy.properties.map((property) => (
                  <article key={property.propertyId} className="rounded-3xl border border-[var(--border)] bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">{property.propertyName}</h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {property.currentTenantName ?? "No active tenant"}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-700">
                        {property.occupancyStatus}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Profitability</h2>
            <p className="mt-1 text-sm text-neutral-600">Property-level net cash flow ranking inside the current portfolio.</p>
          </div>

          {profitability ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Portfolio net"
                  value={formatCurrency(profitability.portfolioNetCashFlow, profitability.baseCurrency)}
                  helper={formatPercent(profitability.portfolioProfitability, "portfolio profitability")}
                />
                <MetricCard
                  label="Unassigned expenses"
                  value={formatCurrency(profitability.unassignedExpenses, profitability.baseCurrency)}
                  helper="Portfolio-level costs not attached to a property"
                />
              </div>

              {profitabilityChartData.length > 0 ? (
                <div className="mt-6 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitabilityChartData} layout="vertical" margin={{ left: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6D9C9" />
                      <XAxis type="number" tickFormatter={(value) => compactCurrency(value, profitability.baseCurrency)} />
                      <YAxis type="category" dataKey="propertyName" width={110} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, profitability.baseCurrency)} />
                      <Bar dataKey="netValue" fill="#2A7C66" radius={[0, 12, 12, 0]} name="Net cash flow" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-6 text-sm text-neutral-600">Add payments and expenses to start comparing property performance.</p>
              )}
            </>
          ) : null}
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Overdue payments</h2>
              <p className="mt-1 text-sm text-neutral-600">Outstanding rent that needs follow-up.</p>
            </div>
            {overduePayments ? (
              <span className="text-sm text-neutral-600">
                {formatCurrency(overduePayments.totalOutstanding, overduePayments.baseCurrency)}
              </span>
            ) : null}
          </div>

          {overduePayments?.payments.length ? (
            <div className="space-y-4">
              {overduePayments.payments.map((payment) => (
                <article key={payment.paymentId} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{payment.propertyName}</h3>
                      <p className="mt-1 text-sm text-neutral-700">{payment.tenantName}</p>
                    </div>
                    <span className="rounded-full bg-[#F6E7DF] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#A4532B]">
                      Due {payment.dueDate.slice(0, 10)}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium">Outstanding</dt>
                      <dd>{formatCurrency(payment.outstandingAmount, payment.currency)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Paid so far</dt>
                      <dd>{formatCurrency(payment.amountPaid, payment.currency)}</dd>
                    </div>
                  </dl>

                  {payment.notes ? <p className="mt-4 text-sm text-neutral-600">{payment.notes}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No overdue payments right now. Collection health looks clean.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  helper
}: Readonly<{
  label: string;
  value: string;
  helper: string;
}>) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
      <p className="mt-2 text-sm text-neutral-700">{helper}</p>
    </div>
  );
}

function InfoCard({
  label,
  title,
  meta
}: Readonly<{
  label: string;
  title: string;
  meta: string;
}>) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">{label}</p>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-neutral-700">{meta}</p>
    </div>
  );
}

function formatCurrency(value: string | number, currency: string) {
  const amount = typeof value === "number" ? value : Number(value);

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amount);
}

function compactCurrency(value: string | number, currency: string) {
  const amount = typeof value === "number" ? value : Number(value);

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(amount);
}

function formatPercent(value: number | null, label: string) {
  if (value === null) {
    return `${label}: not enough income yet`;
  }

  return `${label}: ${value.toFixed(1)}%`;
}
