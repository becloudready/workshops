from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class NoticeCreate(BaseModel):
    title: str
    content: str
    author: Optional[str] = "Admin"


class NoticeResponse(BaseModel):
    id: str
    title: str
    content: str
    author: str
    created_at: datetime
