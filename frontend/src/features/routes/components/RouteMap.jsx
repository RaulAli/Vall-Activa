import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";

export default function RouteMap({ route, track }) {
    const start = route?.start_lat && route?.start_lng ? [route.start_lat, route.start_lng] : null;
    const end = route?.end_lat && route?.end_lng ? [route.end_lat, route.end_lng] : null;

    const center = start || end || [40.4168, -3.7038]; // Madrid fallback

    return (
        <div className="w-full h-[500px] overflow-hidden rounded-[1.8rem]">
            <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {track && <GeoJSON data={track} style={{ color: '#4f46e5', weight: 5, opacity: 0.8 }} />}

                {start && (
                    <Marker position={start}>
                        <Popup>Punto de Inicio</Popup>
                    </Marker>
                )}
                {end && (
                    <Marker position={end}>
                        <Popup>Punto Final</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
