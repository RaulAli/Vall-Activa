const LS_KEY = "crudslab_session";

export function readSession() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function writeSession(session) {
    localStorage.setItem(LS_KEY, JSON.stringify(session));
}

export function clearSession() {
    localStorage.removeItem(LS_KEY);
}
