from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

class TransactionType(str, Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    PURCHASE = "purchase"
    TRANSFER = "transfer"

class WagerResult(str, Enum):
    WIN = "win"
    LOSS = "loss"
    PENDING = "pending"

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    type: TransactionType
    from_owner_id: UUID
    from_owner_account_number: int
    to_owner_id: UUID | None = None
    to_owner_account_number: int | None = None
    description: str | None = None
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    transaction_date: datetime = Field(default_factory=datetime.utcnow)
    category: str | None = None
    wager_result: WagerResult | None = None

class DepositTransaction(BaseModel):
    account_number: int
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    description: str | None = None
    category: str | None = None

class WithdrawalTransaction(BaseModel):
    account_number: int
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    description: str | None = None
    category: str | None = None

class TransferTransaction(BaseModel):
    from_account_number: int
    to_account_number: int
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    category: None = None

class FetchTransactions(BaseModel):
    user_id: int
    account_number: int

class defaultCategories(str, Enum):
    FOOD = "food"
    ENTERTAINMENT = "entertainment"
    UTILITIES = "utilities"
    TRANSPORTATION = "transportation"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    PERSONAL_CARE = "personal_care"
    MISCELLANEOUS = "miscellaneous"
