import { apiRequest } from "./http";
export function getWorkspace() {
    return apiRequest("/workspace", {
        method: "GET"
    });
}
export function updateWorkspace(input) {
    return apiRequest("/workspace", {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
