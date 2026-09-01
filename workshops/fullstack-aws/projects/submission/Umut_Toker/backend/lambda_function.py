import json
import os
from datetime import datetime, timezone

import pg8000.native

PG_HOST = os.environ["PG_HOST"]
PG_PORT = int(os.environ.get("PG_PORT", 5432))
PG_DATABASE = os.environ.get("PG_DATABASE", "tasktracker")
PG_USER = os.environ["PG_USER"]
PG_PASSWORD = os.environ["PG_PASSWORD"]

_TABLE_READY = False


def get_connection():
    return pg8000.native.Connection(
        host=PG_HOST,
        port=PG_PORT,
        database=PG_DATABASE,
        user=PG_USER,
        password=PG_PASSWORD,
        timeout=5,
    )


def ensure_table(conn):
    global _TABLE_READY
    if _TABLE_READY:
        return
    conn.run("""
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            priority TEXT NOT NULL DEFAULT 'medium',
            status TEXT NOT NULL DEFAULT 'todo',
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)
    _TABLE_READY = True


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
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    try:
        conn = get_connection()
        ensure_table(conn)

        if method == "GET" and path == "/tasks":
            return get_tasks(conn)

        if method == "POST" and path == "/tasks":
            body = json.loads(event.get("body") or "{}")
            return create_task(conn, body)

        if method == "PUT" and path.startswith("/tasks/"):
            task_id = path.split("/")[-1]
            body = json.loads(event.get("body") or "{}")
            return update_task(conn, task_id, body)

        if method == "DELETE" and path.startswith("/tasks/"):
            task_id = path.split("/")[-1]
            return delete_task(conn, task_id)

        return response(404, {"error": f"Route not found: {method} {path}"})

    except Exception as e:
        print(f"Error: {e}")
        return response(500, {"error": str(e)})


def get_tasks(conn):
    rows = conn.run(
        "SELECT id, title, description, priority, status, created_at FROM tasks ORDER BY id"
    )
    tasks = [row_to_task(row) for row in rows]
    return response(200, {"tasks": tasks})


def create_task(conn, body):
    title = body.get("title", "").strip()
    if not title:
        return response(400, {"error": "title is required"})

    description = body.get("description", "")
    priority = body.get("priority", "medium")

    rows = conn.run(
        """
        INSERT INTO tasks (title, description, priority, status)
        VALUES (:title, :description, :priority, 'todo')
        RETURNING id, title, description, priority, status, created_at
        """,
        title=title,
        description=description,
        priority=priority,
    )
    return response(201, {"task": row_to_task(rows[0])})


def update_task(conn, task_id, body):
    allowed = {"title", "description", "priority", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return response(400, {"error": "No valid fields to update"})

    try:
        task_id_int = int(task_id)
    except ValueError:
        return response(404, {"error": "Task not found"})

    set_clause = ", ".join(f"{col} = :{col}" for col in updates)
    rows = conn.run(
        f"UPDATE tasks SET {set_clause} WHERE id = :id RETURNING id",
        id=task_id_int,
        **updates,
    )
    if not rows:
        return response(404, {"error": "Task not found"})
    return response(200, {"updated": task_id})


def delete_task(conn, task_id):
    try:
        task_id_int = int(task_id)
    except ValueError:
        return response(404, {"error": "Task not found"})

    rows = conn.run("DELETE FROM tasks WHERE id = :id RETURNING id", id=task_id_int)
    if not rows:
        return response(404, {"error": "Task not found"})
    return response(200, {"deleted": task_id})


def row_to_task(row):
    task_id, title, description, priority, status, created_at = row
    return {
        "id": str(task_id),
        "title": title,
        "description": description,
        "priority": priority,
        "status": status,
        "created_at": created_at.isoformat() if isinstance(created_at, datetime) else created_at,
    }


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }
