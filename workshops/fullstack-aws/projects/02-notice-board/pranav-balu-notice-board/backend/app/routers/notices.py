from fastapi import APIRouter, HTTPException, status

from app.models.notice import NoticeCreate, NoticeResponse
from app.repositories.notice_repository import NoticeRepository


router = APIRouter(
    prefix="/notices",
    tags=["Notices"]
)

repository = NoticeRepository()


@router.get(
    "",
    response_model=list[NoticeResponse]
)
def get_notices():
    return repository.get_all()


@router.post(
    "",
    response_model=NoticeResponse,
    status_code=status.HTTP_201_CREATED
)
def create_notice(notice: NoticeCreate):
    return repository.create(
        name=notice.name,
        message=notice.message
    )


@router.delete(
    "/{notice_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_notice(notice_id: str):
    deleted = repository.delete(notice_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notice not found"
        )