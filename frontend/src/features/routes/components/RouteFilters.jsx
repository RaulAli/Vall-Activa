export default function RouteFilters({ value, onChange }) {
    const v = value || {};
    return (
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(4, 1fr)" }}>
            <input placeholder="Buscar..." value={v.q || ""} onChange={(e) => onChange({ ...v, q: e.target.value })} />
            <input placeholder="Región" value={v.region || ""} onChange={(e) => onChange({ ...v, region: e.target.value })} />
            <input type="number" placeholder="Distancia min" value={v.distance_km_min || ""} onChange={(e) => onChange({ ...v, distance_km_min: e.target.value })} />
            <input type="number" placeholder="Distancia max" value={v.distance_km_max || ""} onChange={(e) => onChange({ ...v, distance_km_max: e.target.value })} />
        </div>
    );
}
