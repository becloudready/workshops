from pydantic import BaseModel, EmailStr


class ManagerCreate(BaseModel):
    name: str
    email: EmailStr


class ManagerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr