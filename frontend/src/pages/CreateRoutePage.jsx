import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "../features/auth/components/RequireAuth";
import { useApp } from "../context/Provider";
import { readSession } from "../features/auth/hooks/useSession";

export default function CreateRoutePage() {
    const { mutations } = useApp();
    const { token } = readSession() || {};
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        date: "",
        distance_km: "",
        elevation_gain_m: "",
        total_time_min: "",
        difficulty: "",
        region: "",
        notes: "",
        start_lat: "",
        start_lng: "",
        end_lat: "",
        end_lng: "",
        is_circular: false,
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const required = [
        form.name,
        form.date,
        form.distance_km,
        form.elevation_gain_m,
        form.total_time_min,
        form.difficulty,
        form.region,
        form.start_lat,
        form.start_lng,
        form.end_lat,
        form.end_lng,
    ].every((x) => String(x || "").trim().length > 0);

    async function onSubmit(e) {
        e.preventDefault();
        if (!required) {
            setError(new Error("Rellena todos los campos obligatorios."));
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = {
                ...form,
                distance_km: Number(form.distance_km),
                elevation_gain_m: Number(form.elevation_gain_m),
                total_time_min: Number(form.total_time_min),
                difficulty: Number(form.difficulty),
                start_lat: Number(form.start_lat),
                start_lng: Number(form.start_lng),
                end_lat: Number(form.end_lat),
                end_lng: Number(form.end_lng),
            };

            const created = await mutations.routes.create(payload, token);
            navigate(`/routes/${created.id}`);
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <RequireAuth>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Nueva ruta</h2>
                    <Link to="/routes">← Volver</Link>
                </div>

                <form onSubmit={onSubmit} className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
                    <input placeholder="Nombre *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />

                    <input placeholder="Región *" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
                    <textarea placeholder="Notas" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} />

                    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(4, 1fr)" }}>
                        <input placeholder="Km *" value={form.distance_km} onChange={(e) => setForm((f) => ({ ...f, distance_km: e.target.value }))} />
                        <input placeholder="Desnivel + *" value={form.elevation_gain_m} onChange={(e) => setForm((f) => ({ ...f, elevation_gain_m: e.target.value }))} />
                        <input placeholder="Tiempo (min) *" value={form.total_time_min} onChange={(e) => setForm((f) => ({ ...f, total_time_min: e.target.value }))} />
                        <input placeholder="Dificultad (1-5) *" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))} />
                    </div>

                    <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, 1fr)" }}>
                        <input placeholder="Start lat *" value={form.start_lat} onChange={(e) => setForm((f) => ({ ...f, start_lat: e.target.value }))} />
                        <input placeholder="Start lng *" value={form.start_lng} onChange={(e) => setForm((f) => ({ ...f, start_lng: e.target.value }))} />
                        <input placeholder="End lat *" value={form.end_lat} onChange={(e) => setForm((f) => ({ ...f, end_lat: e.target.value }))} />
                        <input placeholder="End lng *" value={form.end_lng} onChange={(e) => setForm((f) => ({ ...f, end_lng: e.target.value }))} />
                    </div>

                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="checkbox" checked={form.is_circular} onChange={(e) => setForm((f) => ({ ...f, is_circular: e.target.checked }))} />
                        Circular
                    </label>

                    {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}
                    <button type="submit" disabled={!required || saving}>{saving ? "Guardando..." : "Crear ruta"}</button>
                </form>
            </div>
        </RequireAuth>
    );
}
