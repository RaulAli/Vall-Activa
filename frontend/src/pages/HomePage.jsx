import { Link } from "react-router-dom";
import { useSession } from "../features/auth/hooks/useSession";

export default function HomePage() {
    const { session } = useSession();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-4xl">
                <div className="mb-6 inline-block animate-bounce bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
                    Vall Activa Experimental UI
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
                    Mueve la <span className="text-indigo-600">Vall</span>, <br />
                    Mueve tu <span className="text-purple-600">Negocio</span>.
                </h1>
                <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
                    La plataforma definitiva para conectar deportistas y negocios locales en un entorno único de salud y bienestar.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/shop"
                        className="group relative px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                        <span className="relative z-10">Explorar Tienda</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {!session ? (
                        <div className="flex gap-4">
                            <Link
                                to="/athlete/login"
                                className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all hover:border-slate-200 active:scale-95"
                            >
                                Soy Atleta
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to="/athlete/dashboard"
                            className="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95"
                        >
                            Ir a mis rutas
                        </Link>
                    )}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-4">📍</div>
                        <h3 className="font-bold text-lg mb-2">Rutas Únicas</h3>
                        <p className="text-slate-500 text-sm">Descubre senderos y recorridos diseñados por nuestra comunidad activa.</p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-4">🏷️</div>
                        <h3 className="font-bold text-lg mb-2">Ofertas Exclusivas</h3>
                        <p className="text-slate-500 text-sm">Aprovecha descuentos únicos en negocios locales por ser parte de la Vall.</p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-3xl mb-4">🌱</div>
                        <h3 className="font-bold text-lg mb-2">Impacto Local</h3>
                        <p className="text-slate-500 text-sm">Cada actividad apoya directamente al ecosistema comercial de la región.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
