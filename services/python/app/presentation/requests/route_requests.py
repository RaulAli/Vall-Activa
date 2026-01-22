import datetime as dt
from pydantic import BaseModel, Field

class CreateRouteRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    date: dt.date
    distance_km: float = Field(default=0, ge=0)
    elevation_gain_m: int = Field(default=0, ge=0)
    total_time_min: int = Field(default=0, ge=0)
    difficulty: int = Field(ge=1, le=5)
    region: str = Field(min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=5000)
    start_lat: float | None = Field(default=None, ge=-90, le=90)
    start_lng: float | None = Field(default=None, ge=-180, le=180)

    end_lat: float | None = Field(default=None, ge=-90, le=90)
    end_lng: float | None = Field(default=None, ge=-180, le=180)

    is_circular: bool = False


class UpdateRouteRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    date: dt.date | None = None
    distance_km: float | None = Field(default=None, ge=0)
    elevation_gain_m: int | None = Field(default=None, ge=0)
    total_time_min: int | None = Field(default=None, ge=0)
    difficulty: int | None = Field(default=None, ge=1, le=5)
    region: str | None = Field(default=None, min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=5000)
    start_lat: float | None = Field(default=None, ge=-90, le=90)
    start_lng: float | None = Field(default=None, ge=-180, le=180)

    end_lat: float | None = Field(default=None, ge=-90, le=90)
    end_lng: float | None = Field(default=None, ge=-180, le=180)

    is_circular: bool = False

