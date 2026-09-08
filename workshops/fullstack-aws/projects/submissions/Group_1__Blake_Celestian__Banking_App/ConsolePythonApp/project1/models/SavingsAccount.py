from models.account import Account


class SavingsAccount(Account):

    def __init__(self, balance=0, owner_id=None, saving_period=1, interest_rate=0.02, minimum_balance=2000):
        super().__init__("Savings", balance, owner_id)

    def deposit(self, amount):
        return super().deposit(amount)
    
    def withdraw(self, amount):
        return super().withdraw(amount)
    