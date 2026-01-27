import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/Provider";

export default function AthleteRegisterPage() {
    const { mutations } = useApp();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        display_name: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const validateForm = () => {
        if (!form.display_name.trim()) return "El nombre es obligatorio.";
        if (!form.email.trim()) return "El email es obligatorio.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) return "El formato del email no es válido.";
        if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
        return null;
    };

    async function onSubmit(e) {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await mutations.auth.registerAthlete(form);
            navigate("/athlete/login");
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50/50";
    const labelClass = "block text-sm font-bold text-slate-700 mb-1.5 ml-1";

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
                        ✨
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Nueva Cuenta Atleta</h2>
                    <p className="text-slate-500 mt-2">Únete a la comunidad de Vall Activa hoy mismo.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className={labelClass}>Tu Nombre</label>
                        <input
                            className={inputClass}
                            placeholder="Ej. Juan Pérez"
                            value={form.display_name}
                            onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input
                            className={inputClass}
                            placeholder="tu@email.com"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Password</label>
                        <input
                            className={inputClass}
                            placeholder="Al menos 8 caracteres"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
                            <span>⚠️</span>
                            <p>{String(error.message || error)}</p>
                        </div>
                    )}

                    <button
                        disabled={saving}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5"
                    >
                        {saving ? "Creando..." : "Crear Cuenta"}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <Link to="/athlete/login" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                        ← Volver a inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
