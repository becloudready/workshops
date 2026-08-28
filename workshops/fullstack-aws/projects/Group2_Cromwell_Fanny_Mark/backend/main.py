from fastapi import FastAPI

from routes.notices import router as notice_router

app = FastAPI(
    title="NoticeBoardTracker API",
    version="1.0.0"
)

app.include_router(notice_router)


@app.get("/")
def root():
    return {
        "message": "NoticeBoardTracker API"
    }