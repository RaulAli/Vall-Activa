import { useNavigate } from "react-router-dom";
import { useRoutes } from "../features/routes/hooks/useRoutes";
import { useSession } from "../features/auth/hooks/useSession";
import { useAthleteProfile } from "../features/athlete/queries/useAthleteProfile";
import RoutesTable from "../features/routes/components/RoutesTable";

export default function AthleteDashboard() {
    const { me } = useSession();
    const { data: routes, loading: loadingRoutes } = useRoutes({ user_id: me?.id });
    const { data: profile } = useAthleteProfile();
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Mis Rutas</p>
                    <p className="text-4xl font-black text-slate-900 mt-2">{routes?.length || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                    <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider relative z-10">Mis Puntos VAC</p>
                    <p className="text-4xl font-black mt-2 relative z-10">{profile?.total_vac_points || 0}</p>
                    <div className="absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12">💎</div>
                </div>
                {/* Add more stats later */}
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
