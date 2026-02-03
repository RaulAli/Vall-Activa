import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/Provider";
import OffersTable from "../features/offers/components/OffersTable";

export default function OffersListPage() {
    const { queries } = useApp();

    const [filters, setFilters] = useState({
        q: "",
        business_id: "",
        is_active: "",
        date_from: "",
        date_to: "",
        category: "",
        region: "",
    });

    const normalized = useMemo(() => {
        return {
            ...filters,
            is_active: filters.is_active === "" ? null : filters.is_active === "true",
        };
    }, [filters]);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError(null);
            try {
                const items = await queries.offers.list(normalized);
                if (!cancelled) setData(items || []);
            } catch (e) {
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [
        queries,
        normalized.q,
        normalized.business_id,
        normalized.is_active,
        normalized.date_from,
        normalized.date_to,
        normalized.category,
        normalized.region,
    ]);

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Ofertas</h2>
                {/* <Link to="/offers/new">+ Nueva oferta</Link> */}
            </div>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, 1fr)" }}>
                <input
                    placeholder="Buscar..."
                    value={filters.q}
                    onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                />
                <input
                    placeholder="Business ID"
                    value={filters.business_id}
                    onChange={(e) => setFilters((f) => ({ ...f, business_id: e.target.value }))}
                />
                <select
                    value={filters.is_active}
                    onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value }))}
                >
                    <option value="">(todas)</option>
                    <option value="true">Activas</option>
                    <option value="false">Inactivas</option>
                </select>

                <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
                />
                <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
                />
                <input
                    placeholder="Región"
                    value={filters.region}
                    onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
                />
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}
            {!loading && !error && <OffersTable items={data} />}
        </div>
    );
}
