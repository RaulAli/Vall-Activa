import { http } from "./http";

function qs(params = {}) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        sp.set(k, String(v));
    });
    const s = sp.toString();
    return s ? `?${s}` : "";
}

export async function listBusinesses(filters = {}, token) {
    return http(`/businesses${qs(filters)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function getBusiness(id, token) {
    return http(`/businesses/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function createBusiness(payload, token) {
    return http(`/businesses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
}

export async function updateBusiness(id, payload, token) {
    return http(`/businesses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
}

export async function deleteBusiness(id, token) {
    return http(`/businesses/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}
