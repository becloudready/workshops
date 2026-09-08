from models.user import User
from models.CheckingAccount import CheckingAccount
from models.SavingsAccount import SavingsAccount


class Customer(User):
    def __init__(self, email, owner_id, birthday, phone_number, first_name, last_name):
        super().__init__(email, owner_id, birthday, phone_number, first_name, last_name)

        self._accounts = {
            "Checking": {},
            "Savings": {}
        }

    def get_role(self):
        return "Customer"

    def create_account(self, pin, account_type, balance=0):
        if not self.check_pin(pin):
            raise ValueError("Invalid PIN")

        if account_type == "Checking":
            account = CheckingAccount(
                balance,
                self._owner_id
            )

        elif account_type == "Savings":
            account = SavingsAccount(
                balance,
                self._owner_id
            )

        else:
            raise ValueError("Invalid account type")

        account_number = account.get_account_number()

        self._accounts[account_type][account_number] = account

        return account

    def get_accounts(self, pin):
        if not self.check_pin(pin):
            raise ValueError("Invalid PIN")

        return self._accounts