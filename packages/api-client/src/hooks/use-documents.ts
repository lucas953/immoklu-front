"use client";

import type { CreateDocumentInput, InitiateDocumentUploadInput, UpdateDocumentInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  deleteDocument,
  getDocumentDownloadUrl,
  getDocuments,
  initiateDocumentUpload,
  updateDocument
} from "../documents";

export const documentsQueryKey = ["documents"] as const;

export function useDocumentsQuery() {
  return useQuery({
    queryKey: documentsQueryKey,
    queryFn: getDocuments
  });
}

export function useInitiateDocumentUploadMutation() {
  return useMutation({
    mutationFn: (input: InitiateDocumentUploadInput) => initiateDocumentUpload(input)
  });
}

export function useCreateDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => createDocument(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    }
  });
}

export function useUpdateDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, input }: { documentId: string; input: UpdateDocumentInput }) =>
      updateDocument(documentId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    }
  });
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    }
  });
}

export function useDocumentDownloadUrlMutation() {
  return useMutation({
    mutationFn: (documentId: string) => getDocumentDownloadUrl(documentId)
  });
}
