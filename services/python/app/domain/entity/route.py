from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

@dataclass(frozen=True)
class Route:
    id: UUID
    name: str
    date: date
    distance_km: float
    elevation_gain_m: int
    total_time_min: int
    difficulty: int
    region: str
    notes: str | None
    start_lat: float | None
    start_lng: float | None
    end_lat: float | None
    end_lng: float | None
    is_circular: bool
    gpx_filename: str | None
    has_gpx: bool
    vac_points: int
    created_at: datetime
    updated_at: datetime
