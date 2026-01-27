import { useNavigate, useSearchParams } from "react-router-dom";
import { useRoutes } from "../features/routes/hooks/useRoutes";
import { useSession } from "../features/auth/hooks/useSession";
import { useAthleteProfile } from "../features/athlete/queries/useAthleteProfile";
import RoutesTable from "../features/routes/components/RoutesTable";
import { useEffect, useState } from "react";

export default function AthleteDashboard() {
    const { me } = useSession();
    const { data: routes, loading: loadingRoutes } = useRoutes({ user_id: me?.id });
    const { data: profile } = useAthleteProfile();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(searchParams.get("success") === "true");

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                // Clean up URL
                setSearchParams({});
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <div className="space-y-8">
            {showSuccess && (
                <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-xl shadow-emerald-200 animate-in zoom-in duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">🏆</span>
                        <div>
                            <p className="font-black text-xl">¡Ruta Registrada con Éxito!</p>
                            <p className="opacity-90 font-medium">Tus puntos VAC y progreso diario han sido actualizados.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSuccess(false)} className="text-white/50 hover:text-white transition-colors text-2xl">×</button>
                </div>
            )}

            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Hola, {me?.email?.split('@')[0] || "Atleta"}</h1>
                    <p className="text-slate-500 mt-1">Este es tu panel personal de actividades.</p>
                </div>
                <button
                    onClick={() => navigate("/routes/new")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
                >
                    + Nueva Ruta
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Mis Rutas</p>
                    <p className="text-4xl font-black text-slate-900 mt-2">{routes?.length || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden md:col-span-2">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider">Acumulado Histórico</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-5xl font-black mt-2">{profile?.total_vac_points?.toLocaleString() || 0}</p>
                                <span className="text-indigo-200 font-bold uppercase text-xs tracking-tighter">VAC</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Actividad de hoy</p>
                            <p className="text-2xl font-black mt-1">
                                {(() => {
                                    const today = new Date().toISOString().split('T')[0];
                                    return routes?.filter(r => r.date === today).reduce((acc, r) => acc + (r.vac_points || 0), 0) || 0;
                                })()} <span className="text-sm opacity-60">/ 750</span>
                            </p>
                        </div>
                    </div>

                    {/* Progress bar for daily limit */}
                    <div className="mt-8 h-3 bg-white/20 rounded-full relative z-10 overflow-hidden ring-1 ring-white/10 backdrop-blur-sm">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            style={{
                                width: `${Math.min(100, ((routes?.filter(r => r.date === new Date().toISOString().split('T')[0]).reduce((acc, r) => acc + (r.vac_points || 0), 0) || 0) / 750) * 100)}%`
                            }}
                        />
                    </div>

                    <div className="absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 pointer-events-none">💎</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bonus Recogido hoy</p>
                    <div className="mt-3">
                        {routes?.some(r => r.date === new Date().toISOString().split('T')[0]) ? (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                                <span className="text-2xl">✅</span> +50 VAC
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <p className="text-slate-300 text-sm italic">Pendiente por hoy</p>
                                <div className="text-indigo-600 font-bold text-lg flex items-center gap-2">
                                    <span className="animate-bounce">🎁</span> +50 VAC disp.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Actividad Reciente</h2>
                </div>
                <div className="p-2">
                    {loadingRoutes ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />)}
                        </div>
                    ) : (
                        <RoutesTable items={routes} />
                    )}
                </div>
            </section>
        </div>
    );
}
