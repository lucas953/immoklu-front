import type { AppLocale } from "../enums/locale";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  workspaceName: string;
  countryCode: string;
  defaultCurrency: string;
  preferredLocale: AppLocale;
  timezone: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  resetToken?: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
