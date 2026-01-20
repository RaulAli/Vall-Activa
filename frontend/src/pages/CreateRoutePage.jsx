import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "../features/auth/components/RequireAuth";
import { useApp } from "../context/Provider";
import { readSession } from "../features/auth/hooks/useSession";
import RouteForm from "../features/routes/components/RouteForm";

export default function CreateRoutePage() {
    const { mutations } = useApp();
    const { token } = readSession() || {};
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function handleCreate(values) {
        setSaving(true);
        setError(null);
        try {
            const created = await mutations.routes.create(values, token);
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

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                    <RouteForm
                        onSubmit={handleCreate}
                        submitting={saving}
                        submitText="Publicar Ruta"
                    />
                </div>
            </div>
        </RequireAuth>
    );
}
