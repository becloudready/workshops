from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ProfileUpdate


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)

    def authenticate(self, email: str, password: str) -> User | None:
        user = self.users.get_by_email(email)
        if user is None or not verify_password(password, user.hashed_password):
            return None
        return user

    def issue_token(self, user: User) -> str:
        return create_access_token(subject=user.id, role=user.role.value)

    def update_profile(self, user: User, payload: ProfileUpdate) -> User:
        if payload.email and payload.email != user.email:
            existing = self.users.get_by_email(payload.email)
            if existing is not None and existing.id != user.id:
                raise ValueError("Email is already in use")
            user.email = payload.email

        if payload.full_name:
            user.full_name = payload.full_name

        if payload.new_password:
            if not payload.current_password or not verify_password(
                payload.current_password, user.hashed_password
            ):
                raise ValueError("Current password is incorrect")
            user.hashed_password = hash_password(payload.new_password)

        self.db.commit()
        self.db.refresh(user)
        return user
