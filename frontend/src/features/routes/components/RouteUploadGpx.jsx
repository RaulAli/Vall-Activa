import { useState } from "react";

export default function RouteUploadGpx({ onUpload }) {
    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    async function submit() {
        if (!file) return;
        setError(null);
        setBusy(true);
        try {
            await onUpload(file);
            setFile(null);
        } catch (e) {
            setError(e?.message || "Error subiendo GPX");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="card">
            <h3>Subir GPX</h3>
            <div className="row" style={{ gap: 8 }}>
                <input type="file" accept=".gpx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <button onClick={submit} disabled={!file || busy}>
                    {busy ? "Subiendo..." : "Subir"}
                </button>
            </div>
            {error ? <div className="error">{error}</div> : null}
        </div>
    );
}
