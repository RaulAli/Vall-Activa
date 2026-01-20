import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/Provider";
import OfferForm from "../features/offers/components/OfferForm";

export default function OfferEditPage() {
    const { id } = useParams();
    const { queries, mutations } = useApp();
    const navigate = useNavigate();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const o = await queries.offers.get(id);
                if (!cancelled) setOffer(o);
            } catch (e) {
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [id, queries]);

    async function handleUpdate(values) {
        setSaving(true);
        setError(null);
        try {
            await mutations.offers.update(id, values);
            navigate(`/offers/${id}`);
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando oferta...</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editar Oferta</h1>
                    <p className="text-slate-500 text-sm mt-1">Actualiza los detalles de tu promoción.</p>
                </div>
                <Link to={`/offers/${id}`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all">
                    ← Cancelar
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm font-medium">{String(error.message || error)}</p>
                </div>
            )}

            {offer && (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                    <OfferForm
                        initialValues={offer}
                        onSubmit={handleUpdate}
                        submitting={saving}
                        submitText="Guardar Cambios"
                        businessIdLocked={true}
                    />
                </div>
            )}
        </div>
    );
}
