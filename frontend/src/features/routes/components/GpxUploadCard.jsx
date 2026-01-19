import { useState } from "react";
import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export default function GpxUploadCard({ routeId, onUploaded }) {
    const { mutations } = useApp();
    const { token } = readSession() || {};

    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function onSubmit(e) {
        e.preventDefault();
        if (!file) return;

        setSaving(true);
        setError(null);
        try {
            const updated = await mutations.routes.uploadGpx(routeId, file, token);
            onUploaded?.(updated);
            setFile(null);
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="card" style={{ padding: 12 }}>
            <h3>Subir GPX</h3>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <input type="file" accept=".gpx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}
                <button disabled={!file || saving}>{saving ? "Subiendo..." : "Subir"}</button>
            </form>
        </div>
    );
}
