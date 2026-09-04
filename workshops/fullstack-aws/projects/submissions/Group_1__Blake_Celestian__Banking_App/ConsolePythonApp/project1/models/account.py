import random

class Account:
    def __init__(self, account_type, balance=0, owner_id=None):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        if owner_id is not None and owner_id <= 0:
            raise ValueError("Owner ID must be positive")
        self._balance = balance
        self._account_type = account_type
        self._owner_id = owner_id
        self._account_number = random.randint(10000000, 99999999)

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False

    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False

    def get_balance(self):
        return self._balance
    
    def get_account_number(self):
        return self._account_number

    def get_owner_id(self):
        return self._owner_id

    def get_account_type(self):
        return self._account_type