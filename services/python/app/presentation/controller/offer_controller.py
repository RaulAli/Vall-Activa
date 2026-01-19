from datetime import date
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.application.service.offer_service import OfferService
from app.domain.dto.offer_dto import CreateOfferDTO, UpdateOfferDTO
from app.domain.dto.offer_filters_dto import OfferFiltersDTO
from app.infrastructure.container import get_offer_service
from app.presentation.requests.offer_requests import CreateOfferRequest, UpdateOfferRequest
from app.presentation.responses.offer_responses import OfferResponse

router = APIRouter(prefix="/offers", tags=["offers"])

@router.post("", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
async def create_offer(
    body: CreateOfferRequest,
    service: OfferService = Depends(get_offer_service),
):
    dto = CreateOfferDTO(**body.model_dump())
    created = await service.create_offer(dto)
    return OfferResponse(**created.__dict__)

@router.get("", response_model=list[OfferResponse])
async def list_offers(
    q: str | None = Query(default=None),
    business_id: UUID | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    category: str | None = Query(default=None),
    region: str | None = Query(default=None),
    service: OfferService = Depends(get_offer_service),
):
    filters = OfferFiltersDTO(
        q=q,
        business_id=business_id,
        is_active=is_active,
        date_from=date_from,
        date_to=date_to,
        category=category,
        region=region,
    )
    items = await service.list_offers(filters)
    return [OfferResponse(**x.__dict__) for x in items]

@router.get("/{offer_id}", response_model=OfferResponse)
async def get_offer(
    offer_id: UUID,
    service: OfferService = Depends(get_offer_service),
):
    o = await service.get_offer(offer_id)
    if not o:
        raise HTTPException(status_code=404, detail="Offer not found")
    return OfferResponse(**o.__dict__)

@router.put("/{offer_id}", response_model=OfferResponse)
async def update_offer(
    offer_id: UUID,
    body: UpdateOfferRequest,
    service: OfferService = Depends(get_offer_service),
):
    dto = UpdateOfferDTO(**body.model_dump(exclude_unset=True))
    updated = await service.update_offer(offer_id, dto)
    if not updated:
        raise HTTPException(status_code=404, detail="Offer not found")
    return OfferResponse(**updated.__dict__)

@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_offer(
    offer_id: UUID,
    service: OfferService = Depends(get_offer_service),
):
    ok = await service.delete_offer(offer_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Offer not found")
    return None
