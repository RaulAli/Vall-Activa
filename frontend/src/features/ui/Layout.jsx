import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSession, clearSession } from "../auth/hooks/useSession";
import { VacHeaderBadge } from "../athlete/ui/VacHeaderBadge";

export default function Layout({ children }) {
    const { session, me } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const role = me?.role || session?.role;

    function handleLogout() {
        clearSession();
        window.location.href = "/";
    }

    const isActive = (path) => location.pathname === path;

    const navItems = [];

    // Dynamic Home/Dashboard link (Replaces Home if logged in)
    if (role === "BUSINESS") {
        navItems.push({ label: "Mi Negocio", path: "/business/dashboard" });
    } else if (role === "ATHLETE" || role === "ATHLETE_VIP") {
        navItems.push({ label: "Mi Panel", path: "/athlete/dashboard" });
    } else {
        navItems.push({ label: "Home", path: "/" });
    }

    navItems.push({ label: "Tienda", path: "/shop" });

    if (role === "ATHLETE" || role === "ATHLETE_VIP") {
        navItems.push({ label: "Misiones", path: "/athlete/missions" });
        navItems.push({ label: "Mis Cupones", path: "/athlete/coupons" });
    }

    if (role === "ADMIN") {
        navItems.push({ label: "Admin", path: "/admin" });
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
            {/* Sidebar / Mobile Menu */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 md:relative md:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="h-full flex flex-col p-6">
                    <div className="text-2xl font-bold text-indigo-600 mb-8 flex items-center gap-2">
                        <span className="bg-indigo-600 text-white p-1 rounded-lg">VA</span>
                        Vall Activa
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                    ${isActive(item.path)
                                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                                        : "hover:bg-slate-100 text-slate-600"}
                                `}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-slate-100">
                        {session ? (
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <div className="text-sm">
                                    <p className="font-bold text-slate-900 truncate w-32">{me?.email?.split('@')[0] || "Usuario"}</p>
                                    <p className="text-slate-400 capitalize text-[10px] font-bold tracking-tight">{role?.toLowerCase()}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group"
                                    title="Cerrar sesión"
                                >
                                    <span className="text-lg group-hover:scale-110 inline-block transition-transform">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    to="/athlete/login"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white text-sm rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                >
                                    <span>🏃</span> Atleta
                                </Link>
                                <Link
                                    to="/business/login"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    <span>🏢</span> Negocio
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0">
                    <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
                        ☰
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        {(role === "ATHLETE" || role === "ATHLETE_VIP") && <VacHeaderBadge />}

                        {/* Notification or Search icon placeholders */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">

                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
