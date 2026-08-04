from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.mongodb import client, close_database
from app.routers.notices import router as notices_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify MongoDB connection on startup
    try:
        client.admin.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

    yield

    close_database()
    print("MongoDB connection closed")


app = FastAPI(
    title="Workshop API",
    description="FastAPI backend for the workshop application",
    version="1.0.0",
    lifespan=lifespan
)


app.include_router(notices_router)


@app.get("/")
def root():
    return {
        "message": "API is running"
    }