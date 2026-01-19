from dataclasses import dataclass

@dataclass(frozen=True)
class BusinessFiltersDTO:
    q: str | None = None
    category: str | None = None
    region: str | None = None
    city: str | None = None
