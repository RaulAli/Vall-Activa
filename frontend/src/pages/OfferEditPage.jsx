import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/Provider";

export default function OfferEditPage() {
    const { id } = useParams();
    const { queries, mutations } = useApp();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const required = ["business_id", "title", "description", "category", "region", "city", "price", "start_date", "end_date"];
    const isValid =
        form && required.every((k) => String(form[k] ?? "").trim().length > 0);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const o = await queries.offers.get(id);
                if (!cancelled) {
                    setForm({
                        ...o,
                        price: o.price ?? "",
                    });
                }
            } catch (e) {
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [id, queries]);

    async function onSubmit(e) {
        e.preventDefault();
        if (!isValid) {
            setError(new Error("Rellena todos los campos obligatorios."));
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = {
                ...form,
                price: Number(form.price),
            };
            await mutations.offers.update(id, payload);
            navigate(`/offers/${id}`);
        } catch (e2) {
            setError(e2);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Editar oferta</h2>
                <Link to={`/offers/${id}`}>← Volver</Link>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}

            {!loading && !error && form && (
                <form onSubmit={onSubmit} className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
                    <input placeholder="Business ID *" value={form.business_id || ""} onChange={(e) => setForm((f) => ({ ...f, business_id: e.target.value }))} />
                    <input placeholder="Título *" value={form.title || ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                    <textarea placeholder="Descripción *" value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
                    <input placeholder="Categoría *" value={form.category || ""} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
                    <input placeholder="Región *" value={form.region || ""} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
                    <input placeholder="Ciudad *" value={form.city || ""} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                    <input placeholder="Precio *" value={form.price ?? ""} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                    <input type="date" value={form.start_date || ""} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
                    <input type="date" value={form.end_date || ""} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />

                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                            type="checkbox"
                            checked={!!form.is_active}
                            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                        />
                        Activa
                    </label>

                    <button type="submit" disabled={!isValid || saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </form>
            )}
        </div>
    );
}
