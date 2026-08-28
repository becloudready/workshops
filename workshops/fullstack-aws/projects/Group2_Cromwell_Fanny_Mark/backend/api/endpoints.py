from fastapi import APIRouter, HTTPException

from model import Manager, Student, Group, Task


router = APIRouter()


# =========================
# MANAGERS
# =========================

managers = []
manager_id = 1


@router.post("/managers", response_model=Manager)
def create_manager(manager: Manager):

    global manager_id

    new_manager = Manager(
        id=manager_id,
        name=manager.name,
        email=manager.email
    )

    managers.append(new_manager)
    manager_id += 1

    return new_manager


@router.get("/managers", response_model=list[Manager])
def get_managers():
    return managers


@router.get("/managers/{id}", response_model=Manager)
def get_manager(id: int):

    for manager in managers:
        if manager.id == id:
            return manager

    raise HTTPException(
        status_code=404,
        detail="Manager not found"
    )


@router.delete("/managers/{id}")
def delete_manager(id: int):

    for manager in managers:
        if manager.id == id:
            managers.remove(manager)

            return {"message": "Manager deleted"}

    raise HTTPException(
        status_code=404,
        detail="Manager not found"
    )


# =========================
# STUDENTS
# =========================

students = []
student_id = 1


@router.post("/students", response_model=Student)
def create_student(student: Student):

    global student_id

    new_student = Student(
        id=student_id,
        name=student.name,
        email=student.email
    )

    students.append(new_student)
    student_id += 1

    return new_student


@router.get("/students", response_model=list[Student])
def get_students():
    return students


@router.get("/students/{id}", response_model=Student)
def get_student(id: int):

    for student in students:
        if student.id == id:
            return student

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


@router.delete("/students/{id}")
def delete_student(id: int):

    for student in students:
        if student.id == id:
            students.remove(student)

            return {"message": "Student deleted"}

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


# =========================
# GROUPS
# =========================

groups = []
group_id = 1


@router.post("/groups", response_model=Group)
def create_group(group: Group):

    global group_id

    new_group = Group(
        id=group_id,
        name=group.name,
        manager_id=group.manager_id
    )

    groups.append(new_group)
    group_id += 1

    return new_group


@router.get("/groups", response_model=list[Group])
def get_groups():
    return groups


@router.get("/groups/{id}", response_model=Group)
def get_group(id: int):

    for group in groups:
        if group.id == id:
            return group

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


@router.delete("/groups/{id}")
def delete_group(id: int):

    for group in groups:
        if group.id == id:
            groups.remove(group)

            return {"message": "Group deleted"}

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


# Add student to group
@router.post("/groups/{group_id}/students/{student_id}")
def add_student_to_group(
    group_id: int,
    student_id: int
):

    for group in groups:

        if group.id == group_id:

            for student in students:

                if student.id == student_id:

                    if student_id not in group.student_ids:
                        group.student_ids.append(student_id)

                    return group

            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


# Get students in group
@router.get("/groups/{group_id}/students")
def get_group_students(group_id: int):

    for group in groups:

        if group.id == group_id:
            return group.student_ids

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


# =========================
# TASKS
# =========================

tasks = []
task_id = 1


@router.post("/groups/{group_id}/tasks", response_model=Task)
def create_task(
    group_id: int,
    task: Task
):

    global task_id

    for group in groups:

        if group.id == group_id:

            new_task = Task(
                id=task_id,
                title=task.title,
                description=task.description,
                group_id=group_id
            )

            tasks.append(new_task)
            group.task_ids.append(task_id)

            task_id += 1

            return new_task

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


@router.get("/groups/{group_id}/tasks")
def get_group_tasks(group_id: int):

    for group in groups:

        if group.id == group_id:

            return [
                task
                for task in tasks
                if task.group_id == group_id
            ]

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


@router.get("/tasks/{id}", response_model=Task)
def get_task(id: int):

    for task in tasks:

        if task.id == id:
            return task

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )


@router.delete("/tasks/{id}")
def delete_task(id: int):

    for task in tasks:

        if task.id == id:

            tasks.remove(task)

            return {"message": "Task deleted"}

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )