from datetime import datetime
import datetime as dt
from uuid import UUID
from pydantic import BaseModel

class RouteResponse(BaseModel):
    id: UUID
    name: str
    date: dt.date
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
