from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from uuid import UUID

security = HTTPBearer(auto_error=False)

class Actor:
    def __init__(self, user_id: UUID, role: str, email: str):
        self.user_id = user_id
        self.role = role
        self.email = email

def get_actor(jwt_secret: str):
    async def _dep(creds: HTTPAuthorizationCredentials = Depends(security)) -> Actor:
        if not creds:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            payload = jwt.decode(creds.credentials, jwt_secret, algorithms=["HS256"])
            return Actor(UUID(payload["sub"]), payload["role"], payload.get("email", ""))
        except (JWTError, KeyError, ValueError):
            raise HTTPException(status_code=401, detail="Invalid token")
    return _dep

def require_roles(*allowed: str):
    def _guard(actor: Actor = Depends(lambda: None)):
        # este guard lo inyectaremos ya “resuelto” desde container para no liarla aquí
        return actor
    return _guard
