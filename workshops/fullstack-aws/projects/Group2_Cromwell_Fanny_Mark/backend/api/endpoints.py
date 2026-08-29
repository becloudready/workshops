from fastapi import APIRouter, HTTPException
from .model import ManagerIn, ManagerOut, StudentIn, StudentOut, GroupIn, GroupOut, TaskIn, TaskOut
from bson import ObjectId
from database import managers, students, groups, tasks

router = APIRouter()


# =========================
# MANAGERS
# =========================

@router.post("/managers", response_model=ManagerOut)
def create_manager(manager: ManagerIn):
    new_manager = manager.model_dump()
    result = managers.insert_one(new_manager)
    new_manager["id"] = result.inserted_id

    return new_manager


@router.get("/managers", response_model=list[ManagerOut])
def get_managers():
    managersList = managers.find().to_list()
    return managersList


@router.get("/managers/{id}", response_model=ManagerOut)
def get_manager(id: str):
    manager = managers.find_one({"_id": ObjectId(id)})
    if manager is not None:
        return manager

    raise HTTPException(
        status_code=404,
        detail="Manager not found"
    )


@router.delete("/managers/{id}")
def delete_manager(id: str):
    result = managers.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Manager deleted"}

    raise HTTPException(
        status_code=404,
        detail="Manager not found"
    )


# =========================
# STUDENTS
# =========================

@router.post("/students", response_model=StudentOut)
def create_student(student: StudentIn):
    new_student = student.model_dump()
    result = students.insert_one(new_student)
    new_student["id"] = result.inserted_id

    return new_student


@router.get("/students", response_model=list[StudentOut])
def get_students():
    students_list = students.find().to_list()

    if not students_list:
        raise HTTPException(
            status_code=404,
            detail="No students found"
        )

    return students_list


@router.get("/students/{id}", response_model=StudentOut)
def get_student(id: str):
    student = students.find_one({"_id": ObjectId(id)})

    if student is not None:
        return student

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


@router.delete("/students/{id}")
def delete_student(id: str):
    result = students.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 1:
        return {"message": "Student deleted"}

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


# =========================
# GROUPS
# =========================

@router.post("/groups", response_model=GroupOut)
def create_group(group: GroupIn):
    new_group = group.model_dump()
    result = groups.insert_one(new_group)
    new_group["id"] = result.inserted_id

    return new_group


@router.get("/groups", response_model=list[GroupOut])
def get_groups():
    groups_list = groups.find().to_list()

    if not groups_list:
        raise HTTPException(
            status_code=404,
            detail="No groups found"
        )

    return groups_list


@router.get("/groups/{id}", response_model=GroupOut)
def get_group(id: str):
    group = groups.find_one({"_id": ObjectId(id)})

    if group is not None:
        return group

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


@router.delete("/groups/{id}")
def delete_group(id: str):
    result = groups.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 1:
        return {"message": "Group deleted"}

    raise HTTPException(
        status_code=404,
        detail="Group not found"
    )


# =========================
# TASKS
# =========================

@router.post("/tasks", response_model=TaskOut)
def create_task(task: TaskIn):
    new_task = task.model_dump()
    result = tasks.insert_one(new_task)
    new_task["id"] = result.inserted_id

    return new_task


@router.get("/tasks", response_model=list[TaskOut])
def get_tasks():
    tasks_list = tasks.find().to_list()

    if not tasks_list:
        raise HTTPException(
            status_code=404,
            detail="No tasks found"
        )

    return tasks_list


@router.get("/tasks/{id}", response_model=TaskOut)
def get_task(id: str):
    task = tasks.find_one({"_id": ObjectId(id)})

    if task is not None:
        return task

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )


@router.delete("/tasks/{id}")
def delete_task(id: str):
    result = tasks.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 1:
        return {"message": "Task deleted"}

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )

# Add student to group


@router.post("/groups/{group_id}/students/{student_id}")
def add_student_to_group(
    group_id: str,
    student_id: str
):
    group = groups.find_one({"_id": ObjectId(group_id)})
    student = students.find_one({"_id": ObjectId(student_id)})

    if group is None:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    res = groups.update_one(
        {"_id": ObjectId(group_id)},
        {"$addToSet": {"student_ids": ObjectId(student_id)}}
    )

    if res is not None:
        return {"message": f"Student {student_id} added to group {group_id}"}


# Get students in group


@router.get("/groups/{group_id}/students", response_model=list[StudentOut])
def get_group_students(group_id: str):
    group = groups.find_one({"_id": ObjectId(group_id)})
    if group is None:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    studentsOut = []
    for student_id in group["student_ids"]:
        studentsOut.append(students.find_one({"_id": ObjectId(student_id)}))

    return studentsOut


@router.post("/groups/{group_id}/tasks", response_model=TaskOut)
def create_task(group_id: str, task: TaskIn):
    group = groups.find_one({"_id": ObjectId(group_id)})

    if group is None:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    new_task = task.model_dump()
    new_task["group_id"] = ObjectId(group_id)

    result = tasks.insert_one(new_task)

    new_task["id"] = result.inserted_id

    groups.update_one(
        {"_id": ObjectId(group_id)},
        {"$addToSet": {"task_ids": result.inserted_id}}
    )

    return new_task


@router.get("/groups/{group_id}/tasks", response_model=list[TaskOut])
def get_group_tasks(group_id: str):
    group = groups.find_one({"_id": ObjectId(group_id)})
    if group is None:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    tasksOut = []
    for task_id in group["task_ids"]:
        tasksOut.append(tasks.find_one({"_id": ObjectId(task_id)}))

    return tasksOut
