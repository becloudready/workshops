import enum


class UserRole(str, enum.Enum):
    trainee = "trainee"
    manager = "manager"
    hr = "hr"


class UrgencyLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"
