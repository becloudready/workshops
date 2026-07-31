from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.notice_services import *

noticeRouter = APIRouter(tags=["Notices"])

@noticeRouter.get("/")
def get_all_notices():
    notices = getNoticesDB()

    return JSONResponse(
        status_code=200,
        content=notices
    )