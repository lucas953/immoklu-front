import { apiRequest } from "./http";
export function getAuthSession() {
    return apiRequest("/auth/me", {
        method: "GET"
    });
}
export function register(input) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function login(input) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function logout() {
    return apiRequest("/auth/logout", {
        method: "POST"
    });
}
export function refreshSession() {
    return apiRequest("/auth/refresh", {
        method: "POST"
    });
}
export function forgotPassword(input) {
    return apiRequest("/auth/password/forgot", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
export function resetPassword(input) {
    return apiRequest("/auth/password/reset", {
        method: "POST",
        body: JSON.stringify(input)
    });
}
