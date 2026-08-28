from datetime import date
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from database import SessionDep
from service import account_service
from service.user_service import get_db_user

router = APIRouter()

#used to tell pydantic that we can only recieve checking or savings as account type
AccountType = Literal["Checking", "Savings"]

#this class is used to define the structure and validation rules of the data our api will recieve when creating accounts
from decimal import Decimal
class AccountCreate(BaseModel):
    owner_id: UUID
    account_type: AccountType
    amount: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=12, decimal_places=2)

class AccountStatusUpdate(BaseModel):
    is_active: bool

#converts an account object to a dictionary so we can return it as a json
def account_to_dict(account):
    return {
        "account_number": account.account_number,
        "owner_id": account.owner_id,
        "balance": account.balance,
        "account_type": account.account_type,
        "created_date": account.created_date,
        "is_active": account.is_active,
        "closed_date": account.closed_date,
    }

#this can eitherbe used to get all acounts or just the accounts that have a specific owner id
@router.get("")
def list_accounts(
    session: SessionDep,
    requester_id: UUID = Query(...),
    owner_id: UUID | None = Query(default=None)
):
    try:
        requester = get_db_user(session, requester_id)
        if not requester.is_admin:
            if owner_id is not None and owner_id != requester_id:
                raise HTTPException(status_code=403, detail="Customers can only see their own accounts")
            owner_id = requester_id
        accounts = account_service.get_accounts(session, str(owner_id) if owner_id is not None else None)

        return {
            "accounts": [
                account_to_dict(account)
                for account in accounts
            ]
        }

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

#gets a specific account using the account number
@router.get("/{account_number}")
def read_account(account_number: int, session: SessionDep):
    try:
        account = account_service.get_account(
            session,
            account_number
        )

        return account_to_dict(account)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

#this is used for account creation
@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_account(
    account_request: AccountCreate,
    session: SessionDep,
    requester_id: UUID = Query(...)
):
    try:
        requester = get_db_user(session, requester_id)
        if requester.is_admin or account_request.owner_id != requester_id:
            raise HTTPException(status_code=403, detail="Only customers can create their own accounts")
        account = account_service.create_account(
            session=session,
            owner_id=str(account_request.owner_id),
            account_type=account_request.account_type,
            balance=float(account_request.amount)
        )

        return account_to_dict(account)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.delete("/{account_number}")
def delete_account(account_number: int, session: SessionDep):
    try:
        account_service.delete_account(
            session,
            account_number
        )

        return {
            "account_number": account_number,
            "deleted": True
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@router.patch("/{account_number}/status")
def update_account_status(
    account_number: int,
    status_request: AccountStatusUpdate,
    session: SessionDep,
    requester_id: UUID = Query(...)
):
    try:
        requester = get_db_user(session, requester_id)
        if not requester.is_admin:
            raise HTTPException(status_code=403, detail="Only admins can update account status")
        account = account_service.get_account(session, account_number)
        account.is_active = status_request.is_active
        account.closed_date = None if status_request.is_active else date.today()
        session.add(account)
        session.commit()
        session.refresh(account)
        return account_to_dict(account)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
