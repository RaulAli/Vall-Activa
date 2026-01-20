from fastapi import APIRouter, Depends, HTTPException, status
from app.presentation.requests.auth_requests import (
    RegisterAthleteRequest, RegisterBusinessRequest, RegisterAdminRequest, LoginRequest
)
from app.presentation.responses.auth_responses import TokenResponse, UserResponse
from app.application.service.auth_service import AuthService
from app.infrastructure.container import get_auth_service, get_password_hash_by_email_factory, get_actor_dep
from app.domain.dto.auth_dto import (
    RegisterAthleteDTO, RegisterBusinessDTO, RegisterAdminDTO, LoginDTO, BusinessDataDTO
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/athlete/register", response_model=TokenResponse)
async def register_athlete(req: RegisterAthleteRequest, svc: AuthService = Depends(get_auth_service)):
    try:
        dto = RegisterAthleteDTO(**req.model_dump())
        token, role = await svc.register_athlete(dto)
        return TokenResponse(access_token=token, role=role)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/business/register", response_model=TokenResponse)
async def register_business(req: RegisterBusinessRequest, svc: AuthService = Depends(get_auth_service)):
    try:
        # Pydantic model_dump can handle nested models
        business_data = BusinessDataDTO(**req.business.model_dump())
        dto = RegisterBusinessDTO(email=req.email, password=req.password, business=business_data)
        token, role = await svc.register_business(dto)
        return TokenResponse(access_token=token, role=role)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/admin/register", response_model=TokenResponse)
async def register_admin(req: RegisterAdminRequest, svc: AuthService = Depends(get_auth_service)):
    try:
        dto = RegisterAdminDTO(**req.model_dump())
        token, role = await svc.register_admin(dto)
        return TokenResponse(access_token=token, role=role)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, svc: AuthService = Depends(get_auth_service), 
                get_password_hash_by_email = Depends(get_password_hash_by_email_factory)):
    try:
        dto = LoginDTO(**req.model_dump())
        token, role = await svc.login(dto, get_password_hash_by_email)
        return TokenResponse(access_token=token, role=role)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_me(actor=Depends(get_actor_dep)):
    return UserResponse(id=actor.user_id, email=actor.email, role=actor.role)
