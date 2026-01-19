const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3050";

function stringifyDetail(detail) {
    if (detail == null) return "";
    if (typeof detail === "string") return detail;
    try {
        return JSON.stringify(detail);
    } catch {
        return String(detail);
    }
}

export async function http(path, init) {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...(init?.headers || {}),
        },
    });

    if (!res.ok) {
        let detail = "";
        try {
            const data = await res.json();
            if (data?.detail !== undefined) detail = `: ${stringifyDetail(data.detail)}`;
        } catch { }
        throw new Error(`HTTP ${res.status} ${res.statusText}${detail}`);
    }

    if (res.status === 204) return null;
    return await res.json();
}

export { API_URL };
