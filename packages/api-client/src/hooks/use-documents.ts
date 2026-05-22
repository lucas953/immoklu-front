"use client";

import type { CreateDocumentInput, InitiateDocumentUploadInput, UpdateDocumentInput } from "@immoklu/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  deleteDocument,
  extractDocumentText,
  getDocumentExtraction,
  getDocumentDownloadUrl,
  getDocuments,
  initiateDocumentUpload,
  parseDocument,
  uploadDocumentFile,
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

export function useDirectDocumentUploadMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadDocumentFile(file)
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

export function useDocumentExtractionQuery(documentId?: string | null) {
  return useQuery({
    queryKey: [...documentsQueryKey, documentId, "extraction"],
    queryFn: () => getDocumentExtraction(documentId ?? ""),
    enabled: Boolean(documentId)
  });
}

export function useExtractDocumentTextMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => extractDocumentText(documentId),
    onSuccess: (_data, documentId) => {
      void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...documentsQueryKey, documentId, "extraction"] });
    }
  });
}

export function useParseDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => parseDocument(documentId),
    onSuccess: (_data, documentId) => {
      void queryClient.invalidateQueries({ queryKey: documentsQueryKey });
      void queryClient.invalidateQueries({ queryKey: [...documentsQueryKey, documentId, "extraction"] });
    }
  });
}
