"use client";

import type { CreateLeaseInput, TerminateLeaseInput, UpdateLeaseInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLease, getLeases, terminateLease, updateLease } from "../leases";

export const leasesQueryKey = ["leases"] as const;

export function useLeasesQuery() {
  return useQuery({
    queryKey: leasesQueryKey,
    queryFn: getLeases
  });
}

export function useCreateLeaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeaseInput) => createLease(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leasesQueryKey });
    }
  });
}

export function useUpdateLeaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leaseId, input }: { leaseId: string; input: UpdateLeaseInput }) => updateLease(leaseId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leasesQueryKey });
    }
  });
}

export function useTerminateLeaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leaseId, input }: { leaseId: string; input?: TerminateLeaseInput }) =>
      terminateLease(leaseId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leasesQueryKey });
    }
  });
}
