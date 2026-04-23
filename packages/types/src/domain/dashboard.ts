export interface DashboardSummary {
  baseCurrency: string;
  rentalIncome: string;
  expenses: string;
  netCashFlow: string;
  occupancyRate: number;
  overduePaymentsCount: number;
  overdueAmount: string;
  portfolioValue: string;
  portfolioProfitability: number | null;
  propertiesCount: number;
  activeLeasesCount: number;
  tenantsCount: number;
}

export interface DashboardCashFlowPoint {
  month: string;
  label: string;
  income: string;
  expenses: string;
  netCashFlow: string;
}

export interface DashboardCashFlow {
  baseCurrency: string;
  points: DashboardCashFlowPoint[];
}

export interface DashboardPropertyProfitability {
  propertyId: string;
  propertyName: string;
  status: string;
  income: string;
  expenses: string;
  netCashFlow: string;
  portfolioValue: string;
  profitability: number | null;
}

export interface DashboardProfitability {
  baseCurrency: string;
  portfolioIncome: string;
  portfolioExpenses: string;
  portfolioNetCashFlow: string;
  portfolioProfitability: number | null;
  portfolioValue: string;
  unassignedExpenses: string;
  properties: DashboardPropertyProfitability[];
}

export interface DashboardOccupancyProperty {
  propertyId: string;
  propertyName: string;
  occupancyStatus: "OCCUPIED" | "VACANT";
  currentTenantName: string | null;
}

export interface DashboardOccupancy {
  occupiedProperties: number;
  vacantProperties: number;
  totalActiveProperties: number;
  occupancyRate: number;
  properties: DashboardOccupancyProperty[];
}

export interface DashboardOverduePayment {
  paymentId: string;
  propertyName: string;
  tenantName: string;
  dueDate: string;
  amountDue: string;
  amountPaid: string;
  outstandingAmount: string;
  currency: string;
  notes: string | null;
}

export interface DashboardOverduePayments {
  baseCurrency: string;
  count: number;
  totalOutstanding: string;
  payments: DashboardOverduePayment[];
}
