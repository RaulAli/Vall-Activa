from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.application.service.business_service import BusinessService
from app.domain.dto.business_dto import CreateBusinessDTO, UpdateBusinessDTO
from app.domain.dto.business_filters_dto import BusinessFiltersDTO
from app.infrastructure.container import get_business_service, get_actor_dep, get_optional_actor_dep
from app.presentation.requests.business_requests import CreateBusinessRequest, UpdateBusinessRequest
from app.presentation.responses.business_responses import BusinessResponse

router = APIRouter(prefix="/businesses", tags=["businesses"])

@router.post("", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(
    body: CreateBusinessRequest,
    service: BusinessService = Depends(get_business_service),
    actor = Depends(get_actor_dep)
):
    dto = CreateBusinessDTO(owner_id=actor.user_id, **body.model_dump())
    created = await service.create_business(dto)
    return BusinessResponse(**created.__dict__)

@router.get("", response_model=list[BusinessResponse])
async def list_businesses(
    q: str | None = Query(default=None),
    owner_id: UUID | None = Query(default=None),
    category: str | None = Query(default=None),
    region: str | None = Query(default=None),
    city: str | None = Query(default=None),
    status: str | None = Query(default=None),
    service: BusinessService = Depends(get_business_service),
    actor = Depends(get_optional_actor_dep)
):
    # Enforce APPROVED status for non-admins, unless requesting own business
    is_owner = actor and owner_id and actor.user_id == owner_id
    if (not actor or actor.role != "ADMIN") and not is_owner:
        status = "APPROVED"
        
    filters = BusinessFiltersDTO(owner_id=owner_id, q=q, category=category, region=region, city=city, status=status)
    items = await service.list_businesses(filters)
    return [BusinessResponse(**x.__dict__) for x in items]

@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(
    business_id: UUID,
    service: BusinessService = Depends(get_business_service),
):
    b = await service.get_business(business_id)
    if not b:
        raise HTTPException(status_code=404, detail="Business not found")
    return BusinessResponse(**b.__dict__)

@router.put("/{business_id}", response_model=BusinessResponse)
async def update_business(
    business_id: UUID,
    body: UpdateBusinessRequest,
    service: BusinessService = Depends(get_business_service),
):
    dto = UpdateBusinessDTO(**body.model_dump(exclude_unset=True))
    updated = await service.update_business(business_id, dto)
    if not updated:
        raise HTTPException(status_code=404, detail="Business not found")
    return BusinessResponse(**updated.__dict__)

@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_business(
    business_id: UUID,
    service: BusinessService = Depends(get_business_service),
):
    ok = await service.delete_business(business_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Business not found")
    return None
