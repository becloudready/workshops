from pymongo import MongoClient
from app.core.config import settings


client = MongoClient(settings.mongo_uri)

database = client[settings.MONGO_DATABASE]


def get_database():
    return database


def close_database():
    client.close()