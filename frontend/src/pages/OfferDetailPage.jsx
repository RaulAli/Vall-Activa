import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/Provider";
import { useSession } from "../features/auth/hooks/useSession";
import { useAthleteProfile } from "../features/athlete/queries/useAthleteProfile";

export default function OfferDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { queries, mutations } = useApp();
    const { session, me, refreshDashboard } = useSession();
    const { data: profile } = useAthleteProfile();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(false);

    // Dynamic state derived from current data
    const currentRole = me?.role || session?.role;
    const isAthleteUser = currentRole === "ATHLETE" || currentRole === "ATHLETE_VIP";

    async function handlePurchase() {
        console.log("VAC Purchase: Clic detectado", { me, session, profile, offer, currentRole });

        if (!session?.token) {
            return navigate("/athlete/login");
        }

        // Explicit validations with alerts for immediate feedback
        if (!isAthleteUser) {
            return alert(`Solo los atletas pueden realizar compras. Tu rol detectado: ${currentRole || 'Ninguno'}`);
        }

        const price = offer.vac_price || 500;
        const currentPoints = profile?.total_vac_points || 0;
        if (currentPoints < price) {
            return alert(`Puntos insuficientes. Necesitas ${price} VAC y tienes ${currentPoints} VAC.`);
        }

        if (offer.stock_quantity <= 0) {
            return alert("¡Lo sentimos! Esta oferta se ha quedado sin stock.");
        }

        const ok = window.confirm(`¿Quieres canjear esta oferta por ${price} puntos VAC?`);
        if (!ok) return;

        setPurchasing(true);
        try {
            await mutations.offers.purchase(id, session.token);
            alert("¡Compra realizada con éxito! Revisa tus cupones.");
            refreshDashboard();
            navigate("/athlete/coupons");
        } catch (e) {
            console.error("VAC Purchase Error:", e);
            alert("Error al procesar la compra: " + (e.message || e));
        } finally {
            setPurchasing(false);
        }
    }

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
        return () => { cancelled = true; };
    }, [id, queries]);

    // Debug logging in render
    useEffect(() => {
        if (offer) {
            console.log("DEBUG Render State:", {
                userRole: currentRole,
                profilePoints: profile?.total_vac_points,
                offerPrice: offer.vac_price || 500,
                offerStock: offer.stock_quantity
            });
        }
    }, [currentRole, profile, offer]);

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
                                        <p className="text-xl font-bold text-indigo-900">📦 {offer.stock_quantity ?? 0} uds</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePurchase}
                                    disabled={purchasing}
                                    className={`w-full py-5 font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 ${purchasing
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                                        }`}
                                >
                                    {purchasing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>{!session?.token ? "Inicia sesión para comprar" : "Comprar con puntos VAC"}</>
                                    )}
                                </button>

                                {profile && profile.total_vac_points < (offer.vac_price || 500) && (
                                    <p className="text-xs text-red-500 text-center font-bold">
                                        No tienes suficientes puntos VAC 💎
                                    </p>
                                )}

                                {offer.stock_quantity <= 0 && (
                                    <p className="text-xs text-red-500 text-center font-bold">
                                        ¡Agotado! 📦
                                    </p>
                                )}

                                <p className="text-[10px] text-indigo-400 text-center font-bold italic">
                                    * El canje es definitivo y no se devuelven los puntos.
                                </p>

                                {/* Diagnostic Overlay for developer */}
                                <div className="p-2 border border-dashed border-indigo-200 rounded-lg bg-indigo-50/30">
                                    <p className="text-[8px] font-mono text-indigo-400">
                                        DEBUG: Role({currentRole || 'Guest'}) | Pts({profile?.total_vac_points || 0}) | Stock({offer.stock_quantity})
                                    </p>
                                </div>
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
