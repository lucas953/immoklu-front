import { apiRequest } from "./http";
export function getExpenseCategories() {
    return apiRequest("/expense-categories", {
        method: "GET"
    });
}
export function createExpenseCategory(input) {
    return apiRequest("/expense-categories", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updateExpenseCategory(categoryId, input) {
    return apiRequest(`/expense-categories/${categoryId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function archiveExpenseCategory(categoryId) {
    return apiRequest(`/expense-categories/${categoryId}/archive`, {
        method: "POST"
    });
}
