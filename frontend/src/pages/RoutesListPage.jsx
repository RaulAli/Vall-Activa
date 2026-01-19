import { useState } from "react";
import { Link } from "react-router-dom";
import RequireAuth from "../features/auth/components/RequireAuth";
import RouteFilters from "../features/routes/components/RouteFilters";
import RoutesTable from "../features/routes/components/RoutesTable";
import { useRoutes } from "../features/routes/hooks/useRoutes";

export default function RoutesListPage() {
    const [filters, setFilters] = useState({ q: "", region: "", distance_km_min: "", distance_km_max: "" });
    const { data, loading, error } = useRoutes(filters);

    return (
        <RequireAuth>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Rutas</h2>
                    <Link to="/routes/new">+ Nueva ruta</Link>
                </div>

                <RouteFilters value={filters} onChange={setFilters} />

                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}
                {!loading && !error && <RoutesTable items={data} />}

                <div style={{ display: "flex", gap: 10 }}>
                    <Link to="/businesses">Dashboard Business</Link>
                    <Link to="/offers">Ofertas</Link>
                    <Link to="/admin">Admin</Link>
                </div>
            </div>
        </RequireAuth>
    );
}
