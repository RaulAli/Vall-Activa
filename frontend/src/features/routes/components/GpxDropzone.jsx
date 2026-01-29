import { useCallback, useMemo, useState } from "react";

export default function GpxDropzone({ file, onFile }) {
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState(null);

    const acceptFile = useCallback((f) => {
        setError(null);
        if (!f) return;
        if (!f.name.toLowerCase().endsWith(".gpx")) {
            setError("Solo se permiten archivos .gpx");
            return;
        }
        onFile(f);
    }, [onFile]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        acceptFile(e.dataTransfer.files?.[0]);
    }, [acceptFile]);

    const onPick = useCallback((e) => {
        acceptFile(e.target.files?.[0]);
    }, [acceptFile]);

    const label = useMemo(() => {
        return file
            ? `Archivo: ${file.name}`
            : "Arrastra aquí tu archivo .gpx o selecciónalo";
    }, [file]);

    return (
        <div className="space-y-4">
            <div
                onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                onDrop={onDrop}
                className={`
                    rounded-xl
                    border-2
                    border-dashed
                    p-6
                    text-center
                    transition
                    cursor-pointer
                    bg-white
                    ${dragOver
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-300 hover:border-indigo-400"}
                `}
            >
                <p className="text-sm text-slate-600">{label}</p>

                <div className="mt-4 flex justify-center gap-3">
                    <label className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700">
                        Seleccionar archivo
                        <input
                            type="file"
                            accept=".gpx"
                            onChange={onPick}
                            className="hidden"
                        />
                    </label>

                    {file && (
                        <button
                            type="button"
                            onClick={() => onFile(null)}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100"
                        >
                            Quitar
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-sm font-semibold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
