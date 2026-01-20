import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/Provider";
import BusinessesTable from "../features/businesses/components/BusinessesTable";

export default function BusinessesListPage() {
    const { session, queries } = useApp();
    const token = session?.token;

    const [filters, setFilters] = useState({
        q: "",
        category: "",
        region: "",
        city: "",
        status: "",
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError(null);
            try {
                const items = await queries.businesses.list(filters, token);
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
    }, [queries, filters, token]);

    return (
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Negocios</h2>
                <Link to="/businesses/new">+ Nuevo negocio</Link>
            </div>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(4, 1fr)" }}>
                <input
                    placeholder="Buscar..."
                    value={filters.q}
                    onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                />
                <input
                    placeholder="Categoría"
                    value={filters.category}
                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                />
                <input
                    placeholder="Región"
                    value={filters.region}
                    onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
                />
                <input
                    placeholder="Ciudad"
                    value={filters.city}
                    onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                />
                <select
                    value={filters.status}
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                    <option value="">(todos los estados)</option>
                    <option value="PENDING">Pendientes</option>
                    <option value="APPROVED">Aprobados</option>
                    <option value="REJECTED">Rechazados</option>
                </select>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}
            {!loading && !error && <BusinessesTable items={data} />}
        </div>
    );
}
