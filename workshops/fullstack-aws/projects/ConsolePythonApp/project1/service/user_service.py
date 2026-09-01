from datetime import date
from uuid import UUID

from sqlmodel import Session, select

from dto.user_db import UserDB
from models.admin import Admin
from models.customer import Customer
from security.password import hash_password, verify_password
from security.jwt import create_access_token


def db_user_to_domain(db_user):
    if db_user.is_admin:
        return Admin(
            email=db_user.email,
            owner_id=db_user.id,
            birthday=db_user.birthday,
            phone_number=db_user.phone_number,
            first_name=db_user.first_name,
            last_name=db_user.last_name,
        )

    return Customer(
        email=db_user.email,
        owner_id=db_user.id,
        birthday=db_user.birthday,
        phone_number=db_user.phone_number,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
    )


def get_all_users(session: Session):
    statement = select(UserDB)
    db_users = session.exec(statement).all()

    return [
        db_user_to_domain(user)
        for user in db_users
    ]


def get_user(
    session: Session,
    user_id: UUID
):
    db_user = session.get(UserDB, user_id)

    if db_user is None:
        raise ValueError("User not found")

    return db_user_to_domain(db_user)


def create_user(
    session: Session,
    email: str,
    password: str,
    is_admin: bool,
    birthday: date,
    phone_number: str,
    first_name: str,
    last_name: str,
):
    existing_user = session.exec(
        select(UserDB).where(UserDB.email == email)
    ).first()

    if existing_user is not None:
        raise ValueError("Email is already in use")

    db_user = UserDB(
        email=email,
        password_hash=hash_password(password),
        is_admin=is_admin,
        birthday=birthday,
        phone_number=phone_number,
        first_name=first_name,
        last_name=last_name,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user_to_domain(db_user)


def delete_user(
    session: Session,
    user_id: UUID
):
    db_user = session.get(UserDB, user_id)

    if db_user is None:
        raise ValueError("User not found")

    session.delete(db_user)
    session.commit()

    return True


def authenticate(
    session: Session,
    email: str,
    password: str,
):
    user = session.exec(
        select(UserDB).where(UserDB.email == email)
    ).first()

    if user is None:
        raise ValueError("Invalid email or password")

    if not verify_password(
        password,
        user.password_hash
    ):
        raise ValueError("Invalid email or password")

    token = create_access_token(
        user_id=str(user.id),
        is_admin=user.is_admin,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "is_admin": user.is_admin,
    }

def get_db_user(
    session: Session,
    user_id: UUID
):
    user = session.get(UserDB, user_id)

    if user is None:
        raise ValueError("User not found")

    return user