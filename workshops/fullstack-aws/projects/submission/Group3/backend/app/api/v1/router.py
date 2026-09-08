from fastapi import APIRouter

from app.api.v1 import (
    auth,
    manager_cohorts,
    manager_progress,
    manager_tasks,
    manager_trainees,
    student_tasks,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(manager_cohorts.router)
api_router.include_router(manager_trainees.router)
api_router.include_router(manager_tasks.router)
api_router.include_router(manager_tasks.subtask_router)
api_router.include_router(manager_progress.router)
api_router.include_router(student_tasks.router)
