from datetime import date
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class UserDB(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=320)
    password_hash: str
    is_admin: bool = False
    birthday: date
    phone_number: str
    first_name: str
    last_name: str