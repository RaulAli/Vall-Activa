import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/Provider";
import OffersTable from "../features/offers/components/OffersTable";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function BusinessDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { queries, mutations } = useApp();

    const [business, setBusiness] = useState(null);
    const [offers, setOffers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [offersLoading, setOffersLoading] = useState(false);

    const [error, setError] = useState(null);
    const [offersError, setOffersError] = useState(null);

    const isValidId = Boolean(id && UUID_RE.test(id));

    async function loadBusiness(cancelledRef) {
        setLoading(true);
        setError(null);
        try {
            const b = await queries.businesses.get(id);
            if (!cancelledRef.cancelled) setBusiness(b);
        } catch (e) {
            if (!cancelledRef.cancelled) setError(e);
        } finally {
            if (!cancelledRef.cancelled) setLoading(false);
        }
    }

    async function loadOffers(cancelledRef) {
        setOffersLoading(true);
        setOffersError(null);
        try {
            const items = await queries.offers.list({ business_id: id });
            if (!cancelledRef.cancelled) setOffers(items || []);
        } catch (e) {
            if (!cancelledRef.cancelled) setOffersError(e);
        } finally {
            if (!cancelledRef.cancelled) setOffersLoading(false);
        }
    }

    useEffect(() => {
        const cancelledRef = { cancelled: false };

        // si el id es inválido, no llamamos al backend
        if (!isValidId) {
            setBusiness(null);
            setOffers([]);
            setLoading(false);
            setOffersLoading(false);
            setError(null);
            setOffersError(null);
            return () => {
                cancelledRef.cancelled = true;
            };
        }

        loadBusiness(cancelledRef);
        loadOffers(cancelledRef);

        return () => {
            cancelledRef.cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isValidId]);

    async function handleDelete() {
        if (!isValidId) return;
        if (
            !confirm(
                "¿Eliminar negocio? Esto borrará también sus ofertas si el backend lo tiene en cascada."
            )
        )
            return;

        try {
            await mutations.businesses.remove(id);
            navigate("/businesses");
        } catch (e) {
            alert(String(e.message || e));
        }
    }

    // Vista para ID inválido: evita 422 y URLs rotas
    if (!isValidId) {
        return (
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Detalle negocio</h2>
                    <Link to="/businesses">← Volver</Link>
                </div>

                <div className="card" style={{ padding: 12 }}>
                    <p style={{ color: "crimson", margin: 0 }}>
                        ID de negocio inválido: {String(id)}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Detalle negocio</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <Link to="/businesses">← Volver</Link>
                    <Link to={`/businesses/${id}/edit`}>Editar</Link>
                    <button onClick={handleDelete}>Eliminar</button>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}

            {!loading && !error && business && (
                <div className="card" style={{ padding: 12 }}>
                    <div style={{ display: "grid", gap: 8 }}>
                        <div>
                            <b>Nombre:</b> {business.name}
                        </div>
                        {business.category && (
                            <div>
                                <b>Categoría:</b> {business.category}
                            </div>
                        )}
                        {business.region && (
                            <div>
                                <b>Región:</b> {business.region}
                            </div>
                        )}
                        {business.city && (
                            <div>
                                <b>Ciudad:</b> {business.city}
                            </div>
                        )}
                        {business.address && (
                            <div>
                                <b>Dirección:</b> {business.address}
                            </div>
                        )}
                        {business.phone && (
                            <div>
                                <b>Teléfono:</b> {business.phone}
                            </div>
                        )}
                        {business.website && (
                            <div>
                                <b>Web:</b> {business.website}
                            </div>
                        )}
                        {business.description && (
                            <div>
                                <b>Descripción:</b> {business.description}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Ofertas del negocio</h3>
                <Link to={`/offers/new?business_id=${id}`}>+ Nueva oferta</Link>
            </div>

            {offersLoading && <p>Cargando ofertas...</p>}
            {offersError && (
                <p style={{ color: "crimson" }}>{String(offersError.message || offersError)}</p>
            )}
            {!offersLoading && !offersError && <OffersTable items={offers} />}
        </div>
    );
}
