import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/Provider";

export default function OfferDetailPage() {
    const { id } = useParams();
    const { queries, mutations } = useApp();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const o = await queries.offers.get(id);
                if (!cancelled) setOffer(o);
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

    async function handleDelete() {
        if (!confirm("¿Eliminar oferta?")) return;
        try {
            await mutations.offers.remove(id);
            window.location.href = "/offers";
        } catch (e) {
            alert(String(e.message || e));
        }
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Detalle oferta</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <Link to="/offers">← Volver</Link>
                    <Link to={`/offers/${id}/edit`}>Editar</Link>
                    <button onClick={handleDelete}>Eliminar</button>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}

            {!loading && !error && offer && (
                <div className="card" style={{ padding: 12 }}>
                    <div style={{ display: "grid", gap: 8 }}>
                        <div><b>Título:</b> {offer.title}</div>
                        <div><b>Business ID:</b> {offer.business_id}</div>
                        <div><b>Activa:</b> {offer.is_active ? "Sí" : "No"}</div>
                        {offer.category && <div><b>Categoría:</b> {offer.category}</div>}
                        {offer.region && <div><b>Región:</b> {offer.region}</div>}
                        {offer.city && <div><b>Ciudad:</b> {offer.city}</div>}
                        {offer.price != null && <div><b>Precio:</b> {offer.price}</div>}
                        {offer.start_date && <div><b>Desde:</b> {offer.start_date}</div>}
                        {offer.end_date && <div><b>Hasta:</b> {offer.end_date}</div>}
                        {offer.description && <div><b>Descripción:</b> {offer.description}</div>}
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <Link to={`/businesses/${offer.business_id}`}>Ver negocio</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
