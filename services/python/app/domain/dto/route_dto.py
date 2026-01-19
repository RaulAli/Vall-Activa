from dataclasses import dataclass
import datetime as dt

@dataclass(frozen=True)
class CreateRouteDTO:
    name: str
    date: dt.date
    distance_km: float
    elevation_gain_m: int
    total_time_min: int
    difficulty: int  # 1..5
    region: str
    notes: str | None = None
    start_lat: float | None = None
    start_lng: float | None = None
    end_lat: float | None = None
    end_lng: float | None = None
    is_circular: bool = False


@dataclass(frozen=True)
class UpdateRouteDTO:
    name: str | None = None
    date: dt.date | None = None
    distance_km: float | None = None
    elevation_gain_m: int | None = None
    total_time_min: int | None = None
    difficulty: int | None = None
    region: str | None = None
    notes: str | None = None
    start_lat: float | None = None
    start_lng: float | None = None
    end_lat: float | None = None
    end_lng: float | None = None
    is_circular: bool = False

