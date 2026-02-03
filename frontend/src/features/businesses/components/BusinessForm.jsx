import { useMemo, useState } from "react";
import { useSession } from "../../auth/hooks/useSession";

const REQUIRED_FIELDS = ["name", "category", "region"];

export default function BusinessForm({ initialValues, onSubmit, submitting, submitText }) {
    const { me } = useSession();

    const initial = useMemo(
        () => ({
            email: me?.email ?? "",
            password: "",
            name: initialValues?.name ?? "",
            description: initialValues?.description ?? "",
            category: initialValues?.category ?? "",
            region: initialValues?.region ?? "",
            city: initialValues?.city ?? "",
            phone: initialValues?.phone ?? "",
            website: initialValues?.website ?? "",
            instagram: initialValues?.instagram ?? "",
        }),
        [initialValues, me]
    );

    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});

    const errors = {};
    for (const k of REQUIRED_FIELDS) {
        if (!values[k]?.trim()) errors[k] = "Obligatorio";
    }

    const isValid = Object.keys(errors).length === 0;

    function setField(name, value) {
        setValues((v) => ({ ...v, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setTouched({ name: true, category: true, region: true });
        if (!isValid) return;

        onSubmit({
            email: values.email.trim() || null,
            password: values.password.trim() || null,
            name: values.name.trim(),
            description: values.description.trim() || null,
            category: values.category.trim(),
            region: values.region.trim(),
            city: values.city.trim() || null,
            phone: values.phone.trim() || null,
            website: values.website.trim() || null,
            instagram: values.instagram.trim() || null,
        });
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50/50";
    const labelClass = "block text-sm font-bold text-slate-700 mb-1.5 ml-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6 mb-8">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">Credenciales de Acceso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Email de Acceso</label>
                        <input
                            className={inputClass}
                            value={values.email}
                            type="email"
                            placeholder="tucorreo@ejemplo.com"
                            onChange={(e) => setField("email", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Nueva Contraseña (opcional)</label>
                        <input
                            className={inputClass}
                            value={values.password}
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setField("password", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 ml-1">Información del Negocio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className={labelClass}>Nombre del Negocio*</label>
                    <input
                        className={inputClass}
                        value={values.name}
                        placeholder="Ej. Restaurante La Vall"
                        onChange={(e) => setField("name", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    />
                    {touched.name && errors.name && <div className="text-red-500 text-xs mt-1 ml-1">{errors.name}</div>}
                </div>

                <div>
                    <label className={labelClass}>Categoría*</label>
                    <input
                        className={inputClass}
                        value={values.category}
                        onChange={(e) => setField("category", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, category: true }))}
                        placeholder="restaurante, tienda..."
                    />
                    {touched.category && errors.category && <div className="text-red-500 text-xs mt-1 ml-1">{errors.category}</div>}
                </div>

                <div>
                    <label className={labelClass}>Región*</label>
                    <input
                        className={inputClass}
                        value={values.region}
                        onChange={(e) => setField("region", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, region: true }))}
                        placeholder="Ej. Ripollès"
                    />
                    {touched.region && errors.region && <div className="text-red-500 text-xs mt-1 ml-1">{errors.region}</div>}
                </div>

                <div>
                    <label className={labelClass}>Ciudad</label>
                    <input className={inputClass} value={values.city} onChange={(e) => setField("city", e.target.value)} />
                </div>

                <div>
                    <label className={labelClass}>Teléfono</label>
                    <input className={inputClass} value={values.phone} onChange={(e) => setField("phone", e.target.value)} />
                </div>
            </div>

            <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                    className={`${inputClass} min-h-[120px]`}
                    value={values.description}
                    onChange={(e) => setField("description", e.target.value)}
                    rows={4}
                    placeholder="Cuéntanos sobre tu negocio..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Website</label>
                    <input className={inputClass} value={values.website} onChange={(e) => setField("website", e.target.value)} placeholder="https://..." />
                </div>
                <div>
                    <label className={labelClass}>Instagram</label>
                    <input className={inputClass} value={values.instagram} onChange={(e) => setField("instagram", e.target.value)} placeholder="@usuario" />
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5"
            >
                {submitting ? "Guardando..." : (submitText || "Guardar Cambios")}
            </button>
        </form>
    );
}
