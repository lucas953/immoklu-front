"use client";

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput
} from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getAuthSession,
  login,
  logout,
  refreshSession,
  register,
  resetPassword
} from "../auth";

export const authSessionQueryKey = ["auth-session"] as const;

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: authSessionQueryKey,
    queryFn: getAuthSession,
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
    }
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
    }
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authSessionQueryKey });
    }
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => forgotPassword(input)
  });
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(input),
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
    }
  });
}

export function useRefreshSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
    }
  });
}
