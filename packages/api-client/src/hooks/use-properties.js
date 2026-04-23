"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveProperty, createProperty, getProperties, unarchiveProperty, updateProperty } from "../properties";
export const propertiesQueryKey = ["properties"];
export function usePropertiesQuery() {
    return useQuery({
        queryKey: propertiesQueryKey,
        queryFn: getProperties
    });
}
export function useCreatePropertyMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createProperty(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
        }
    });
}
export function useUpdatePropertyMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ propertyId, input }) => updateProperty(propertyId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
        }
    });
}
export function useArchivePropertyMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (propertyId) => archiveProperty(propertyId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
        }
    });
}
export function useUnarchivePropertyMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (propertyId) => unarchiveProperty(propertyId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
        }
    });
}
