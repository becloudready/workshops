class Manager:
    id: int
    name: str
    email: str

class Student:
    id: int
    name: str
    email: str

class Group:
    id: int
    name: str
    manager_id: int
    student_ids: list[int]
    task_ids: list[int]

class Task:
    id: int
    title: str
    description: str
    group_id: int