import { useMemo, useState } from "react";

const REQUIRED = ["business_id", "title", "discount_type", "discount_value", "start_date", "end_date"];

export default function OfferForm({ initialValues, onSubmit, submitting, submitText, businessIdLocked }) {
    const initial = useMemo(
        () => ({
            business_id: initialValues?.business_id ?? "",
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            discount_type: initialValues?.discount_type ?? "",
            discount_value: initialValues?.discount_value ?? "",
            start_date: initialValues?.start_date ?? "",
            end_date: initialValues?.end_date ?? "",
            is_active: initialValues?.is_active ?? true,
            terms: initialValues?.terms ?? "",
        }),
        [initialValues]
    );

    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});

    const errors = {};
    for (const k of REQUIRED) {
        if (!String(values[k] ?? "").trim()) errors[k] = "Obligatorio";
    }
    if (values.start_date && values.end_date && values.start_date > values.end_date) {
        errors.end_date = "end_date debe ser >= start_date";
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
        });
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 700 }}>
            <div>
                <label>Business ID*</label>
                <input
                    value={values.business_id}
                    onChange={(e) => setField("business_id", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, business_id: true }))}
                    disabled={businessIdLocked}
                />
                {touched.business_id && errors.business_id && <div style={{ color: "crimson" }}>{errors.business_id}</div>}
            </div>

            <div>
                <label>Título*</label>
                <input
                    value={values.title}
                    onChange={(e) => setField("title", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                />
                {touched.title && errors.title && <div style={{ color: "crimson" }}>{errors.title}</div>}
            </div>

            <div>
                <label>Tipo descuento*</label>
                <input
                    value={values.discount_type}
                    onChange={(e) => setField("discount_type", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, discount_type: true }))}
                    placeholder="percent | fixed | other"
                />
                {touched.discount_type && errors.discount_type && <div style={{ color: "crimson" }}>{errors.discount_type}</div>}
            </div>

            <div>
                <label>Valor descuento*</label>
                <input
                    value={values.discount_value}
                    onChange={(e) => setField("discount_value", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, discount_value: true }))}
                    placeholder="10, 5€, 2x1..."
                />
                {touched.discount_value && errors.discount_value && <div style={{ color: "crimson" }}>{errors.discount_value}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                    <label>Inicio*</label>
                    <input
                        type="date"
                        value={values.start_date}
                        onChange={(e) => setField("start_date", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, start_date: true }))}
                    />
                    {touched.start_date && errors.start_date && <div style={{ color: "crimson" }}>{errors.start_date}</div>}
                </div>
                <div>
                    <label>Fin*</label>
                    <input
                        type="date"
                        value={values.end_date}
                        onChange={(e) => setField("end_date", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, end_date: true }))}
                    />
                    {touched.end_date && errors.end_date && <div style={{ color: "crimson" }}>{errors.end_date}</div>}
                </div>
            </div>

            <div>
                <label>Activa</label>
                <input
                    type="checkbox"
                    checked={Boolean(values.is_active)}
                    onChange={(e) => setField("is_active", e.target.checked)}
                />
            </div>

            <div>
                <label>Descripción</label>
                <textarea value={values.description} onChange={(e) => setField("description", e.target.value)} rows={4} />
            </div>

            <div>
                <label>Condiciones</label>
                <textarea value={values.terms} onChange={(e) => setField("terms", e.target.value)} rows={3} />
            </div>

            <button type="submit" disabled={!isValid || submitting}>
                {submitting ? "Guardando..." : (submitText || "Guardar")}
            </button>
        </form>
    );
}
