from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.dto.task_dto import CreateTaskDTO, UpdateTaskDTO
from app.domain.entity.task import Task
from app.domain.repo_interface.task_repository import TaskRepository
from app.infrastructure.db.models import TaskModel
from app.infrastructure.mapper.task_mapper import model_to_entity, touch_updated_at

class SqlAlchemyTaskRepository(TaskRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, data: CreateTaskDTO) -> Task:
        m = TaskModel(title=data.title, description=data.description, done=False)
        self._session.add(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)

    async def get(self, task_id: UUID) -> Task | None:
        m = await self._session.get(TaskModel, task_id)
        return model_to_entity(m) if m else None

    async def list(self) -> list[Task]:
        res = await self._session.execute(select(TaskModel).order_by(TaskModel.created_at.desc()))
        return [model_to_entity(m) for m in res.scalars().all()]

    async def update(self, task_id: UUID, data: UpdateTaskDTO) -> Task | None:
        m = await self._session.get(TaskModel, task_id)
        if not m:
            return None

        if data.title is not None:
            m.title = data.title
        if data.description is not None:
            m.description = data.description
        if data.done is not None:
            m.done = data.done

        touch_updated_at(m)
        await self._session.commit()
        await self._session.refresh(m)
        return model_to_entity(m)

    async def delete(self, task_id: UUID) -> bool:
        m = await self._session.get(TaskModel, task_id)
        if not m:
            return False
        await self._session.delete(m)
        await self._session.commit()
        return True
