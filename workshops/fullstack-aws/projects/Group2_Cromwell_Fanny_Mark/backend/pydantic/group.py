from pydantic import BaseModel


class GroupCreate(BaseModel):
    name: str
    manager_id: int


class GroupResponse(BaseModel):
    id: int
    name: str
    manager_id: int
    student_ids: list[int]
    task_ids: list[int]