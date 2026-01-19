from datetime import datetime
from app.domain.entity.task import Task
from app.infrastructure.db.models import TaskModel

def model_to_entity(m: TaskModel) -> Task:
    return Task(
        id=m.id,
        title=m.title,
        description=m.description,
        done=m.done,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )

def touch_updated_at(m: TaskModel) -> None:
    m.updated_at = datetime.utcnow()
