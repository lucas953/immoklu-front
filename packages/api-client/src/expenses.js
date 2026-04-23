import { apiRequest } from "./http";
export function getExpenses() {
    return apiRequest("/expenses", {
        method: "GET"
    });
}
export function createExpense(input) {
    return apiRequest("/expenses", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function updateExpense(expenseId, input) {
    return apiRequest(`/expenses/${expenseId}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    });
}
export function deleteExpense(expenseId) {
    return apiRequest(`/expenses/${expenseId}`, {
        method: "DELETE"
    });
}
