from dataclasses import dataclass
import datetime as dt

@dataclass(frozen=True)
class RouteFiltersDTO:
    distance_km_min: float | None = None
    distance_km_max: float | None = None

    elevation_gain_m_min: int | None = None
    elevation_gain_m_max: int | None = None

    total_time_min_min: int | None = None
    total_time_min_max: int | None = None

    difficulty_min: int | None = None
    difficulty_max: int | None = None

    date_from: dt.date | None = None
    date_to: dt.date | None = None

    region: str | None = None

    sort_by: str = "date"      # date|distance|elevation|difficulty
    sort_dir: str = "desc"     # asc|desc
