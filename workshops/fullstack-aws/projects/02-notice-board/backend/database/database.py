import os
from dotenv import load_dotenv

from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("No MongoURI Provided")

client = MongoClient(os.getenv("MONGO_URI"), server_api=ServerApi('1'), serverSelectionTimeoutMS="5000")

try:
    client.admin.command("ping")
    print("Successfully connected to MongoDB!")
except ServerSelectionTimeoutError:
    print("Could not connect to MongoDB. Check your server status or connection.")
except Exception as e:
    print(e)