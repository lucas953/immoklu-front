"use client";

import type { CreatePropertyInput, UpdatePropertyInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveProperty,
  createProperty,
  getProperties,
  unarchiveProperty,
  updateProperty
} from "../properties";

export const propertiesQueryKey = ["properties"] as const;

export function usePropertiesQuery() {
  return useQuery({
    queryKey: propertiesQueryKey,
    queryFn: getProperties
  });
}

export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePropertyInput) => createProperty(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    }
  });
}

export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, input }: { propertyId: string; input: UpdatePropertyInput }) =>
      updateProperty(propertyId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    }
  });
}

export function useArchivePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => archiveProperty(propertyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    }
  });
}

export function useUnarchivePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => unarchiveProperty(propertyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    }
  });
}
