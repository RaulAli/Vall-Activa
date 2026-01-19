import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBusiness } from "../features/businesses/hooks/useBusiness";
import BusinessForm from "../features/businesses/components/BusinessForm";
import { useBusinessMutations } from "../features/businesses/hooks/useBusinessMutations";

export default function BusinessEditPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const { data, loading, error } = useBusiness(id);
    const { updateBusiness } = useBusinessMutations();

    const [submitting, setSubmitting] = useState(false);
    const [saveError, setSaveError] = useState(null);

    async function onSubmit(payload) {
        setSubmitting(true);
        setSaveError(null);
        try {
            const updated = await updateBusiness(id, payload);
            nav(`/businesses/${updated.id}`);
        } catch (e) {
            setSaveError(e);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div style={{ padding: 16 }}>Cargando...</div>;
    if (error) return <div style={{ padding: 16, color: "crimson" }}>{String(error.message || error)}</div>;
    if (!data) return <div style={{ padding: 16 }}>No encontrado</div>;

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <h2>Editar negocio</h2>
            {saveError && <p style={{ color: "crimson" }}>{String(saveError.message || saveError)}</p>}
            <BusinessForm initialValues={data} onSubmit={onSubmit} submitting={submitting} submitText="Guardar" />
        </div>
    );
}
