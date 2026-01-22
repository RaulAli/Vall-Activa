from uuid import UUID
from app.domain.entity.route import Route
from app.domain.repo_interface.route_repository import RouteRepository
from app.application.service.gpx_parser import parse_gpx_and_compute

class RouteGpxService:
    def __init__(self, repo: RouteRepository):
        self._repo = repo

    async def attach_gpx(self, route_id, filename, gpx_bytes):
        route = await self._repo.get(route_id)
        if not route:
            return None

        result = parse_gpx_and_compute(gpx_bytes)

        return await self._repo.update_gpx_and_stats(
            route_id=route_id,
            filename=filename,
            gpx_content=result["gpx_text"],
            track_geojson=result["track_geojson"],
            distance_km=result["distance_km"],
            elevation_gain_m=result["elevation_gain_m"],
            elevation_loss_m=result["elevation_loss_m"],
            total_time_min=result["total_time_min"],
            min_altitude_m=result["min_altitude_m"],
            max_altitude_m=result["max_altitude_m"],
            start_lat=result["start_lat"],
            start_lng=result["start_lng"],
            end_lat=result["end_lat"],
            end_lng=result["end_lng"],
            is_circular=result["is_circular"],
        )

    async def parse_gpx(self, gpx_bytes: bytes) -> dict:
        return parse_gpx_and_compute(gpx_bytes)
