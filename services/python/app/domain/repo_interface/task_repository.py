from abc import ABC, abstractmethod
from uuid import UUID
from app.domain.entity.task import Task
from app.domain.dto.task_dto import CreateTaskDTO, UpdateTaskDTO

class TaskRepository(ABC):
    @abstractmethod
    async def create(self, data: CreateTaskDTO) -> Task: ...

    @abstractmethod
    async def get(self, task_id: UUID) -> Task | None: ...

    @abstractmethod
    async def list(self) -> list[Task]: ...

    @abstractmethod
    async def update(self, task_id: UUID, data: UpdateTaskDTO) -> Task | None: ...

    @abstractmethod
    async def delete(self, task_id: UUID) -> bool: ...
