import { useState } from "react";
import { useSession } from "../features/auth/hooks/useSession";
import { updateProfile } from "../services/authApi";

export default function AthleteProfilePage() {
    const { me, session, setSession } = useSession();
    const [values, setValues] = useState({
        email: me?.email || "",
        password: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: "", message: "" });

        try {
            const payload = {};
            if (values.email !== me.email) payload.email = values.email;
            if (values.password) payload.password = values.password;

            if (Object.keys(payload).length === 0) {
                setStatus({ type: "info", message: "No se han detectado cambios." });
                setSubmitting(false);
                return;
            }

            const updatedUser = await updateProfile(payload, session.token);

            if (payload.email) {
                setSession({
                    ...session,
                    me: { ...me, email: updatedUser.email }
                });
            }

            setStatus({ type: "success", message: "Perfil actualizado correctamente." });
            setValues(v => ({ ...v, password: "" }));
        } catch (e) {
            setStatus({ type: "error", message: e.message || "Error al actualizar el perfil." });
        } finally {
            setSubmitting(false);
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50/50";
    const labelClass = "block text-sm font-bold text-slate-700 mb-1.5 ml-1";

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-900">Mi Perfil</h1>
                <p className="text-slate-500 mt-2">Gestiona tus credenciales de acceso.</p>
            </header>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status.message && (
                        <div className={`p-4 rounded-xl font-bold text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                            status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Email de Acceso</label>
                        <input
                            className={inputClass}
                            value={values.email}
                            type="email"
                            onChange={e => setValues(v => ({ ...v, email: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Nueva Contraseña</label>
                        <input
                            className={inputClass}
                            value={values.password}
                            type="password"
                            placeholder="••••••••"
                            onChange={e => setValues(v => ({ ...v, password: e.target.value }))}
                        />
                        <p className="text-[10px] text-slate-400 mt-2 ml-1">Deja este campo vacío si no deseas cambiar tu contraseña.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5"
                        >
                            {submitting ? "Actualizando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
