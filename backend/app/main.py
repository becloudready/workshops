from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.notices import router as notices_router

app = FastAPI(title="Noticeboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notices_router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
