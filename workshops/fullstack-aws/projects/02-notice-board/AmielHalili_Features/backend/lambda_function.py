import json
import os
from pymongo import MongoClient

MONGO_URI = os.environ["MONGO_URI"]
PORT = int(os.environ.get("PORT", 27017))


def get_collection():
    client = MongoClient(host=MONGO_URI, port=PORT, serverSelectionTimeoutMS=5000)
    return client["noticeboard"]["notices"]


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path   = event.get("rawPath", "/")

    print(f"Request: {method} {path}")

    # Handle CORS preflight
    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    try:
        if method == "GET" and path == "/notices":
            return get_notices()

        return response(404, {"error": f"Route not found: {method} {path}"})

    except Exception as e:
        print(f"Error: {e}")
        return response(500, {"error": str(e)})


def get_notices():
    notices = list(get_collection().find({}, {"_id": 1, "name": 1, "message": 1, "created_at": 1}))
    for n in notices:
        n["id"] = str(n.pop("_id"))
    return response(200, {"notices": notices})


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }
