import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/Provider";
import { useSession } from "../features/auth/hooks/useSession";

export default function MyCouponsPage() {
    const { session } = useSession();
    const { queries } = useApp();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrCode, setQrCode] = useState(null); // validation_code for the modal

    useEffect(() => {
        if (!session?.token) return;
        async function load() {
            setLoading(true);
            try {
                const data = await queries.offers.listMyTickets(session.token);
                setTickets(data);
            } catch (e) {
                console.error("Error loading tickets", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [session?.token, queries]);

    if (loading) return (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando tus cupones...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Cupones</h1>
                <p className="text-slate-500 mt-1">Aquí tienes todos tus beneficios canjeados.</p>
            </header>

            {!tickets.length ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center shadow-xl shadow-slate-200/50">
                    <div className="text-6xl mb-4">🎟️</div>
                    <h3 className="text-xl font-bold text-slate-900">Aún no tienes cupones</h3>
                    <p className="text-slate-500 mt-2 mb-8">Canjea tus puntos VAC en la tienda para obtener descuentos.</p>
                    <Link
                        to="/shop"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all inline-block"
                    >
                        Explorar Tienda
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((t) => (
                        <div key={t.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                            <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{t.business_name}</p>
                                <h3 className="font-black text-xl line-clamp-1">{t.offer_title}</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase">Código de Canje</span>
                                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-900 font-bold">{t.validation_code}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase">Estado</span>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-black uppercase tracking-tighter text-[10px]">
                                        {t.status}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setQrCode(t.validation_code)}
                                    className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <span>📱</span> Ver Código QR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Modal (Rick Roll Placeholder) */}
            {qrCode && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setQrCode(null)}
                            className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all font-bold"
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-slate-900">Tu Código QR</h3>
                            <p className="text-slate-400 text-sm mt-1 font-medium italic">Base: {qrCode}</p>
                        </div>

                        <div className="aspect-square bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center gap-4 mb-6">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
                                alt="QR Code Rick Roll"
                                className="w-48 h-48 rounded-xl shadow-md"
                            />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Escanea en el negocio</p>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                            Muestra este código al tendero para validar tu descuento exclusivo.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
