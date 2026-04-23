import type {
  AuthSession,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  LoginInput,
  RegisterInput,
  ResetPasswordInput
} from "@immoklu/types";
import { apiRequest } from "./http";

export function getAuthSession() {
  return apiRequest<AuthSession>("/auth/me", {
    method: "GET"
  });
}

export function register(input: RegisterInput) {
  return apiRequest<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function login(input: LoginInput) {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function logout() {
  return apiRequest<{ success: boolean }>("/auth/logout", {
    method: "POST"
  });
}

export function refreshSession() {
  return apiRequest<AuthSession>("/auth/refresh", {
    method: "POST"
  });
}

export function forgotPassword(input: ForgotPasswordInput) {
  return apiRequest<ForgotPasswordResponse>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function resetPassword(input: ResetPasswordInput) {
  return apiRequest<AuthSession>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
