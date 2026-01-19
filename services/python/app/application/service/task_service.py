from uuid import UUID
from app.domain.dto.task_dto import CreateTaskDTO, UpdateTaskDTO
from app.domain.entity.task import Task
from app.domain.repo_interface.task_repository import TaskRepository

class TaskService:
    def __init__(self, repo: TaskRepository):
        self._repo = repo

    async def create_task(self, data: CreateTaskDTO) -> Task:
        return await self._repo.create(data)

    async def get_task(self, task_id: UUID) -> Task | None:
        return await self._repo.get(task_id)

    async def list_tasks(self) -> list[Task]:
        return await self._repo.list()

    async def update_task(self, task_id: UUID, data: UpdateTaskDTO) -> Task | None:
        return await self._repo.update(task_id, data)

    async def delete_task(self, task_id: UUID) -> bool:
        return await self._repo.delete(task_id)
