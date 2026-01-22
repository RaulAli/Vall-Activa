from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.presentation.controller.route_controller import router as route_router
from app.presentation.controller.route_gpx_controller import router as route_gpx_router
from app.presentation.controller.route_track_controller import router as route_track_router
from app.presentation.controller.business_controller import router as business_router
from app.presentation.controller.offer_controller import router as offer_router
from app.presentation.controller.auth_controller import router as auth_router
from app.presentation.controller.admin_controller import router as admin_router
from app.presentation.controller.athlete_controller import router as athlete_router


app = FastAPI(title="FastAPI Clean Architecture CRUD")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(route_router)

app.include_router(route_gpx_router)

app.include_router(route_track_router)

app.include_router(business_router)

app.include_router(offer_router)

app.include_router(auth_router)

app.include_router(admin_router)

app.include_router(athlete_router)
