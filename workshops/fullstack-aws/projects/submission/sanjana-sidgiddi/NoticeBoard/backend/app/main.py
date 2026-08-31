from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.router.notice_router import router as notice_router

'''
    Main Application Entry Point
'''
app = FastAPI(title="Notice Board API")

'''
    Configure CORS Middleware for Cross-Origin Requests
'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
    Include Notice Router for Notice Management Endpoints
'''
app.include_router(notice_router)

'''
    Root Endpoint for Health Check
'''
@app.get("/")
def root():
    return {"message": "Notice Board API is running"}