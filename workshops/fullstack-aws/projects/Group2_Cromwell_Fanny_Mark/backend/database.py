import os
from dotenv import load_dotenv
from pymongo import MongoClient, ReturnDocument

load_dotenv()
MONGODB_URL = os.environ['MONGODB_URL']

client = MongoClient(MONGODB_URL)
db = client.NoticeBoard

managers = db.get_collection('managers')
students = db.get_collection('students')
groups = db.get_collection('groups')
tasks = db.get_collection('tasks')
