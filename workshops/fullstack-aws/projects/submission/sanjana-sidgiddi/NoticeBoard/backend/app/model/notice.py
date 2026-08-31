from datetime import date as Date

from pydantic import BaseModel, Field

'''
   Schema Structures for Notice Creation and Update
'''
class NoticeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=1000)
    author: str = Field(min_length=1, max_length=100)
    date: Date


class NoticeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=100)
    message: str | None = Field(default=None, min_length=1, max_length=1000)
    author: str | None = Field(default=None, min_length=1, max_length=100)
    date: Date | None = None