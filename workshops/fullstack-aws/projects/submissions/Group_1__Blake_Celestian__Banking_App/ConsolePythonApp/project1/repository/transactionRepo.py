from models.transaction import Transaction
from sqlmodel import Session, select
from sqlalchemy import or_
from uuid import UUID
from datetime import datetime, timezone

def save_transaction(session: Session, transaction: Transaction):
    session.add(transaction)
    return transaction

def get_transactions(session: Session, owner_id: UUID, is_admin=False):
    statement = select(Transaction)
    if not is_admin:
        statement = statement.where(
            or_(Transaction.from_owner_id == owner_id, Transaction.to_owner_id == owner_id)
        )
    return session.exec(statement).all()

def get_withdrawals(session: Session, owner_id: UUID):
    now = datetime.now(timezone.utc)

    start_of_month = datetime(
        now.year,
        now.month,
        1,
        tzinfo=timezone.utc
    )

    if now.month == 12:
        start_of_next_month = datetime(
            now.year + 1,
            1,
            1,
            tzinfo=timezone.utc
        )
    else:
        start_of_next_month = datetime(
            now.year,
            now.month + 1,
            1,
            tzinfo=timezone.utc
        )

    statement = select(Transaction).where(
        Transaction.from_owner_id == owner_id,
        Transaction.transaction_date >= start_of_month,
        Transaction.transaction_date < start_of_next_month,
    )
    return session.exec(statement).all()