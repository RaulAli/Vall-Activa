import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/Provider";

export default function OfferDetailPage() {
    const { id } = useParams();
    const { queries } = useApp();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
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

    if (loading) return (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando oferta...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-600">
            <p className="font-bold">No se pudo cargar la oferta</p>
            <p className="text-sm opacity-80">{String(error.message || error)}</p>
            <Link to="/shop" className="mt-4 inline-block font-bold">← Volver a la tienda</Link>
        </div>
    );

    if (!offer) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="relative h-64 bg-slate-900 flex items-center justify-center p-8 text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                    <div className="relative">
                        <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest mb-4">
                            Oferta Especial
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            {offer.title}
                        </h1>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Detalles de la Promoción</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-2xl">🏷️</span>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase">Descuento</p>
                                            <p className="text-xl font-black text-indigo-600">{offer.discount_value} {offer.discount_type === 'PERCENTAGE' ? '%' : '€'}</p>
                                        </div>
                                    </div>
                                    {offer.end_date && (
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="text-2xl">⏳</span>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Válido hasta</p>
                                                <p className="text-lg font-bold text-slate-700">{new Date(offer.end_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Descripción</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {offer.description || "Sin descripción proporcionada."}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Precio</p>
                                        <p className="text-3xl font-black text-indigo-600 flex items-center gap-2">
                                            <span>💎</span> {offer.vac_price || 500} <span className="text-xs opacity-60">VAC</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Stock</p>
                                        <p className="text-xl font-bold text-indigo-900">📦 {offer.stock_quantity ?? 10} uds</p>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:translate-y-0"
                                    onClick={() => alert("¡Próximamente! Estamos habilitando el sistema de canje.")}
                                >
                                    Comprar con puntos VAC
                                </button>

                                <p className="text-[10px] text-indigo-400 text-center font-bold italic">
                                    * El canje es definitivo y no se devuelven los puntos.
                                </p>
                            </div>

                            <Link
                                to={`/businesses/${offer.business_id}`}
                                className="block w-full text-center py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 font-black rounded-2xl transition-all"
                            >
                                Ver Perfil del Negocio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Link to="/shop" className="text-slate-400 font-bold hover:text-indigo-600 transition-colors">
                    ← Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}
