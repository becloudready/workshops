from abc import ABC, abstractmethod


class User(ABC):
    def __init__(
        self,
        email,
        owner_id=None,
        birthday=None,
        phone_number=None,
        first_name=None,
        last_name=None
    ):
        self._email = email
        self._owner_id = owner_id
        self._birthday = birthday
        self._phone_number = phone_number
        self._first_name = first_name
        self._last_name = last_name

    def get_owner_id(self):
        return self._owner_id

    def get_email(self):
        return self._email

    def get_birthday(self):
        return self._birthday

    def get_phone_number(self):
        return self._phone_number

    def get_first_name(self):
        return self._first_name

    def get_last_name(self):
        return self._last_name

    @abstractmethod
    def get_role(self):
        pass