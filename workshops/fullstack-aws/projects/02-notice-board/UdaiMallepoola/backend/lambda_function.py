import json
import os
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient

MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = int(os.environ.get("MONGO_PORT", "27017"))
MONGO_DB   = os.environ.get("MONGO_DB", "noticeboard")

client = MongoClient(host=MONGO_HOST, port=MONGO_PORT, serverSelectionTimeoutMS=3000)
db     = client[MONGO_DB]
col    = db["notices"]

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def serialize(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc


def handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path   = event.get("rawPath", "/")

    # CORS preflight
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    # GET /notices
    if method == "GET" and path == "/notices":
        notices = [serialize(d) for d in col.find()]
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps(notices)}

    # POST /notices
    if method == "POST" and path == "/notices":
        body = json.loads(event.get("body") or "{}")
        name    = body.get("name", "").strip()
        message = body.get("message", "").strip()
        if not name or not message:
            return {"statusCode": 400, "headers": HEADERS,
                    "body": json.dumps({"error": "name and message are required"})}
        doc = {"name": name, "message": message, "createdAt": datetime.utcnow().isoformat()}
        result = col.insert_one(doc)
        doc["id"] = str(result.inserted_id)
        doc.pop("_id", None)
        return {"statusCode": 201, "headers": HEADERS, "body": json.dumps(doc)}

    # DELETE /notices/{id}
    if method == "DELETE" and path.startswith("/notices/"):
        notice_id = path.split("/")[-1]
        try:
            result = col.delete_one({"_id": ObjectId(notice_id)})
        except Exception:
            return {"statusCode": 400, "headers": HEADERS,
                    "body": json.dumps({"error": "invalid id"})}
        if result.deleted_count == 0:
            return {"statusCode": 404, "headers": HEADERS,
                    "body": json.dumps({"error": "not found"})}
        return {"statusCode": 200, "headers": HEADERS,
                "body": json.dumps({"deleted": notice_id})}

    return {"statusCode": 404, "headers": HEADERS, "body": json.dumps({"error": "not found"})}
