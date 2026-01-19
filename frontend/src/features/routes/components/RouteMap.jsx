import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";

export default function RouteMap({ route, track }) {
    const start = route?.start_lat && route?.start_lng ? [route.start_lat, route.start_lng] : null;
    const end = route?.end_lat && route?.end_lng ? [route.end_lat, route.end_lng] : null;

    const center = start || end || [40.4168, -3.7038]; // Madrid fallback

    return (
        <div className="card" style={{ padding: 12 }}>
            <h3>Mapa</h3>
            <div style={{ height: 420 }}>
                <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {track && <GeoJSON data={track} />}

                    {start && (
                        <Marker position={start}>
                            <Popup>Inicio</Popup>
                        </Marker>
                    )}
                    {end && (
                        <Marker position={end}>
                            <Popup>Final</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
