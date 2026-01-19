from dataclasses import dataclass

@dataclass(frozen=True)
class RouteTrackDTO:
    track_geojson: dict
