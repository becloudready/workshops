from pydantic import EmailStr

from app.schemas.base import CamelModel


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class TokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


class UserOut(CamelModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    cohort_id: int | None = None
