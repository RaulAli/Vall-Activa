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
            // Optional: visual feedback
            alert("GPX subido con éxito");
            window.location.reload();
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Subir Track GPX</h3>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="relative group">
                    <input
                        type="file"
                        accept=".gpx"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all text-center">
                        <span className="text-sm font-bold text-slate-500">
                            {file ? file.name : "Seleccionar archivo .gpx"}
                        </span>
                    </div>
                </div>

                {error && <p className="text-xs font-bold text-red-500">{String(error.message || error)}</p>}

                <button
                    disabled={!file || saving}
                    className={`w-full py-3 rounded-xl font-black text-sm transition-all ${!file || saving
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
                        }`}
                >
                    {saving ? "Procesando..." : "Sincronizar Ruta"}
                </button>
            </form>
        </div>
    );
}
