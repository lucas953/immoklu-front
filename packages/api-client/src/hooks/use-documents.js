"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDocument, deleteDocument, getDocumentDownloadUrl, getDocuments, initiateDocumentUpload, updateDocument } from "../documents";
export const documentsQueryKey = ["documents"];
export function useDocumentsQuery() {
    return useQuery({
        queryKey: documentsQueryKey,
        queryFn: getDocuments
    });
}
export function useInitiateDocumentUploadMutation() {
    return useMutation({
        mutationFn: (input) => initiateDocumentUpload(input)
    });
}
export function useCreateDocumentMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => createDocument(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
        }
    });
}
export function useUpdateDocumentMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ documentId, input }) => updateDocument(documentId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
        }
    });
}
export function useDeleteDocumentMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (documentId) => deleteDocument(documentId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
        }
    });
}
export function useDocumentDownloadUrlMutation() {
    return useMutation({
        mutationFn: (documentId) => getDocumentDownloadUrl(documentId)
    });
}
