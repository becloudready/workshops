from pydantic import BaseModel, EmailStr, BeforeValidator, Field
# from typing import Optional, List
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class ManagerIn(BaseModel):
    name: str
    email: EmailStr


class ManagerOut(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    email: EmailStr


class StudentIn(BaseModel):
    name: str
    email: EmailStr


class StudentOut(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    email: EmailStr


class GroupIn(BaseModel):
    name: str
    manager_id: int
    student_ids: list[PyObjectId] = []
    task_ids: list[PyObjectId] = []


class GroupOut(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    manager_id: int
    student_ids: list[PyObjectId] = []
    task_ids: list[PyObjectId] = []


class TaskIn(BaseModel):
    title: str
    description: str


class TaskOut(BaseModel):
    id: PyObjectId = Field(alias="_id")
    title: str
    description: str
