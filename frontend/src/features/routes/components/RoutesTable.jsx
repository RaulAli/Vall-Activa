import { Link } from "react-router-dom";

export default function RoutesTable({ items = [] }) {
    if (!items.length) return <div className="p-12 text-center text-slate-400">Sin resultados.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Ruta</th>
                        <th className="px-6 py-4 font-semibold">Región</th>
                        <th className="px-6 py-4 font-semibold text-right">Km</th>
                        <th className="px-6 py-4 font-semibold text-right">Desnivel</th>
                        <th className="px-6 py-4 font-semibold text-right">Tiempo</th>
                        <th className="px-6 py-4 font-semibold text-right text-indigo-600">VAC</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-5">
                                <Link to={`/routes/${r.id}`} className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block">
                                    {r.name}
                                </Link>
                                <span className="text-[10px] text-slate-400">{new Date(r.date).toLocaleDateString()}</span>
                            </td>
                            <td className="px-6 py-5 text-sm text-slate-600">
                                {r.region}
                            </td>
                            <td className="px-6 py-5 text-right font-mono text-sm text-slate-700">
                                {Number(r.distance_km).toFixed(1)} <span className="text-[10px] text-slate-400 uppercase">km</span>
                            </td>
                            <td className="px-6 py-5 text-right font-mono text-sm text-slate-700">
                                {r.elevation_gain_m} <span className="text-[10px] text-slate-400 uppercase">m</span>
                            </td>
                            <td className="px-6 py-5 text-right font-mono text-sm text-slate-700">
                                {r.total_time_min} <span className="text-[10px] text-slate-400 uppercase">min</span>
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-sm text-indigo-600">
                                +{r.vac_points} <span className="text-[10px] uppercase">pts</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
