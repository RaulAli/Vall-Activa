import { Link, useParams } from "react-router-dom";
import RequireAuth from "../features/auth/components/RequireAuth";
import { useRoute } from "../features/routes/hooks/useRoute";
import { useRouteTrack } from "../features/routes/hooks/useRouteTrack";
import RouteMap from "../features/routes/components/RouteMap";
import GpxUploadCard from "../features/routes/components/GpxUploadCard";

export default function RouteDetailPage() {
    const { id } = useParams();
    const { data: route, loading, error } = useRoute(id);
    const { data: track } = useRouteTrack(id);

    if (loading) return (
        <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando detalles de la ruta...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-600 max-w-2xl mx-auto mt-10">
            <h2 className="text-lg font-black uppercase tracking-tight mb-2">Error al cargar</h2>
            <p className="font-medium">{String(error.message || error)}</p>
            <Link to="/athlete/dashboard" className="inline-block mt-4 text-sm font-bold underline">Volver al panel</Link>
        </div>
    );

    return (
        <RequireAuth>
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
                {/* Hero section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 md:p-16 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13.5 19l-4-4-5 5V5s0-2 2-2h11c2 0 2 2 2 2v14l-4-4-2 2z" />
                        </svg>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                {route?.region || "Ruta Local"}
                            </span>
                            <span className="text-slate-400 text-sm font-medium">
                                {route?.date ? new Date(route.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : ''}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                            {route?.name}
                        </h1>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dificultad</span>
                                <span className="text-xl font-black text-indigo-400">Nivel {route?.difficulty}/5</span>
                            </div>
                            <div className="h-8 w-px bg-slate-800"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo</span>
                                <span className="text-xl font-black text-slate-200">{route?.is_circular ? "Circular" : "Lineal"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Stats & Map */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Distancia</p>
                                <p className="text-3xl font-black text-slate-900">{Number(route?.distance_km).toFixed(1)} <span className="text-sm">km</span></p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Desnivel</p>
                                <p className="text-3xl font-black text-slate-900">+{route?.elevation_gain_m} <span className="text-sm">m</span></p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tiempo</p>
                                <p className="text-3xl font-black text-slate-900">{Math.floor(route?.total_time_min / 60)}h {route?.total_time_min % 60}m</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 shadow-sm text-center relative overflow-hidden">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Recompensa</p>
                                <p className="text-3xl font-black text-indigo-600">+{route?.vac_points} <span className="text-sm">VAC</span></p>
                            </div>
                        </div>

                        {/* Map View */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-2">
                            <RouteMap route={route} track={track} />
                        </div>

                        {/* Notes Section */}
                        {route?.notes && (
                            <section className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Notas de la Actividad</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {route.notes}
                                </p>
                            </section>
                        )}
                    </div>

                    {/* Sidebar: Actions & Info */}
                    <div className="space-y-8">
                        {!route?.has_gpx && <GpxUploadCard routeId={id} />}

                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2 leading-tight">¿Tienes el track?</h3>
                                <p className="text-indigo-100 text-sm font-medium mb-6 opacity-90 leading-snug">
                                    Sube tu archivo GPX para ver el perfil de elevación detallado y el mapa interactivo completo.
                                </p>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-indigo-200">Tip de Atleta</p>
                                    <p className="text-xs font-medium italic opacity-90 leading-relaxed">
                                        "Asegúrate de que tu GPS tenga buena señal en el inicio para que los km sean precisos."
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Link to="/athlete/dashboard" className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2">
                                ← Volver al Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
}
