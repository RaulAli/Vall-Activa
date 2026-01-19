import { Link, useParams } from "react-router-dom";
import RequireAuth from "../features/auth/components/RequireAuth";
import { useRoute } from "../features/routes/hooks/useRoute";
import { useRouteTrack } from "../features/routes/hooks/useRouteTrack";
import RouteMap from "../features/routes/components/RouteMap";
import GpxUploadCard from "../features/routes/components/GpxUploadCard";

export default function RouteDetailPage() {
    const { id } = useParams();
    const { data: route, loading, error } = useRoute(id);
    const { data: track } = useRouteTrack(id);

    return (
        <RequireAuth>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Detalle ruta</h2>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Link to="/routes">← Volver</Link>
                    </div>
                </div>

                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: "crimson" }}>{String(error.message || error)}</p>}

                {!loading && !error && route && (
                    <>
                        <div className="card" style={{ padding: 12 }}>
                            <h3>{route.name}</h3>
                            <div style={{ display: "grid", gap: 8 }}>
                                <div><b>Fecha:</b> {route.date}</div>
                                <div><b>Región:</b> {route.region}</div>
                                <div><b>Distancia:</b> {Number(route.distance_km).toFixed(2)} km</div>
                                <div><b>Desnivel +:</b> {route.elevation_gain_m} m</div>
                                <div><b>Tiempo:</b> {route.total_time_min} min</div>
                                <div><b>Dificultad:</b> {route.difficulty}</div>
                                <div><b>Circular:</b> {route.is_circular ? "Sí" : "No"}</div>
                                {route.notes && <div style={{ opacity: 0.85 }}>{route.notes}</div>}
                            </div>
                        </div>

                        <GpxUploadCard routeId={id} />

                        <RouteMap route={route} track={track} />
                    </>
                )}
            </div>
        </RequireAuth>
    );
}
