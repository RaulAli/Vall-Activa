import { useCallback, useMemo, useState } from "react";

export default function GpxDropzone({ file, onFile }) {
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState(null);

    const acceptFile = useCallback((f) => {
        setError(null);
        if (!f) return;
        const name = (f.name || "").toLowerCase();
        if (!name.endsWith(".gpx")) {
            setError("Solo se permiten archivos .gpx");
            return;
        }
        onFile(f);
    }, [onFile]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        acceptFile(f);
    }, [acceptFile]);

    const onPick = useCallback((e) => {
        const f = e.target.files?.[0];
        acceptFile(f);
    }, [acceptFile]);

    const label = useMemo(() => {
        if (file) return `Archivo: ${file.name}`;
        return "Arrastra aquí tu .gpx o selecciónalo con el botón";
    }, [file]);

    return (
        <div className="card">
            <h3>Archivo GPX</h3>

            <div
                onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={onDrop}
                className={`dropzone ${dragOver ? "dropzone--over" : ""}`}
            >
                <div>{label}</div>
                <div className="row" style={{ gap: 8, marginTop: 10 }}>
                    <label className="btnLike">
                        Seleccionar archivo
                        <input type="file" accept=".gpx" onChange={onPick} style={{ display: "none" }} />
                    </label>

                    {file ? (
                        <button type="button" className="secondary" onClick={() => onFile(null)}>
                            Quitar
                        </button>
                    ) : null}
                </div>
            </div>

            {error ? <div className="error">{error}</div> : null}
        </div>
    );
}
