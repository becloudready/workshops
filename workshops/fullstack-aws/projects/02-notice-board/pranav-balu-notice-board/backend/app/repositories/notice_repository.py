from bson import ObjectId
from app.database.mongodb import get_database


class NoticeRepository:

    def __init__(self):
        self.collection = get_database()["notices"]

    def get_all(self):
        notices = self.collection.find()

        return [
            {
                "id": str(notice["_id"]),
                "name": notice["name"],
                "message": notice["message"],
            }
            for notice in notices
        ]

    def create(self, name: str, message: str):
        notice = {
            "name": name,
            "message": message,
        }

        result = self.collection.insert_one(notice)

        return {
            "id": str(result.inserted_id),
            "name": name,
            "message": message,
        }

    def delete(self, notice_id: str) -> bool:
        if not ObjectId.is_valid(notice_id):
            return False

        result = self.collection.delete_one(
            {"_id": ObjectId(notice_id)}
        )

        return result.deleted_count > 0