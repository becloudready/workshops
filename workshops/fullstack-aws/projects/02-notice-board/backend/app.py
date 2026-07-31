from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.notice_routes import noticeRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = "/api/v1"

app.include_router(noticeRouter, prefix=f"{api_prefix}/notices")