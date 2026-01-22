from fastapi import APIRouter, Depends, HTTPException, status
from app.presentation.responses.athlete_responses import AthleteProfileResponse
from app.application.service.athlete_service import AthleteService
from app.infrastructure.container import get_athlete_service, get_actor_dep

router = APIRouter(prefix="/athlete", tags=["athlete"])

@router.get("/profile", response_model=AthleteProfileResponse)
async def get_profile(
    actor=Depends(get_actor_dep),
    svc: AthleteService = Depends(get_athlete_service)
):
    """Get authenticated athlete's profile including total VAC points."""
    try:
        # Verify the user is an athlete
        if actor.role != "ATHLETE":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only athletes can access this endpoint"
            )
        
        profile = await svc.get_profile(actor.user_id)
        return AthleteProfileResponse(
            user_id=profile.user_id,
            total_vac_points=profile.total_vac_points,
            is_active=profile.is_active
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
