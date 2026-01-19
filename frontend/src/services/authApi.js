import { http } from "./http";

export async function login(payload) {
    return http(`/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function registerAthlete(payload) {
    return http(`/auth/athlete/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function registerBusiness(payload) {
    return http(`/auth/business/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function me(token) {
    return http(`/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
