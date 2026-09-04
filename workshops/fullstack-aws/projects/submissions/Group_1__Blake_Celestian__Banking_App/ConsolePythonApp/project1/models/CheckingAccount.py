from models.account import Account
class CheckingAccount(Account):
    def __init__(self, balance=0, owner_id=None):
        super().__init__("Checking", balance, owner_id)

    #instead of calling super here we override the withdraw method to allow overdraft
    def withdraw(self, amount):
        if amount > 0:
            self._balance -= amount
            return True
        return False

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False