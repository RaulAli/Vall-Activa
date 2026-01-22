import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "../features/auth/components/RequireAuth";
import { useApp } from "../context/Provider";
import { readSession } from "../features/auth/hooks/useSession";
import RouteForm from "../features/routes/components/RouteForm";
import GpxDropzone from "../features/routes/components/GpxDropzone";
import * as routesApi from "../services/routesApi";

export default function CreateRoutePage() {
    const { mutations } = useApp();
    const { token } = readSession() || {};
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [gpxFile, setGpxFile] = useState(null);
    const [autoValues, setAutoValues] = useState(null);
    const [parsing, setParsing] = useState(false);

    async function handleFile(file) {
        setGpxFile(file);
        if (!file) {
            setAutoValues(null);
            return;
        }

        setParsing(true);
        setError(null);
        try {
            const result = await routesApi.parseRouteGpx(file, token);
            setAutoValues({
                distance_km: result.distance_km,
                elevation_gain_m: result.elevation_gain_m,
                total_time_min: result.total_time_min,
                start_lat: result.start_lat,
                start_lng: result.start_lng,
                end_lat: result.end_lat,
                end_lng: result.end_lng,
                is_circular: result.is_circular,
                date: result.date,
            });
        } catch (err) {
            setError("Error al procesar el GPX: " + (err.message || err));
            setGpxFile(null);
        } finally {
            setParsing(false);
        }
    }

    async function handleCreate(values) {
        setSaving(true);
        setError(null);
        try {
            const created = await mutations.routes.create(values, token);

            if (gpxFile) {
                await routesApi.uploadRouteGpx(created.id, gpxFile, token);
            }

            navigate(`/routes/${created.id}`);
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <RequireAuth>
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nueva Ruta</h1>
                        <p className="text-slate-500 text-sm mt-1">Registra tu actividad y comparte tu track con la comunidad.</p>
                    </div>
                    <Link to="/athlete/dashboard" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all">
                        ← Cancelar
                    </Link>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <p className="text-sm font-medium">{String(error.message || error)}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                            Archivo del Track
                        </h2>
                        <GpxDropzone file={gpxFile} onFile={handleFile} />
                        {parsing && <p className="text-xs text-indigo-600 font-bold mt-2 animate-pulse">Analizando GPX...</p>}
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                            Detalles de la Ruta
                        </h2>
                        <RouteForm
                            initialValues={autoValues}
                            onSubmit={handleCreate}
                            submitting={saving}
                            submitText="Publicar Ruta"
                        />
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
}
