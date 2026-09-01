from models.user import User


class Admin(User):
    def __init__(
        self,
        email,
        owner_id=None,
        birthday=None,
        phone_number=None,
        first_name=None,
        last_name=None
    ):
        super().__init__(
            email,
            owner_id,
            birthday,
            phone_number,
            first_name,
            last_name
        )

    def get_role(self):
        return "Admin"