from datetime import datetime
from app.domain.entity.route import Route
from app.infrastructure.db.models import RouteModel

def model_to_entity(m: RouteModel) -> Route:
    return Route(
        id=m.id,
        name=m.name,
        date=m.date,
        distance_km=m.distance_km,
        elevation_gain_m=m.elevation_gain_m,
        total_time_min=m.total_time_min,
        difficulty=m.difficulty,
        region=m.region,
        notes=m.notes,
        start_lat=m.start_lat,
        start_lng=m.start_lng,
        end_lat=m.end_lat,
        end_lng=m.end_lng,
        is_circular=m.is_circular,
        gpx_filename=m.gpx_filename,
        has_gpx=bool(m.gpx_filename),
        created_at=m.created_at,
        updated_at=m.updated_at,
    )

def touch_updated_at(m: RouteModel) -> None:
    m.updated_at = datetime.utcnow()
