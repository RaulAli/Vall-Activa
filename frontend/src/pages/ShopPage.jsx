import { useState } from "react";
import { useBusinesses } from "../features/businesses/hooks/useBusinesses";
import { useOffers } from "../features/offers/hooks/useOffers";
import { Link } from "react-router-dom";

export default function ShopPage() {
    const [tab, setTab] = useState("offers"); // "offers" | "businesses"
    const { data: businesses, loading: bLoading } = useBusinesses();
    const { data: offers, loading: oLoading } = useOffers();

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Tienda Vall Activa</h1>
                    <p className="text-slate-500 mt-1">Explora los mejores negocios y ofertas de la región.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setTab("offers")}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "offers" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Ofertas
                    </button>
                    <button
                        onClick={() => setTab("businesses")}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "businesses" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Negocios
                    </button>
                </div>
            </header>

            {tab === "offers" ? (
                <section>
                    {oLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {offers.map(offer => (
                                <Link
                                    key={offer.id}
                                    to={`/offers/${offer.id}`}
                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all"
                                >
                                    <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex items-start justify-between">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            {offer.category || "General"}
                                        </span>
                                        <div className="text-white text-right">
                                            <p className="text-2xl font-black">{offer.discount_value}</p>
                                            <p className="text-[10px] uppercase opacity-80">{offer.discount_type}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{offer.title}</h3>
                                        <p className="text-slate-500 text-sm mt-1 line-clamp-2 h-10">{offer.description}</p>
                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                            <span>Hasta {new Date(offer.end_date).toLocaleDateString()}</span>
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">Ver más</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                <section>
                    {bLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {businesses.map(b => (
                                <Link
                                    key={b.id}
                                    to={`/businesses/${b.id}`}
                                    className="block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-indigo-100 transition-all text-center"
                                >
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 group-hover:bg-indigo-50 transition-colors">
                                        🏢
                                    </div>
                                    <h3 className="font-bold text-slate-900">{b.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1">{b.city}, {b.region}</p>
                                    <div className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                        {b.business_type}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
