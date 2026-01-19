import { useNavigate } from "react-router-dom";
import { useSession } from "../features/auth/hooks/useSession";
import { useBusinesses } from "../features/businesses/hooks/useBusinesses";
import { useOffers } from "../features/offers/hooks/useOffers";
import OffersTable from "../features/offers/components/OffersTable";

export default function BusinessDashboard() {
    const { me } = useSession();
    const navigate = useNavigate();
    const { data: businesses, loading: bLoading } = useBusinesses(); // In real app, filter by owner
    const { data: offers, loading: oLoading } = useOffers(); // In real app, filter by owner

    // Conceptually, a business user might own multiple profiles, but usually one.
    const myBusiness = businesses?.[0];

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Gestión de Negocio</h1>
                    <p className="text-slate-500 mt-1">Controla tu presencia y tus promociones activas.</p>
                </div>
                <div className="flex gap-3">
                    {myBusiness && (
                        <button
                            onClick={() => navigate(`/businesses/${myBusiness.id}/edit`)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            Editar Negocio
                        </button>
                    )}
                    <button
                        onClick={() => navigate("/offers/new")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
                    >
                        + Nueva Oferta
                    </button>
                </div>
            </header>

            {!bLoading && !myBusiness && (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-800 flex items-center gap-4">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-bold">Aún no tienes un perfil de negocio activo.</p>
                        <button onClick={() => navigate("/businesses/new")} className="underline mt-1">Crear perfil ahora</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Mis Ofertas</h2>
                    {oLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl" />)}
                        </div>
                    ) : (
                        <OffersTable items={offers} />
                    )}
                </section>

                <section className="bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">¡Potencia tus ventas!</h2>
                    <p className="text-indigo-100 mb-6 opacity-90">
                        Recuerda que las ofertas destacadas tienen un 40% más de visibilidad entre los atletas locales.
                    </p>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <p className="text-sm font-semibold mb-2">Tip del día:</p>
                        <p className="text-sm opacity-80 italic">"Las ofertas de fin de semana suelen tener mayor conversión para servicios de restauración y ocio."</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
