from fastapi import APIRouter, HTTPException

from app.model.notice import NoticeCreate, NoticeUpdate
from app.service.notice_service import (
    create_notice,
    get_all_notices,
    get_notice_by_id,
    replace_notice,
    update_notice,
    delete_notice,
)
'''
    Router for Notice Management Endpoints
'''
router = APIRouter(
    prefix="/notices",
    tags=["Notices"]
)

'''
    POST /notices: Create a New Notice
'''
@router.post("/")
def create_new_notice(notice: NoticeCreate):
    return create_notice(notice)

'''
    GET /notices: Retrieve All Notices
'''
@router.get("/")
def get_notices():
    return get_all_notices()

'''
    GET /notices/{notice_id}: Retrieve a Notice by its ID
'''
@router.get("/{notice_id}")
def get_notice(notice_id: str):
    notice = get_notice_by_id(notice_id)

    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")

    return notice

'''
    PUT /notices/{notice_id}: Replace an Existing Notice by its ID
'''
@router.put("/{notice_id}")
def replace_existing_notice(notice_id: str, notice: NoticeCreate):
    updated_notice = replace_notice(notice_id, notice)

    if not updated_notice:
        raise HTTPException(status_code=404, detail="Notice not found")

    return updated_notice

'''
    PATCH /notices/{notice_id}: Update Specific Fields of an Existing Notice by its ID
'''
@router.patch("/{notice_id}")
def update_existing_notice(notice_id: str, notice: NoticeUpdate):
    updated_notice = update_notice(notice_id, notice)

    if not updated_notice:
        raise HTTPException(status_code=404, detail="Notice not found")

    return updated_notice

'''
    DELETE /notices/{notice_id}: Delete a Notice by its ID
'''
@router.delete("/{notice_id}")
def delete_existing_notice(notice_id: str):
    deleted = delete_notice(notice_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Notice not found")

    return {"message": "Notice deleted successfully"}