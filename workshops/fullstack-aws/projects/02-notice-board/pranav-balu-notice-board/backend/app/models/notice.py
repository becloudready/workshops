from pydantic import BaseModel, Field


class NoticeCreate(BaseModel):
    name: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)


class NoticeResponse(BaseModel):
    id: str
    name: str
    message: str