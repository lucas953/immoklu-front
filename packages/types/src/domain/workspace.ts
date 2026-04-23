import type { AppLocale } from "../enums/locale";

export interface WorkspaceSettings {
  id: string;
  name: string;
  countryCode: string;
  defaultCurrency: string;
  preferredLocale: AppLocale;
  timezone: string;
}
