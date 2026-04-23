import type { AppLocale } from "../enums/locale";

export interface UpdateWorkspaceInput {
  name?: string;
  countryCode?: string;
  defaultCurrency?: string;
  preferredLocale?: AppLocale;
  timezone?: string;
}
