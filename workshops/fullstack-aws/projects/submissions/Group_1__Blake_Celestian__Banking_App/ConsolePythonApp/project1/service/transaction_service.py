from models.transaction import FetchTransactions, defaultCategories

from sqlmodel import Session
from uuid import UUID

from models.transaction import DepositTransaction, Transaction, TransactionType, TransferTransaction, WithdrawalTransaction, defaultCategories, WagerResult
from repository.accountsRepo import get_account_by_number, get_user_account_by_number
from repository.transactionRepo import get_transactions, save_transaction, get_withdrawals


def deposit(session: Session, request: DepositTransaction, owner_id):
    account = get_user_account_by_number(session, owner_id, request.account_number)
    if account is None:
        raise ValueError("Account does not exist")
    account.balance += float(request.amount)
    save_transaction(session, Transaction(
        type=TransactionType.DEPOSIT, from_owner_id=owner_id,
        from_owner_account_number=request.account_number,
        description=None, category=None, amount=request.amount,
    ))
    session.commit()
    session.refresh(account)
    return account


def withdrawal(session: Session, request: WithdrawalTransaction, owner_id, transaction_type=TransactionType.WITHDRAWAL):
    account = get_user_account_by_number(session, owner_id, request.account_number)
    if account is None:
        raise ValueError("Account does not exist")
    amount = float(request.amount)
    current = account.balance
    if account.account_type != "Checking" and amount > current:
        raise ValueError("Insufficient funds")
    if account.account_type == "Checking" and current - amount < -50000:
        raise ValueError("Overdraft limit exceeded")
    account.balance = current - amount
    save_transaction(session, Transaction(
        type=transaction_type, from_owner_id=owner_id,
        from_owner_account_number=request.account_number,
        description=request.description, category=request.category, amount=request.amount,
    ))
    session.commit()
    session.refresh(account)
    return account


def transfer(session: Session, request: TransferTransaction, owner_id):
    try:
        source = get_user_account_by_number(session, owner_id, request.from_account_number)
        target = get_account_by_number(session, request.to_account_number)
        if source is None or target is None:
            raise ValueError("Account does not exist or is not owned by the specified user")
        amount = float(request.amount)
        if amount > source.balance:
            raise ValueError("Insufficient funds")
        source.balance -= amount
        target.balance += amount
        save_transaction(session, Transaction(
            type=TransactionType.TRANSFER, from_owner_id=owner_id,
            from_owner_account_number=request.from_account_number,
            to_owner_id=target.owner_id, to_owner_account_number=request.to_account_number,
            description=None, category=None, amount=request.amount,
        ))
        session.commit()
    except Exception:
        session.rollback()
        raise

def fetchTransactionCategories(session: Session, owner_id: UUID):
    # TODO: support custom categories in the future
    return list(defaultCategories)


def fetch_transactions(session: Session, owner_id: UUID, is_admin=False):
    return get_transactions(session, owner_id, is_admin)


def update_transaction_category(session: Session, transaction_id: int, category: str | None, owner_id: UUID):
    transaction = session.get(Transaction, transaction_id)
    if transaction is None:
        raise ValueError("Transaction not found")
    if transaction.from_owner_id != owner_id and transaction.to_owner_id != owner_id:
        raise ValueError("You do not have permission to update this transaction")
    transaction.category = category
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction

def create_wager(session: Session, transaction_id: int, owner_id: UUID):
    transaction = session.get(Transaction, transaction_id)
    if transaction is None or (transaction.from_owner_id != owner_id and transaction.to_owner_id != owner_id):
        raise ValueError("Transaction not found")
    if transaction.type != TransactionType.PURCHASE:
        raise ValueError("Wagers can only be created for purchase transactions")
    if transaction.wager_result is not None:
        raise ValueError("Wager has already been created for this transaction")

    # TODO: add usage limits
    random = __import__('random').random()
    wager_result = WagerResult.WIN if random > 0.5 else WagerResult.LOSS
    transaction.wager_result = wager_result
    # Update the account balance based on the wager result
    account = get_user_account_by_number(session, owner_id, transaction.from_owner_account_number)
    if wager_result == WagerResult.WIN:
        account.balance += float(transaction.amount)
    else:
        account.balance -= float(transaction.amount)

    session.add(transaction)
    session.add(account)
    session.commit()

    # return wager result and updated account balance
    return {"message": "Wager created successfully", "wager_result": wager_result, "updated_balance": account.balance}


def fetch_withdrawals(session: Session, owner_id: UUID):
    return get_withdrawals(session, owner_id)


