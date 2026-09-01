from sqlmodel import Session, select
from models.account_model import AccountRecord

def get_user_account_by_number(session: Session, user_id, account_num: int):
    statement = select(AccountRecord).where(
        AccountRecord.account_number == account_num,
        AccountRecord.owner_id == str(user_id)
    )

    return session.exec(statement).first()

def get_account_by_number(session: Session, account_num: int):
    statement = select(AccountRecord).where(
        AccountRecord.account_number == account_num
    )
    return session.exec(statement).first()
