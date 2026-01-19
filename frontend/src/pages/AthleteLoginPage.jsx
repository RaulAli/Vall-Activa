import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/Provider";
import { useSession, writeSession } from "../features/auth/hooks/useSession";

export default function AthleteLoginPage() {
    const { mutations } = useApp();
    const { setSession } = useSession();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const res = await mutations.auth.login({ email, password });
            const sessionData = { token: res.access_token, role: res.role || "ATHLETE" };
            writeSession(sessionData);
            setSession(sessionData);
            navigate("/athlete/dashboard");
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50/50";

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-indigo-100">
                        🏃
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Bienvenido Atleta</h2>
                    <p className="text-slate-500 mt-2">Accede a tus rutas y retos favoritos.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
                        <input
                            className={inputClass}
                            placeholder="tu@email.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                        <input
                            className={inputClass}
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
                            <span>⚠️</span>
                            <p>{String(error.message || error)}</p>
                        </div>
                    )}

                    <button
                        disabled={saving || !email || !password}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5"
                    >
                        {saving ? "Entrando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">¿No tienes cuenta?</span>
                        <Link to="/athlete/register" className="text-indigo-600 font-bold hover:underline">Regístrate gratis</Link>
                    </div>
                    <Link to="/business/login" className="block text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        Soy un negocio o administrador
                    </Link>
                </div>
            </div>
        </div>
    );
}
