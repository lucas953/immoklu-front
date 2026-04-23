"use client";

import type { CreateTenantInput, UpdateTenantInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveTenant, createTenant, getTenants, unarchiveTenant, updateTenant } from "../tenants";

export const tenantsQueryKey = ["tenants"] as const;

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantsQueryKey,
    queryFn: getTenants
  });
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => createTenant(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    }
  });
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, input }: { tenantId: string; input: UpdateTenantInput }) =>
      updateTenant(tenantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    }
  });
}

export function useArchiveTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => archiveTenant(tenantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    }
  });
}

export function useUnarchiveTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => unarchiveTenant(tenantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    }
  });
}
