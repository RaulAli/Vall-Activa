import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/Provider";

function pickId(obj) {
    // soporta respuestas tipo {id: ...} o {data: {id: ...}}
    return obj?.id || obj?.data?.id || null;
}

export default function BusinessCreatePage() {
    const { session, mutations } = useApp();
    const token = session?.token;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        category: "",
        region: "",
        city: "",
        address: "",
        phone: "",
        website: "",
        description: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const required = ["name", "category", "region", "city", "address"];
    const isValid = required.every((k) => String(form[k] || "").trim().length > 0);

    async function onSubmit(e) {
        e.preventDefault();
        if (!isValid) {
            setError(new Error("Rellena todos los campos obligatorios."));
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const created = await mutations.businesses.create(form, token);

            const newId = pickId(created);
            if (!newId) {
                throw new Error(
                    `La API no devolvió id al crear el negocio. Respuesta: ${JSON.stringify(created)}`
                );
            }

            navigate(`/businesses/${newId}`);
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Nuevo negocio</h2>
                <Link to="/businesses">← Volver</Link>
            </div>

            <form onSubmit={onSubmit} className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
                <input
                    placeholder="Nombre *"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                    placeholder="Categoría *"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                />
                <input
                    placeholder="Región *"
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                />
                <input
                    placeholder="Ciudad *"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
                <input
                    placeholder="Dirección *"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />

                <input
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <input
                    placeholder="Website"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
                <textarea
                    placeholder="Descripción"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                />

                {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}

                <button type="submit" disabled={!isValid || saving}>
                    {saving ? "Guardando..." : "Crear negocio"}
                </button>
            </form>
        </div>
    );
}
