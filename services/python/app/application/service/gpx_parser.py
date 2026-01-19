import math
import gpxpy

def haversine_m(lat1, lon1, lat2, lon2) -> float:
    R = 6371000.0
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def parse_gpx_and_compute(gpx_bytes: bytes) -> dict:
    text = gpx_bytes.decode("utf-8", errors="replace")
    gpx = gpxpy.parse(text)

    points = []
    times = []

    for track in gpx.tracks:
        for segment in track.segments:
            for p in segment.points:
                if p.latitude is None or p.longitude is None:
                    continue
                ele = p.elevation
                points.append((p.latitude, p.longitude, ele))
                if p.time:
                    times.append(p.time)

    if len(points) < 2:
        return {
            "gpx_text": text,
            "track_geojson": None,
            "distance_km": 0.0,
            "elevation_gain_m": 0,
            "elevation_loss_m": 0,
            "total_time_min": 0,
            "min_altitude_m": None,
            "max_altitude_m": None,
        }

    dist_m = 0.0
    gain = 0.0
    loss = 0.0
    min_alt = None
    max_alt = None

    for i in range(1, len(points)):
        lat1, lon1, ele1 = points[i - 1]
        lat2, lon2, ele2 = points[i]

        dist_m += haversine_m(lat1, lon1, lat2, lon2)

        if ele1 is not None and ele2 is not None:
            d = ele2 - ele1
            if d > 0:
                gain += d
            elif d < 0:
                loss += abs(d)

            min_alt = ele2 if min_alt is None else min(min_alt, ele2)
            max_alt = ele2 if max_alt is None else max(max_alt, ele2)

    total_time_min = 0
    if len(times) >= 2:
        delta = max(times) - min(times)
        total_time_min = int(delta.total_seconds() // 60)

    coords = [[lon, lat] for (lat, lon, _ele) in points]
    track_geojson = {"type": "LineString", "coordinates": coords}

    return {
        "gpx_text": text,
        "track_geojson": track_geojson,
        "distance_km": round(dist_m / 1000.0, 2),
        "elevation_gain_m": int(round(gain)),
        "elevation_loss_m": int(round(loss)),
        "total_time_min": total_time_min,
        "min_altitude_m": int(round(min_alt)) if min_alt is not None else None,
        "max_altitude_m": int(round(max_alt)) if max_alt is not None else None,
    }
