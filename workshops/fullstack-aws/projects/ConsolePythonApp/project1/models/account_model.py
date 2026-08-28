#sqlmodel is base class used to define database
#field is used to configure individual columns of the table
from datetime import date
import random

from sqlmodel import Field, SQLModel

#this class is used to represent the overall databse table structure, shows us what each row will contain
class AccountRecord(SQLModel, table=True):
    account_number: int = Field(
        default_factory=lambda: random.randint(10000000, 99999999),
        primary_key=True
    )
    owner_id: str = Field(index=True)
    account_type: str
    balance: float = Field(default=0)
    created_date: date = Field(default_factory=date.today)
    is_active: bool = True
    closed_date: date | None = None
    overdraft_fee_cents: int = Field(default=35, ge=0)

    def get_balance(self) -> float:
        return self.balance
