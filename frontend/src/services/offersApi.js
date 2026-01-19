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

export async function listOffers(filters = {}, token) {
    return http(`/offers${qs(filters)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function getOffer(id, token) {
    return http(`/offers/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function createOffer(payload, token) {
    // IMPORTANTE: discount_value en tu backend está validado como string
    // (te dio error cuando enviaste number)
    const normalized = { ...payload, discount_value: String(payload.discount_value ?? "") };

    return http(`/offers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(normalized),
    });
}

export async function updateOffer(id, payload, token) {
    const normalized = { ...payload };
    if (normalized.discount_value !== undefined) normalized.discount_value = String(normalized.discount_value);

    return http(`/offers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(normalized),
    });
}

export async function deleteOffer(id, token) {
    return http(`/offers/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}
