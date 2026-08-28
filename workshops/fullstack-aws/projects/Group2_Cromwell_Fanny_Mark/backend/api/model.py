from pydantic import BaseModel, EmailStr


class Manager(BaseModel):
    id: int
    name: str
    email: EmailStr


class Student(BaseModel):
    id: int
    name: str
    email: EmailStr


class Group(BaseModel):
    id: int
    name: str
    manager_id: int
    student_ids: list[int] = []
    task_ids: list[int] = []


class Task(BaseModel):
    id: int
    title: str
    description: str
    group_id: int