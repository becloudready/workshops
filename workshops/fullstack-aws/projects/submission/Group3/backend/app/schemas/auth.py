from pydantic import EmailStr, Field

from app.schemas.base import CamelModel


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class ProfileUpdate(CamelModel):
    full_name: str | None = None
    email: EmailStr | None = None
    current_password: str | None = None
    new_password: str | None = Field(default=None, min_length=8)


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
