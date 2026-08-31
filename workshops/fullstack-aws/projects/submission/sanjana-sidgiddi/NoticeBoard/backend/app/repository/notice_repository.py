from bson import ObjectId
from app.mongo_db import notices_collection

'''
    Serialized Notice IDs in MongoDB
'''
def serialize_notice(notice):
    if notice:
        notice["_id"] = str(notice["_id"])
    return notice

'''
    Insert a New Notice into the MongoDB Collection
'''
def insert_notice(notice_data: dict):
    result = notices_collection.insert_one(notice_data)

    notice = notices_collection.find_one(
        {"_id": result.inserted_id}
    )

    return serialize_notice(notice)

'''
    Retrieve All Notices from the MongoDB Collection
'''
def find_all_notices():
    notices = notices_collection.find()

    return [
        serialize_notice(notice)
        for notice in notices
    ]

'''
    Search for a Notice by its ID in the MongoDB Collection
'''
def find_notice_by_id(notice_id: str):
    if not ObjectId.is_valid(notice_id):
        return None

    notice = notices_collection.find_one(
        {"_id": ObjectId(notice_id)}
    )

    return serialize_notice(notice)

'''
    Replace all fields of a Notice by its ID in the MongoDB Collection
'''
def replace_notice_by_id(notice_id: str, notice_data: dict):
    if not ObjectId.is_valid(notice_id):
        return None

    result = notices_collection.replace_one(
        {"_id": ObjectId(notice_id)},
        notice_data
    )

    if result.matched_count == 0:
        return None

    notice = notices_collection.find_one(
        {"_id": ObjectId(notice_id)}
    )

    return serialize_notice(notice)

'''
    Modify specific fields of a Notice by its ID in the MongoDB Collection
'''
def update_notice_by_id(notice_id: str, update_data: dict):
    if not ObjectId.is_valid(notice_id):
        return None

    result = notices_collection.update_one(
        {"_id": ObjectId(notice_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return None

    notice = notices_collection.find_one(
        {"_id": ObjectId(notice_id)}
    )

    return serialize_notice(notice)

'''
    Delete a Notice by its ID from the MongoDB Collection
'''
def delete_notice_by_id(notice_id: str):
    if not ObjectId.is_valid(notice_id):
        return False

    result = notices_collection.delete_one(
        {"_id": ObjectId(notice_id)}
    )

    return result.deleted_count == 1