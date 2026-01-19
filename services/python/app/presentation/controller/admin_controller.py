from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from app.application.service.admin_service import AdminService
from app.infrastructure.container import get_admin_service, get_actor_dep

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/businesses/{user_id}/approve")
async def approve_business(user_id: UUID, svc: AdminService = Depends(get_admin_service), actor=Depends(get_actor_dep)):
    if actor.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")
    updated = await svc.approve_business(user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return {"status": "ok", "business_profile": updated.__dict__}

@router.post("/businesses/{user_id}/reject")
async def reject_business(user_id: UUID, svc: AdminService = Depends(get_admin_service), actor=Depends(get_actor_dep)):
    if actor.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")
    updated = await svc.reject_business(user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return {"status": "ok", "business_profile": updated.__dict__}
