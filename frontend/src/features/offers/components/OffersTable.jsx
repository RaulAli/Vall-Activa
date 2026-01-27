import { Link } from "react-router-dom";

export default function OffersTable({ items }) {
    if (!items?.length) return <div className="p-8 text-center text-slate-400 italic">No hay ofertas disponibles.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold">Oferta</th>
                        <th className="px-4 py-3 font-semibold">Negocio</th>
                        <th className="px-4 py-3 font-semibold">Fechas</th>
                        <th className="px-4 py-3 font-semibold text-center">VAC</th>
                        <th className="px-4 py-3 font-semibold text-center">Stock</th>
                        <th className="px-4 py-3 font-semibold text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-4 py-4">
                                <Link to={`/offers/${o.id}`} className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {o.title}
                                </Link>
                                <p className="text-xs text-slate-400 line-clamp-1">{o.description}</p>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600 italic">
                                {o.business_name || o.business_id}
                            </td>
                            <td className="px-4 py-4 text-xs text-slate-500">
                                {new Date(o.start_date).toLocaleDateString()} <span className="mx-1 opacity-30">→</span> {new Date(o.end_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-center font-bold text-indigo-600">
                                💎 {o.vac_price}
                            </td>
                            <td className="px-4 py-4 text-center text-slate-600 font-medium">
                                📦 {o.stock_quantity}
                            </td>
                            <td className="px-4 py-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${o.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                                    {o.is_active ? "Activa" : "Inactiva"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
