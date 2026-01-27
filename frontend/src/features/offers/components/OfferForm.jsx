import { useMemo, useState } from "react";

const REQUIRED = ["business_id", "title", "discount_type", "discount_value", "start_date", "end_date"];

export default function OfferForm({ initialValues, onSubmit, submitting, submitText, businessIdLocked }) {
    const initial = useMemo(
        () => ({
            business_id: initialValues?.business_id ?? "",
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            discount_type: initialValues?.discount_type ?? "PERCENTAGE",
            discount_value: initialValues?.discount_value ?? "",
            start_date: initialValues?.start_date ?? "",
            end_date: initialValues?.end_date ?? "",
            is_active: initialValues?.is_active ?? true,
            terms: initialValues?.terms ?? "",
            vac_price: initialValues?.vac_price ?? 500,
            stock_quantity: initialValues?.stock_quantity ?? 10,
        }),
        [initialValues]
    );

    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});

    const errors = {};
    for (const k of REQUIRED) {
        if (!String(values[k] ?? "").trim()) errors[k] = "Este campo es obligatorio";
    }
    if (values.start_date && values.end_date && values.start_date > values.end_date) {
        errors.end_date = "La fecha final debe ser posterior a la de inicio";
    }

    const isValid = Object.keys(errors).length === 0;

    function setField(name, value) {
        setValues((v) => ({ ...v, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const touchAll = {};
        REQUIRED.forEach((k) => (touchAll[k] = true));
        setTouched((t) => ({ ...t, ...touchAll }));
        if (!isValid) return;

        onSubmit({
            business_id: values.business_id,
            title: values.title.trim(),
            description: values.description.trim() || null,
            discount_type: values.discount_type.trim(),
            discount_value: values.discount_value.trim(),
            start_date: values.start_date,
            end_date: values.end_date,
            is_active: Boolean(values.is_active),
            terms: values.terms.trim() || null,
            vac_price: parseInt(values.vac_price) || 0,
            stock_quantity: parseInt(values.stock_quantity) || 0,
        });
    }

    const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium";
    const labelClass = "block text-sm font-black text-slate-700 mb-2 uppercase tracking-tight";
    const errorClass = "text-xs font-bold text-red-500 mt-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business ID (usually hidden/locked for business users) */}
                <div className={businessIdLocked ? "hidden" : "block md:col-span-2"}>
                    <label className={labelClass}>ID de Negocio*</label>
                    <input
                        className={inputClass}
                        value={values.business_id}
                        onChange={(e) => setField("business_id", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, business_id: true }))}
                        disabled={businessIdLocked}
                        placeholder="UUID del negocio"
                    />
                    {touched.business_id && errors.business_id && <p className={errorClass}>{errors.business_id}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass}>Título de la Oferta*</label>
                    <input
                        className={inputClass}
                        value={values.title}
                        onChange={(e) => setField("title", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                        placeholder="Ej: 20% de descuento en calzado"
                    />
                    {touched.title && errors.title && <p className={errorClass}>{errors.title}</p>}
                </div>

                <div>
                    <label className={labelClass}>Tipo de Descuento*</label>
                    <select
                        className={inputClass}
                        value={values.discount_type}
                        onChange={(e) => setField("discount_type", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, discount_type: true }))}
                    >
                        <option value="PERCENTAGE">Porcentaje (%)</option>
                        <option value="FIXED">Cantidad Fija (€)</option>
                        <option value="OTHER">Otro / Texto</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Valor*</label>
                    <input
                        className={inputClass}
                        value={values.discount_value}
                        onChange={(e) => setField("discount_value", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, discount_value: true }))}
                        placeholder="Ej: 20, 15, 2x1..."
                    />
                    {touched.discount_value && errors.discount_value && <p className={errorClass}>{errors.discount_value}</p>}
                </div>

                <div>
                    <label className={labelClass}>Fecha de Inicio*</label>
                    <input
                        type="date"
                        className={inputClass}
                        value={values.start_date}
                        onChange={(e) => setField("start_date", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, start_date: true }))}
                    />
                    {touched.start_date && errors.start_date && <p className={errorClass}>{errors.start_date}</p>}
                </div>

                <div>
                    <label className={labelClass}>Fecha de Fin*</label>
                    <input
                        type="date"
                        className={inputClass}
                        value={values.end_date}
                        onChange={(e) => setField("end_date", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, end_date: true }))}
                    />
                    {touched.end_date && errors.end_date && <p className={errorClass}>{errors.end_date}</p>}
                </div>

                <div>
                    <label className={labelClass}>Precio en Puntos (VAC)*</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💎</span>
                        <input
                            type="number"
                            className={`${inputClass} pl-12`}
                            value={values.vac_price}
                            onChange={(e) => setField("vac_price", e.target.value)}
                            placeholder="Ej: 500"
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Stock Disponible*</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📦</span>
                        <input
                            type="number"
                            className={`${inputClass} pl-12`}
                            value={values.stock_quantity}
                            onChange={(e) => setField("stock_quantity", e.target.value)}
                            placeholder="Ej: 10"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={Boolean(values.is_active)}
                            onChange={(e) => setField("is_active", e.target.checked)}
                        />
                        <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">
                            Oferta activa y visible para el público
                        </label>
                    </div>

                    <div>
                        <label className={labelClass}>Descripción (Opcional)</label>
                        <textarea
                            className={`${inputClass} min-h-[100px] resize-y`}
                            value={values.description}
                            onChange={(e) => setField("description", e.target.value)}
                            rows={3}
                            placeholder="Detalla qué incluye la oferta..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Términos y Condiciones</label>
                        <textarea
                            className={`${inputClass} min-h-[80px] resize-y`}
                            value={values.terms}
                            onChange={(e) => setField("terms", e.target.value)}
                            rows={2}
                            placeholder="Ej: Válido solo en tienda física, un uso por cliente..."
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid || submitting}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${!isValid || submitting
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                    }`}
            >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                    </span>
                ) : (submitText || "Guardar Oferta")}
            </button>
        </form>
    );
}
