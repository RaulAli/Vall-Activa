import { useNavigate } from "react-router-dom";
import { useRoutes } from "../features/routes/hooks/useRoutes";
import { useSession } from "../features/auth/hooks/useSession";
import RoutesTable from "../features/routes/components/RoutesTable";

export default function AthleteDashboard() {
    const { me } = useSession();
    const { data: routes, loading, error } = useRoutes({ user_id: me?.id });
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
                {/* Add more stats later */}
            </div>

            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Actividad Reciente</h2>
                </div>
                <div className="p-2">
                    {loading ? (
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
