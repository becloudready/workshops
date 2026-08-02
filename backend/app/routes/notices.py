from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone

from app.database import notices_collection
from app.models import NoticeCreate, NoticeResponse

router = APIRouter()


def _serialize_notice(doc: dict) -> NoticeResponse:
    return NoticeResponse(
        id=str(doc["_id"]),
        title=doc["title"],
        content=doc["content"],
        author=doc["author"],
        created_at=doc["created_at"],
    )


# --- User routes ---

@router.get("/notices", response_model=list[NoticeResponse], tags=["user"])
async def get_notices():
    """Return all notices for the public noticeboard."""
    docs = await notices_collection.find().sort("created_at", -1).to_list(length=None)
    return [_serialize_notice(d) for d in docs]


# --- Admin routes ---

@router.get("/admin/notices", response_model=list[NoticeResponse], tags=["admin"])
async def admin_get_notices():
    """Return all notices for the admin view."""
    docs = await notices_collection.find().sort("created_at", -1).to_list(length=None)
    return [_serialize_notice(d) for d in docs]


@router.post(
    "/admin/notices",
    response_model=NoticeResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["admin"],
)
async def admin_create_notice(notice: NoticeCreate):
    """Create a new notice."""
    doc = notice.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    result = await notices_collection.insert_one(doc)
    created = await notices_collection.find_one({"_id": result.inserted_id})
    return _serialize_notice(created)


@router.delete(
    "/admin/notices/{notice_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["admin"],
)
async def admin_delete_notice(notice_id: str):
    """Delete a notice by ID."""
    if not ObjectId.is_valid(notice_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid notice ID")
    result = await notices_collection.delete_one({"_id": ObjectId(notice_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notice not found")
