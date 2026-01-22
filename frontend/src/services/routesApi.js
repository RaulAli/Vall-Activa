import { http, API_URL } from "./http";

function qs(params = {}) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        sp.set(k, String(v));
    });
    const s = sp.toString();
    return s ? `?${s}` : "";
}

export async function listRoutes(filters = {}, token) {
    return http(`/routes${qs(filters)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function getRoute(id, token) {
    return http(`/routes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function createRoute(payload, token) {
    return http(`/routes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
}

export async function updateRoute(id, payload, token) {
    return http(`/routes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
}

export async function deleteRoute(id, token) {
    return http(`/routes/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function getRouteTrack(id, token) {
    return http(`/routes/${id}/track`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

export async function uploadRouteGpx(id, file, token) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_URL}/routes/${id}/gpx`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
    });

    if (!res.ok) {
        let detail = "";
        try {
            const data = await res.json();
            if (data?.detail) detail = `: ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`;
        } catch { }
        throw new Error(`HTTP ${res.status} ${res.statusText}${detail}`);
    }

    return await res.json();
}
export async function parseRouteGpx(file, token) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_URL}/routes/gpx/parse`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
    });

    if (!res.ok) {
        let detail = "";
        try {
            const data = await res.json();
            if (data?.detail) detail = `: ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`;
        } catch { }
        throw new Error(`HTTP ${res.status} ${res.statusText}${detail}`);
    }

    return await res.json();
}
