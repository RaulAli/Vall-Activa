import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/Provider";
import OffersTable from "../features/offers/components/OffersTable";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function BusinessDetailPage() {
    const { id } = useParams();
    const { queries } = useApp();

    const [business, setBusiness] = useState(null);
    const [offers, setOffers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [offersLoading, setOffersLoading] = useState(false);

    const [error, setError] = useState(null);
    const [offersError, setOffersError] = useState(null);

    const isValidId = Boolean(id && UUID_RE.test(id));

    async function loadBusiness(cancelledRef) {
        setLoading(true);
        setError(null);
        try {
            const b = await queries.businesses.get(id);
            if (!cancelledRef.cancelled) setBusiness(b);
        } catch (e) {
            if (!cancelledRef.cancelled) setError(e);
        } finally {
            if (!cancelledRef.cancelled) setLoading(false);
        }
    }

    async function loadOffers(cancelledRef) {
        setOffersLoading(true);
        setOffersError(null);
        try {
            const items = await queries.offers.list({ business_id: id });
            if (!cancelledRef.cancelled) setOffers(items || []);
        } catch (e) {
            if (!cancelledRef.cancelled) setOffersError(e);
        } finally {
            if (!cancelledRef.cancelled) setOffersLoading(false);
        }
    }

    useEffect(() => {
        const cancelledRef = { cancelled: false };

        if (!isValidId) {
            setBusiness(null);
            setOffers([]);
            setLoading(false);
            setOffersLoading(false);
            setError(null);
            setOffersError(null);
            return () => {
                cancelledRef.cancelled = true;
            };
        }

        loadBusiness(cancelledRef);
        loadOffers(cancelledRef);

        return () => {
            cancelledRef.cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isValidId]);

    if (!isValidId) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Negocio no encontrado</h2>
                <p className="text-red-500 mb-6 font-medium">ID de negocio inválido: {String(id)}</p>
                <Link to="/shop" className="text-indigo-600 font-bold hover:underline">← Volver a la tienda</Link>
            </div>
        );
    }

    if (loading) return (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando detalles del negocio...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-600">
            <p className="font-bold">Error al cargar el negocio</p>
            <p className="text-sm opacity-80">{String(error.message || error)}</p>
            <Link to="/shop" className="mt-4 inline-block font-bold">← Volver</Link>
        </div>
    );

    if (!business) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 md:p-16 text-white text-center">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl -ml-32 -mb-32"></div>

                <div className="relative">
                    <div className="inline-block px-4 py-1.5 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">
                        {business.category || "Negocio Local"}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                        {business.name}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-4 text-slate-300 font-medium">
                        <span className="flex items-center gap-2">
                            📍 {business.city || business.region || "Ubicación disponible"}
                        </span>
                        {business.phone && (
                            <span className="flex items-center gap-2">
                                📞 {business.phone}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details Card */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            Sobre el negocio
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                            {business.description || "Este negocio aún no ha añadido una descripción detallada."}
                        </div>

                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                            <div>
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Dirección</h4>
                                <p className="text-slate-900 font-bold">{business.address || "Consultar directamente"}</p>
                            </div>
                            {business.website && (
                                <div>
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Página Web</h4>
                                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">
                                        {business.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Offers Section */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-900 italic">Promociones Activas</h3>
                            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-lg">
                                {offers.length} OFERTAS
                            </div>
                        </div>

                        {offersLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-2xl" />)}
                            </div>
                        ) : offersError ? (
                            <p className="text-red-500 font-medium">{String(offersError.message || offersError)}</p>
                        ) : offers.length > 0 ? (
                            <div className="bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100">
                                <OffersTable items={offers} />
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 italic">
                                No hay ofertas disponibles en este momento.
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar / Info */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
                        <h3 className="text-xl font-black mb-4">¿Te gusta este negocio?</h3>
                        <p className="opacity-90 mb-6 text-sm leading-relaxed font-medium">
                            Apoya a los comercios locales de Vall d'Uixó y aprovecha sus mejores ofertas por ser parte de la comunidad Vall Activa.
                        </p>
                        <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            ¡Guardar en favoritos!
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <Link to="/shop" className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2">
                    ← Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}
