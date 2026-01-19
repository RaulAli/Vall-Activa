import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/Provider";
import OfferForm from "../features/offers/components/OfferForm";

export default function OfferCreatePage() {
    const { mutations } = useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const businessIdParam = searchParams.get("business_id") || "";

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function handleCreate(values) {
        setSaving(true);
        setError(null);
        try {
            const created = await mutations.offers.create(values);
            // Support both direct object and { data: ... } response structures
            const newId = created?.id || created?.data?.id;
            if (newId) {
                navigate(`/offers/${newId}`);
            } else {
                navigate("/offers");
            }
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Nueva oferta</h2>
                <Link to="/offers">← Volver</Link>
            </div>

            {error && (
                <div className="card" style={{ padding: 12, backgroundColor: "#fee", color: "crimson" }}>
                    Error: {String(error.message || error)}
                </div>
            )}

            <div className="card" style={{ padding: 16 }}>
                <OfferForm
                    initialValues={{ business_id: businessIdParam }}
                    onSubmit={handleCreate}
                    submitting={saving}
                    submitText="Crear oferta"
                    businessIdLocked={!!businessIdParam}
                />
            </div>
        </div>
    );
}
