import { useNavigate } from "react-router-dom";
import { useSession } from "../features/auth/hooks/useSession";
import { useBusinesses } from "../features/businesses/hooks/useBusinesses";
import { useOffers } from "../features/offers/hooks/useOffers";
import { useApp } from "../context/Provider";
import { useState } from "react";

export default function ManageOffersPage() {
    const { me, session } = useSession();
    const { mutations } = useApp();
    const navigate = useNavigate();
    const { data: businesses, loading: bLoading } = useBusinesses({ owner_id: me?.id });

    const myBusiness = businesses?.[0];
    const { data: offers, loading: oLoading, error } = useOffers({ business_id: myBusiness?.id });

    const [toggling, setToggling] = useState(null);

    async function toggleStatus(offer) {
        setToggling(offer.id);
        try {
            await mutations.offers.update(offer.id, { is_active: !offer.is_active }, session?.token);
            // Re-fetch or local update would be better, but useOffers handles it if it's reactive with queries
            // For now, simplicity: the hook will re-run if dependencies change, 
            // but we might need to trigger a refresh.
            window.location.reload();
        } catch (e) {
            alert("Error al cambiar el estado: " + (e.message || e));
        } finally {
            setToggling(null);
        }
    }

    if (bLoading || oLoading) return (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando tus promociones...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Ofertas</h1>
                    <p className="text-slate-500 mt-1">Activa, desactiva o modifica tus descuentos fácilmente.</p>
                </div>
                <button
                    onClick={() => navigate("/business/dashboard")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all"
                >
                    ← Volver al Panel
                </button>
            </header>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {!offers?.length ? (
                    <div className="p-20 text-center">
                        <div className="text-6xl mb-4">📢</div>
                        <h3 className="text-xl font-bold text-slate-900">No tienes ofertas creadas</h3>
                        <p className="text-slate-500 mt-2 mb-8">Empieza creando tu primera promoción para atraer clientes.</p>
                        <button
                            onClick={() => navigate(`/offers/new?business_id=${myBusiness?.id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all"
                        >
                            + Crear mi primera oferta
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-8 py-5 font-black">Información de Oferta</th>
                                    <th className="px-8 py-5 font-black">Descuento</th>
                                    <th className="px-8 py-5 font-black">Validez</th>
                                    <th className="px-8 py-5 font-black text-center">PRECIO (VAC)</th>
                                    <th className="px-8 py-5 font-black text-center">STOCK</th>
                                    <th className="px-8 py-5 font-black text-center">Estado</th>
                                    <th className="px-8 py-5 font-black text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {offers.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-slate-900">{o.title}</p>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">{o.description || "Sin descripción"}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-black">
                                                {o.discount_value}{o.discount_type === 'PERCENTAGE' ? '%' : '€'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                                            <div className="flex flex-col">
                                                <span>{new Date(o.start_date).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">hasta</span>
                                                <span>{new Date(o.end_date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center font-black text-indigo-600">
                                            💎 {o.vac_price}
                                        </td>
                                        <td className="px-8 py-6 text-center font-bold text-slate-600">
                                            📦 {o.stock_quantity}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                disabled={toggling === o.id}
                                                onClick={() => toggleStatus(o)}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${o.is_active
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {toggling === o.id ? "..." : (o.is_active ? "Activa" : "Inactiva")}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => navigate(`/offers/${o.id}/edit`)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.242 1.242a3.333 3.333 0 014.714 4.714L12 18H8v-4l8.242-8.242z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
