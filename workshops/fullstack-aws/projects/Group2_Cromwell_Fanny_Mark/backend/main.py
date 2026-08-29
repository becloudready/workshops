from fastapi import FastAPI
from api.endpoints import router


app = FastAPI(
    title="NoticeBoardTracker API",
    description="API for managing managers, students, groups, and tasks",
    version="1.0.0"
)


app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "NoticeBoardTracker API is running"
    }
