from fastapi import APIRouter, HTTPException

from database import SessionDep
from dto.login_request import LoginRequest
from service import user_service

router = APIRouter()


@router.post("")
def login(
    request: LoginRequest,
    session: SessionDep
):
    try:
        return user_service.authenticate(
            session,
            request.email,
            request.password
        )

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error)
        )