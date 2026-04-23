import type { UpdateWorkspaceInput, WorkspaceSummary } from "@immoklu/types";
import { apiRequest } from "./http";

export function getWorkspace() {
  return apiRequest<WorkspaceSummary>("/workspace", {
    method: "GET"
  });
}

export function updateWorkspace(input: UpdateWorkspaceInput) {
  return apiRequest<WorkspaceSummary>("/workspace", {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}
