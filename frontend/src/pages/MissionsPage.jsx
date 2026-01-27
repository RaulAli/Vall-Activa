import { useRoutes } from "../features/routes/hooks/useRoutes";
import { useSession } from "../features/auth/hooks/useSession";
import { useAthleteProfile } from "../features/athlete/queries/useAthleteProfile";
import { useMemo } from "react";

export default function MissionsPage() {
    const { me } = useSession();
    const { data: routes } = useRoutes({ user_id: me?.id });
    const { data: profile } = useAthleteProfile();

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayRoutes = routes?.filter(r => r.date === today) || [];
        const totalKm = todayRoutes.reduce((acc, r) => acc + (r.distance_km || 0), 0);
        const count = todayRoutes.length;
        return { totalKm, count };
    }, [routes]);

    const missions = [
        {
            id: 'first-route',
            title: 'Primer Desafío',
            description: 'Sube tu primera ruta del día',
            target: 1,
            current: stats.count >= 1 ? 1 : 0,
            unit: 'ruta',
            reward: 50,
            icon: '🚀'
        },
        {
            id: '5km',
            title: 'Calentamiento',
            description: 'Recorre 5km acumulados hoy',
            target: 5,
            current: stats.totalKm,
            unit: 'km',
            reward: 25,
            icon: '🏃'
        },
        {
            id: '10km',
            title: 'Resistencia',
            description: 'Alcanza los 10km en un día',
            target: 10,
            current: stats.totalKm,
            unit: 'km',
            reward: 50,
            icon: '💪'
        },
        {
            id: '25km',
            title: 'Explorador Épico',
            description: 'Supera los 25km hoy',
            target: 25,
            current: stats.totalKm,
            unit: 'km',
            reward: 125,
            icon: '🏔️'
        }
    ];

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            <header className="text-center space-y-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Misiones Diarias</h1>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                    Completa estos objetivos hoy para ganar puntos VAC extra y subir de nivel.
                </p>
                <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 text-indigo-700 font-bold text-sm">
                    💎 Tu Acumulado: {profile?.total_vac_points?.toLocaleString() || 0} VAC
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {missions.map(m => (
                    <MissionCard key={m.id} mission={m} />
                ))}
            </div>

            <footer className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold">¿Cómo funcionan los puntos?</h3>
                        <p className="text-slate-400 mt-2 max-w-xl">
                            Las misiones dan puntos **extra** que no cuentan para el límite diario de 500 VAC.
                            Cada km en misiones otorga 5 VAC adicionales. ¡Aprovecha los retos para maximizar tu ganancia!
                        </p>
                    </div>
                    <div className="text-5xl opacity-20">🎯</div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </footer>
        </div>
    );
}

function MissionCard({ mission }) {
    const progress = Math.min(100, (mission.current / mission.target) * 100);
    const isCompleted = mission.current >= mission.target;

    return (
        <div className={`
            bg-white p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden
            ${isCompleted ? 'border-emerald-100 shadow-xl shadow-emerald-50' : 'border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50'}
        `}>
            {isCompleted && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-200">
                    Completada
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Circular Progress Bar */}
                <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background track */}
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-slate-50"
                        />
                        {/* Progress stroke */}
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={364}
                            strokeDashoffset={364 - (364 * progress) / 100}
                            strokeLinecap="round"
                            className={`transition-all duration-1000 ${isCompleted ? 'text-emerald-500' : 'text-indigo-600'}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className={`text-3xl ${isCompleted ? 'scale-110 animate-pulse' : ''}`}>{mission.icon}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{Math.round(progress)}%</span>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{mission.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">{mission.description}</p>

                    <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Progreso</p>
                            <p className="text-lg font-black text-slate-900">
                                {mission.current.toFixed(mission.unit === 'km' ? 1 : 0)}
                                <span className="text-xs text-slate-400 ml-1 font-bold">/ {mission.target} {mission.unit}s</span>
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl border ${isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                            <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Recompensa</p>
                            <p className="text-lg font-black">+{mission.reward} VAC</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className={`absolute -bottom-6 -right-6 text-8xl opacity-[0.03] transition-transform duration-1000 ${isCompleted ? 'rotate-12 scale-110 opacity-[0.07]' : 'rotate-0'}`}>
                {mission.icon}
            </div>
        </div>
    );
}
