from uuid import UUID
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dto.route_dto import CreateRouteDTO, UpdateRouteDTO
from app.domain.dto.route_filters_dto import RouteFiltersDTO
from app.domain.entity.route import Route
from app.domain.repo_interface.route_repository import RouteRepository
from app.infrastructure.db.models import RouteModel
from app.infrastructure.mapper.route_mapper import model_to_entity, touch_updated_at


class SqlAlchemyRouteRepository(RouteRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, data: CreateRouteDTO) -> Route:
        m = RouteModel(
            name=data.name,
            date=data.date,
            distance_km=data.distance_km,
            elevation_gain_m=data.elevation_gain_m,
            total_time_min=data.total_time_min,
            difficulty=data.difficulty,
            region=data.region,
            notes=data.notes,
            start_lat=data.start_lat,
            start_lng=data.start_lng,
            end_lat=data.end_lat,
            end_lng=data.end_lng,
            is_circular=data.is_circular,
        )
        self._session.add(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)

    async def get(self, route_id: UUID) -> Route | None:
        m = await self._session.get(RouteModel, route_id)
        return model_to_entity(m) if m else None

    async def list(self, filters: RouteFiltersDTO | None = None) -> List[Route]:
        stmt = select(RouteModel)

        if filters:
            if filters.distance_km_min is not None:
                stmt = stmt.where(RouteModel.distance_km >= filters.distance_km_min)
            if filters.distance_km_max is not None:
                stmt = stmt.where(RouteModel.distance_km <= filters.distance_km_max)

            if filters.elevation_gain_m_min is not None:
                stmt = stmt.where(RouteModel.elevation_gain_m >= filters.elevation_gain_m_min)
            if filters.elevation_gain_m_max is not None:
                stmt = stmt.where(RouteModel.elevation_gain_m <= filters.elevation_gain_m_max)

            if filters.total_time_min_min is not None:
                stmt = stmt.where(RouteModel.total_time_min >= filters.total_time_min_min)
            if filters.total_time_min_max is not None:
                stmt = stmt.where(RouteModel.total_time_min <= filters.total_time_min_max)

            if filters.difficulty_min is not None:
                stmt = stmt.where(RouteModel.difficulty >= filters.difficulty_min)
            if filters.difficulty_max is not None:
                stmt = stmt.where(RouteModel.difficulty <= filters.difficulty_max)

            if filters.date_from is not None:
                stmt = stmt.where(RouteModel.date >= filters.date_from)
            if filters.date_to is not None:
                stmt = stmt.where(RouteModel.date <= filters.date_to)

            if filters.region:
                stmt = stmt.where(RouteModel.region.ilike(f"%{filters.region}%"))

            sort_map = {
                "date": RouteModel.date,
                "distance": RouteModel.distance_km,
                "elevation": RouteModel.elevation_gain_m,
                "difficulty": RouteModel.difficulty,
            }
            sort_col = sort_map.get(filters.sort_by, RouteModel.date)
            stmt = stmt.order_by(sort_col.asc() if filters.sort_dir == "asc" else sort_col.desc())
        else:
            stmt = stmt.order_by(RouteModel.date.desc())

        res = await self._session.execute(stmt)
        return [model_to_entity(m) for m in res.scalars().all()]

    async def update(self, route_id: UUID, data: UpdateRouteDTO) -> Route | None:
        m = await self._session.get(RouteModel, route_id)
        if not m:
            return None

        if data.name is not None:
            m.name = data.name
        if data.date is not None:
            m.date = data.date
        if data.distance_km is not None:
            m.distance_km = data.distance_km
        if data.elevation_gain_m is not None:
            m.elevation_gain_m = data.elevation_gain_m
        if data.total_time_min is not None:
            m.total_time_min = data.total_time_min
        if data.difficulty is not None:
            m.difficulty = data.difficulty
        if data.region is not None:
            m.region = data.region
        if data.notes is not None:
            m.notes = data.notes
        if data.start_lat is not None:
            m.start_lat = data.start_lat
        if data.start_lng is not None:
            m.start_lng = data.start_lng
        if data.end_lat is not None:
            m.end_lat = data.end_lat
        if data.end_lng is not None:
            m.end_lng = data.end_lng
        if data.is_circular is not None:
            m.is_circular = data.is_circular

        touch_updated_at(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)

    async def delete(self, route_id: UUID) -> bool:
        m = await self._session.get(RouteModel, route_id)
        if not m:
            return False
        await self._session.delete(m)
        await self._session.commit()
        return True

    async def update_gpx_and_stats(
        self,
        route_id: UUID,
        filename: str,
        gpx_content: str,
        track_geojson: dict | None,
        distance_km: float,
        elevation_gain_m: int,
        elevation_loss_m: int,
        total_time_min: int,
        min_altitude_m: int | None,
        max_altitude_m: int | None,
    ) -> Route | None:
        m = await self._session.get(RouteModel, route_id)
        if not m:
            return None

        m.gpx_filename = filename
        m.gpx_content = gpx_content
        m.track_geojson = track_geojson
        m.distance_km = distance_km
        m.elevation_gain_m = elevation_gain_m
        m.elevation_loss_m = elevation_loss_m
        m.total_time_min = total_time_min
        m.min_altitude_m = min_altitude_m
        m.max_altitude_m = max_altitude_m

        touch_updated_at(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)

    async def get_track(self, route_id: UUID) -> dict | None:
        m = await self._session.get(RouteModel, route_id)
        if not m:
            return None
        return m.track_geojson