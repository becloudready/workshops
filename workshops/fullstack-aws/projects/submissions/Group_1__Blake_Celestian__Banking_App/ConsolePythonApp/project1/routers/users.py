from datetime import date
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr


from database import SessionDep
from service import user_service

router = APIRouter()


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_admin: bool = False
    birthday: date
    phone_number: str
    first_name: str
    last_name: str

def user_to_dict(user):
    return {
        "id": str(user.get_owner_id()),
        "email": user.get_email(),
        "is_admin": user.get_role() == "Admin",
        "birthday": str(user.get_birthday()),
        "phone_number": user.get_phone_number(),
        "first_name": user.get_first_name(),
        "last_name": user.get_last_name()
    }


@router.get("")
def list_users(
    session: SessionDep
):
    users = user_service.get_all_users(session)

    return {
        "users": [
            user_to_dict(user)
            for user in users
        ]
    }


@router.get("/{user_id}")
def read_user(
    user_id: UUID,
    session: SessionDep
):
    try:
        user = user_service.get_user(
            session,
            user_id
        )

        return user_to_dict(user)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_user(
    user_request: UserCreate,
    session: SessionDep
):
    try:
        user = user_service.create_user(
            session,
            email=user_request.email,
            password=user_request.password,
            is_admin=user_request.is_admin,
            birthday=user_request.birthday,
            phone_number=user_request.phone_number,
            first_name=user_request.first_name,
            last_name=user_request.last_name
        )

        return user_to_dict(user)

    except ValueError as error:
        raise HTTPException(
            status_code=409,
            detail=str(error)
        )


@router.delete("/{user_id}")
def delete_user(
    user_id: UUID,
    session: SessionDep
):
    try:
        user_service.delete_user(
            session,
            user_id
        )

        return {
            "user_id": str(user_id),
            "deleted": True
        }

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )