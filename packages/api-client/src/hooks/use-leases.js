"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLease, getLeases, terminateLease, updateLease } from "../leases";
export const leasesQueryKey = ["leases"];
export function useLeasesQuery() {
    return useQuery({
        queryKey: leasesQueryKey,
        queryFn: getLeases
    });
}
export function useCreateLeaseMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createLease(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: leasesQueryKey });
        }
    });
}
export function useUpdateLeaseMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ leaseId, input }) => updateLease(leaseId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: leasesQueryKey });
        }
    });
}
export function useTerminateLeaseMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ leaseId, input }) => terminateLease(leaseId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: leasesQueryKey });
        }
    });
}
