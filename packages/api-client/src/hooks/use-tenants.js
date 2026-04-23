"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveTenant, createTenant, getTenants, unarchiveTenant, updateTenant } from "../tenants";
export const tenantsQueryKey = ["tenants"];
export function useTenantsQuery() {
    return useQuery({
        queryKey: tenantsQueryKey,
        queryFn: getTenants
    });
}
export function useCreateTenantMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createTenant(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
        }
    });
}
export function useUpdateTenantMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tenantId, input }) => updateTenant(tenantId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
        }
    });
}
export function useArchiveTenantMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tenantId) => archiveTenant(tenantId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
        }
    });
}
export function useUnarchiveTenantMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tenantId) => unarchiveTenant(tenantId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
        }
    });
}
