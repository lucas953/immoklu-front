import type { AppLocale } from "../enums/locale";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  preferredLocale: AppLocale;
  status: "ACTIVE" | "DISABLED";
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  defaultCurrency: string;
  preferredLocale: AppLocale;
  timezone: string;
}

export interface AuthSession {
  user: AuthUser;
  workspace: WorkspaceSummary;
}
