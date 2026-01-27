import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/Provider";

export default function BusinessRegisterPage() {
    const { mutations } = useApp();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        business: {
            name: "",
            category: "",
            region: "",
            city: "",
            address: "",
            phone: "",
            website: "",
            description: "",
        },
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const validateForm = () => {
        if (!form.email.trim()) return "El email es obligatorio.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) return "El formato del email no es válido.";
        if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";

        const businessFields = ["name", "category", "region", "city", "address"];
        for (const field of businessFields) {
            if (!String(form.business[field] || "").trim()) {
                return `El campo ${field} es obligatorio.`;
            }
        }
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
            await mutations.auth.registerBusiness(form);
            navigate("/business/login");
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-slate-50/50";
    const labelClass = "block text-sm font-bold text-slate-700 mb-1.5 ml-1";

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">
                        📈
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Haz Crecer tu Negocio</h2>
                    <p className="text-slate-500 mt-2">Regístrate como socio profesional en Vall Activa.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Auth Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">1</span>
                            Credenciales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Email Profesional</label>
                                <input className={inputClass} placeholder="socio@negocio.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                            </div>
                            <div>
                                <label className={labelClass}>Password</label>
                                <input className={inputClass} type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
                            </div>
                        </div>
                    </section>

                    {/* Business Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">2</span>
                            Perfil de Negocio
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Nombre Comercial</label>
                                <input className={inputClass} placeholder="Ej. Restaurante Moderno" value={form.business.name} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, name: e.target.value } }))} />
                            </div>
                            <div>
                                <label className={labelClass}>Categoría</label>
                                <input className={inputClass} placeholder="tienda, ocio..." value={form.business.category} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, category: e.target.value } }))} />
                            </div>
                            <div>
                                <label className={labelClass}>Región</label>
                                <input className={inputClass} placeholder="Región" value={form.business.region} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, region: e.target.value } }))} />
                            </div>
                            <div>
                                <label className={labelClass}>Ciudad</label>
                                <input className={inputClass} placeholder="Ciudad" value={form.business.city} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, city: e.target.value } }))} />
                            </div>
                            <div>
                                <label className={labelClass}>Dirección</label>
                                <input className={inputClass} placeholder="Calle y número" value={form.business.address} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, address: e.target.value } }))} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">3</span>
                            Detalles adicionales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Teléfono</label>
                                <input className={inputClass} placeholder="Opcional" value={form.business.phone} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, phone: e.target.value } }))} />
                            </div>
                            <div>
                                <label className={labelClass}>Website</label>
                                <input className={inputClass} placeholder="https://..." value={form.business.website} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, website: e.target.value } }))} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Breve Descripción</label>
                                <textarea className={`${inputClass} min-h-[100px]`} placeholder="¿Qué hace especial a tu negocio?" value={form.business.description} onChange={(e) => setForm((f) => ({ ...f, business: { ...f.business, description: e.target.value } }))} rows={4} />
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
                            <span>⚠️</span>
                            <p>{String(error.message || error)}</p>
                        </div>
                    )}

                    <div className="pt-6">
                        <button
                            disabled={saving}
                            className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            {saving ? "Creando solicitud..." : "Registrar mi Negocio"}
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4">
                            Al registrarte, declaras que toda la información comercial proporcionada es verídica.
                        </p>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center text-sm">
                    <Link to="/business/login" className="font-bold text-slate-400 hover:text-purple-600 transition-colors">
                        ← Volver al portal profesional
                    </Link>
                </div>
            </div>
        </div>
    );
}
