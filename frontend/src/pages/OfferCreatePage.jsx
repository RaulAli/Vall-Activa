import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/Provider";
import OfferForm from "../features/offers/components/OfferForm";

export default function OfferCreatePage() {
    const { mutations } = useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const businessIdParam = searchParams.get("business_id") || "";

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function handleCreate(values) {
        setSaving(true);
        setError(null);
        try {
            const created = await mutations.offers.create(values);
            const newId = created?.id || created?.data?.id;
            if (newId) {
                navigate(`/offers/${newId}`);
            } else {
                navigate("/offers");
            }
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nueva Oferta</h1>
                    <p className="text-slate-500 text-sm mt-1">Comparte una nueva promoción con la comunidad.</p>
                </div>
                <Link to="/business/dashboard" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all">
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
                <OfferForm
                    initialValues={{ business_id: businessIdParam }}
                    onSubmit={handleCreate}
                    submitting={saving}
                    submitText="Publicar Oferta"
                    businessIdLocked={!!businessIdParam}
                />
            </div>
        </div>
    );
}
