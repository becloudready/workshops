"""Notice Board API: AWS Lambda handler (API Gateway HTTP API, payload v2).

Routes
  GET    /               health check
  GET    /notices        list all notices, newest first
  POST   /notices        create a notice  {"name": "...", "message": "..."}
  DELETE /notices/{id}   delete a notice by id
"""
import base64
import json
import os
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from pymongo import DESCENDING, MongoClient

MAX_NAME = 100
MAX_MESSAGE = 1000

# Created once per Lambda container and reused across invocations.
_client = None


def get_collection():
    global _client
    if _client is None:
        _client = MongoClient(os.environ["MONGO_URI"], serverSelectionTimeoutMS=5000)
    db_name = os.environ.get("MONGO_DB", "noticeboard")
    return _client[db_name]["notices"]


def respond(status, body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def serialize(doc):
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "message": doc.get("message", ""),
        "created_at": doc.get("created_at"),
    }


def parse_body(event):
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode("utf-8")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    return data if isinstance(data, dict) else None


def list_notices(collection):
    docs = collection.find().sort("created_at", DESCENDING).limit(200)
    return respond(200, [serialize(d) for d in docs])


def create_notice(collection, event):
    data = parse_body(event)
    if data is None:
        return respond(400, {"error": "Request body must be a JSON object."})

    name = str(data.get("name", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not message:
        return respond(400, {"error": "Both name and message are required."})
    if len(name) > MAX_NAME:
        return respond(400, {"error": f"Name must be {MAX_NAME} characters or fewer."})
    if len(message) > MAX_MESSAGE:
        return respond(400, {"error": f"Message must be {MAX_MESSAGE} characters or fewer."})

    doc = {
        "name": name,
        "message": message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return respond(201, serialize(doc))


def delete_notice(collection, notice_id):
    try:
        oid = ObjectId(notice_id)
    except (InvalidId, TypeError):
        return respond(400, {"error": "Invalid notice id."})

    result = collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        return respond(404, {"error": "Notice not found."})
    return respond(200, {"deleted": notice_id})


def lambda_handler(event, context):
    route = event.get("routeKey", "")

    if route == "GET /":
        return respond(200, {"status": "ok", "service": "notice-board-api"})

    try:
        collection = get_collection()

        if route == "GET /notices":
            return list_notices(collection)
        if route == "POST /notices":
            return create_notice(collection, event)
        if route == "DELETE /notices/{id}":
            notice_id = (event.get("pathParameters") or {}).get("id")
            return delete_notice(collection, notice_id)

        return respond(404, {"error": f"Route not found: {route}"})
    except Exception as exc:  # full error goes to CloudWatch, generic message to the client
        print(f"ERROR handling {route}: {exc!r}")
        return respond(500, {"error": "Internal server error."})
