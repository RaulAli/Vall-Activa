from dataclasses import dataclass

@dataclass(frozen=True)
class CreateTaskDTO:
    title: str
    description: str | None = None

@dataclass(frozen=True)
class UpdateTaskDTO:
    title: str | None = None
    description: str | None = None
    done: bool | None = None
