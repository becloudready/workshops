"""
NoticeBoardTracker backend (AWS Lambda + MongoDB Atlas)

One Lambda handles every route. API Gateway sends all requests here
through a single "ANY /{proxy+}" route, and we look at the path to decide
what to do.

Collections:
  trainees       people HR onboards (email is unique -> no duplicates)
  cohorts        groups of trainees
  plans          training plans a manager assigns to a cohort OR one trainee
  notifications  messages a trainee sees (created automatically)
  reports        progress reports trainees submit on a plan
  notices        general announcements (the original notice board)

Routes:
  GET    /cohorts                     list cohorts
  POST   /cohorts                     {name}
  DELETE /cohorts/{id}

  GET    /trainees                    list trainees (?cohort_id= to filter)
  POST   /trainees                    {name, email, cohort_id?}   (HR onboarding)
  PUT    /trainees/{id}               {name?, email?, cohort_id?}
  DELETE /trainees/{id}

  GET    /plans                       list plans (?trainee_id= -> plans for that trainee)
  POST   /plans                       {title, description, due_date, cohort_id? | trainee_id?}
                                      -> notifies every trainee it targets
  DELETE /plans/{id}

  GET    /reports                     list reports (?trainee_id= or ?plan_id=)
  POST   /reports                     {trainee_id, plan_id, progress (0-100), note}

  GET    /notifications?trainee_id=   a trainee's notifications, newest first
  PUT    /notifications/{id}/read     mark one as read

  GET    /notices                     announcements, newest first
  POST   /notices                     {title, content}  -> notifies all trainees
  DELETE /notices/{id}

  GET    /dashboard                   one row per trainee for Training Managers
"""

import json
import os
import re
from datetime import datetime, timezone

from bson import ObjectId
from pymongo import MongoClient

# ---------------------------------------------------------------------------
# Database connection (created once, reused across invocations)
# ---------------------------------------------------------------------------
_client = None


def get_db():
    global _client
    if _client is None:
        _client = MongoClient(os.environ["MONGO_URI"], serverSelectionTimeoutMS=8000)
    db = _client["noticeboard_db"]
    return db


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def to_oid(value, what="id"):
    try:
        return ObjectId(value)
    except Exception:
        raise ApiError(400, f"Invalid {what}")


def clean(doc):
    """Turn ObjectIds into strings so the document can be sent as JSON."""
    if doc is None:
        return None
    out = {}
    for key, value in doc.items():
        out[key] = str(value) if isinstance(value, ObjectId) else value
    return out


def clean_all(docs):
    return [clean(d) for d in docs]


def require(body, *fields):
    missing = [f for f in fields if not str(body.get(f, "")).strip()]
    if missing:
        raise ApiError(400, "Missing required field(s): " + ", ".join(missing))


def respond(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }


def notify(db, trainee_ids, message, kind, ref_id=None):
    """Create one notification per trainee."""
    docs = [
        {
            "trainee_id": str(tid),
            "message": message,
            "type": kind,
            "ref_id": ref_id,
            "read": False,
            "created_at": now_iso(),
        }
        for tid in trainee_ids
    ]
    if docs:
        db.notifications.insert_many(docs)
    return len(docs)


# ---------------------------------------------------------------------------
# Cohorts
# ---------------------------------------------------------------------------
def cohorts(db, method, item_id, body, query):
    if method == "GET" and not item_id:
        return 200, clean_all(db.cohorts.find().sort("name", 1))

    if method == "POST" and not item_id:
        require(body, "name")
        name = body["name"].strip()
        if db.cohorts.find_one({"name_lower": name.lower()}):
            raise ApiError(409, f'A cohort named "{name}" already exists')
        doc = {"name": name, "name_lower": name.lower(), "created_at": now_iso()}
        doc["_id"] = db.cohorts.insert_one(doc).inserted_id
        return 201, clean(doc)

    if method == "DELETE" and item_id:
        oid = to_oid(item_id, "cohort id")
        db.cohorts.delete_one({"_id": oid})
        # Trainees in that cohort become "unassigned" rather than vanishing.
        db.trainees.update_many({"cohort_id": item_id}, {"$set": {"cohort_id": None}})
        return 200, {"message": "Cohort deleted"}

    raise ApiError(405, "Unsupported cohort route")


# ---------------------------------------------------------------------------
# Trainees (HR onboarding)
# ---------------------------------------------------------------------------
def trainees(db, method, item_id, body, query):
    if method == "GET" and not item_id:
        filt = {}
        if query.get("cohort_id"):
            filt["cohort_id"] = query["cohort_id"]
        return 200, clean_all(db.trainees.find(filt).sort("name", 1))

    if method == "GET" and item_id:
        doc = db.trainees.find_one({"_id": to_oid(item_id, "trainee id")})
        if not doc:
            raise ApiError(404, "Trainee not found")
        return 200, clean(doc)

    if method == "POST" and not item_id:
        require(body, "name", "email")
        email = body["email"].strip().lower()
        if not EMAIL_RE.match(email):
            raise ApiError(400, "Email address looks invalid")
        # Pain point: duplicated entries. Email must be unique.
        if db.trainees.find_one({"email": email}):
            raise ApiError(409, f"A trainee with email {email} is already onboarded")
        cohort_id = body.get("cohort_id") or None
        if cohort_id and not db.cohorts.find_one({"_id": to_oid(cohort_id, "cohort id")}):
            raise ApiError(400, "Cohort not found")
        doc = {
            "name": body["name"].strip(),
            "email": email,
            "cohort_id": cohort_id,
            "created_at": now_iso(),
        }
        doc["_id"] = db.trainees.insert_one(doc).inserted_id
        notify(db, [doc["_id"]], f"Welcome aboard, {doc['name']}!", "welcome")
        return 201, clean(doc)

    if method == "PUT" and item_id:
        oid = to_oid(item_id, "trainee id")
        update = {}
        if "name" in body and str(body["name"]).strip():
            update["name"] = body["name"].strip()
        if "email" in body and str(body["email"]).strip():
            email = body["email"].strip().lower()
            if not EMAIL_RE.match(email):
                raise ApiError(400, "Email address looks invalid")
            clash = db.trainees.find_one({"email": email, "_id": {"$ne": oid}})
            if clash:
                raise ApiError(409, f"Another trainee already uses {email}")
            update["email"] = email
        if "cohort_id" in body:
            update["cohort_id"] = body["cohort_id"] or None
        if update:
            db.trainees.update_one({"_id": oid}, {"$set": update})
        return 200, {"message": "Trainee updated"}

    if method == "DELETE" and item_id:
        db.trainees.delete_one({"_id": to_oid(item_id, "trainee id")})
        db.notifications.delete_many({"trainee_id": item_id})
        return 200, {"message": "Trainee removed"}

    raise ApiError(405, "Unsupported trainee route")


# ---------------------------------------------------------------------------
# Plans (Training Managers assign work)
# ---------------------------------------------------------------------------
def plans_for_trainee(db, trainee):
    """A trainee's plans = plans assigned to them + plans for their cohort."""
    ors = [{"trainee_id": str(trainee["_id"])}]
    if trainee.get("cohort_id"):
        ors.append({"cohort_id": trainee["cohort_id"]})
    return list(db.plans.find({"$or": ors}).sort("due_date", 1))


def plans(db, method, item_id, body, query):
    if method == "GET" and not item_id:
        if query.get("trainee_id"):
            trainee = db.trainees.find_one({"_id": to_oid(query["trainee_id"], "trainee id")})
            if not trainee:
                raise ApiError(404, "Trainee not found")
            return 200, clean_all(plans_for_trainee(db, trainee))
        return 200, clean_all(db.plans.find().sort("due_date", 1))

    if method == "POST" and not item_id:
        require(body, "title", "due_date")
        cohort_id = body.get("cohort_id") or None
        trainee_id = body.get("trainee_id") or None
        if bool(cohort_id) == bool(trainee_id):
            raise ApiError(400, "Assign the plan to exactly one: a cohort OR a single trainee")

        if cohort_id:
            cohort = db.cohorts.find_one({"_id": to_oid(cohort_id, "cohort id")})
            if not cohort:
                raise ApiError(400, "Cohort not found")
            targets = [t["_id"] for t in db.trainees.find({"cohort_id": cohort_id})]
            assigned_to = f"cohort {cohort['name']}"
        else:
            trainee = db.trainees.find_one({"_id": to_oid(trainee_id, "trainee id")})
            if not trainee:
                raise ApiError(400, "Trainee not found")
            targets = [trainee["_id"]]
            assigned_to = trainee["name"] + " (solo track)"

        doc = {
            "title": body["title"].strip(),
            "description": str(body.get("description", "")).strip(),
            "due_date": body["due_date"],
            "cohort_id": cohort_id,
            "trainee_id": trainee_id,
            "assigned_to": assigned_to,
            "created_at": now_iso(),
        }
        doc["_id"] = db.plans.insert_one(doc).inserted_id
        count = notify(
            db,
            targets,
            f'New plan assigned: "{doc["title"]}" (due {doc["due_date"]})',
            "plan",
            str(doc["_id"]),
        )
        result = clean(doc)
        result["notified"] = count
        return 201, result

    if method == "DELETE" and item_id:
        db.plans.delete_one({"_id": to_oid(item_id, "plan id")})
        db.reports.delete_many({"plan_id": item_id})
        return 200, {"message": "Plan deleted"}

    raise ApiError(405, "Unsupported plan route")


# ---------------------------------------------------------------------------
# Progress reports (trainees submit)
# ---------------------------------------------------------------------------
def reports(db, method, item_id, body, query):
    if method == "GET" and not item_id:
        filt = {}
        if query.get("trainee_id"):
            filt["trainee_id"] = query["trainee_id"]
        if query.get("plan_id"):
            filt["plan_id"] = query["plan_id"]
        return 200, clean_all(db.reports.find(filt).sort("created_at", -1))

    if method == "POST" and not item_id:
        require(body, "trainee_id", "plan_id")
        trainee = db.trainees.find_one({"_id": to_oid(body["trainee_id"], "trainee id")})
        if not trainee:
            raise ApiError(400, "Trainee not found")
        plan = db.plans.find_one({"_id": to_oid(body["plan_id"], "plan id")})
        if not plan:
            raise ApiError(400, "Plan not found")
        allowed = {str(p["_id"]) for p in plans_for_trainee(db, trainee)}
        if body["plan_id"] not in allowed:
            raise ApiError(400, "That plan is not assigned to this trainee")
        try:
            progress = int(body.get("progress", 0))
        except (TypeError, ValueError):
            raise ApiError(400, "Progress must be a number from 0 to 100")
        if not 0 <= progress <= 100:
            raise ApiError(400, "Progress must be a number from 0 to 100")

        doc = {
            "trainee_id": body["trainee_id"],
            "trainee_name": trainee["name"],
            "plan_id": body["plan_id"],
            "plan_title": plan["title"],
            "progress": progress,
            "note": str(body.get("note", "")).strip(),
            "created_at": now_iso(),
        }
        doc["_id"] = db.reports.insert_one(doc).inserted_id
        return 201, clean(doc)

    raise ApiError(405, "Unsupported report route")


# ---------------------------------------------------------------------------
# Notifications (trainees read)
# ---------------------------------------------------------------------------
def notifications(db, method, item_id, action, body, query):
    if method == "GET" and not item_id:
        if not query.get("trainee_id"):
            raise ApiError(400, "trainee_id is required")
        docs = db.notifications.find({"trainee_id": query["trainee_id"]}).sort("created_at", -1)
        return 200, clean_all(docs)

    if method == "PUT" and item_id and action == "read":
        db.notifications.update_one({"_id": to_oid(item_id, "notification id")}, {"$set": {"read": True}})
        return 200, {"message": "Marked as read"}

    raise ApiError(405, "Unsupported notification route")


# ---------------------------------------------------------------------------
# Notices (announcements to everyone; the original notice board)
# ---------------------------------------------------------------------------
def notices(db, method, item_id, body, query):
    if method == "GET" and not item_id:
        return 200, clean_all(db.notices.find().sort("created_at", -1))

    if method == "POST" and not item_id:
        require(body, "title")
        doc = {
            "title": body["title"].strip(),
            "content": str(body.get("content", "")).strip(),
            "created_at": now_iso(),
        }
        doc["_id"] = db.notices.insert_one(doc).inserted_id
        everyone = [t["_id"] for t in db.trainees.find({}, {"_id": 1})]
        notify(db, everyone, f'Announcement: {doc["title"]}', "notice", str(doc["_id"]))
        return 201, clean(doc)

    if method == "DELETE" and item_id:
        db.notices.delete_one({"_id": to_oid(item_id, "notice id")})
        return 200, {"message": "Notice deleted"}

    raise ApiError(405, "Unsupported notice route")


# ---------------------------------------------------------------------------
# Dashboard (high-level oversight for Training Managers)
# ---------------------------------------------------------------------------
def dashboard(db, method, item_id, body, query):
    if method != "GET":
        raise ApiError(405, "Unsupported dashboard route")

    today = datetime.now(timezone.utc).date().isoformat()
    cohort_names = {str(c["_id"]): c["name"] for c in db.cohorts.find()}
    rows = []
    counts = {"on_track": 0, "no_updates": 0, "overdue": 0, "done": 0, "no_plans": 0}

    for t in db.trainees.find().sort("name", 1):
        tid = str(t["_id"])
        assigned = plans_for_trainee(db, t)
        reps = list(db.reports.find({"trainee_id": tid}).sort("created_at", -1))

        # Latest progress per plan
        latest = {}
        for r in reps:
            latest.setdefault(r["plan_id"], r["progress"])

        overdue = [
            p["title"] for p in assigned
            if p.get("due_date", "9999") < today and latest.get(str(p["_id"]), 0) < 100
        ]
        avg = round(sum(latest.get(str(p["_id"]), 0) for p in assigned) / len(assigned)) if assigned else 0

        if not assigned:
            status = "no_plans"
        elif overdue:
            status = "overdue"
        elif avg == 100:
            status = "done"
        elif not reps:
            status = "no_updates"
        else:
            status = "on_track"
        counts[status] += 1

        rows.append({
            "trainee_id": tid,
            "name": t["name"],
            "email": t["email"],
            "cohort": cohort_names.get(t.get("cohort_id") or "", "Unassigned"),
            "plans_assigned": len(assigned),
            "reports_submitted": len(reps),
            "average_progress": avg,
            "last_update": reps[0]["created_at"] if reps else None,
            "overdue_plans": overdue,
            "status": status,
        })

    return 200, {
        "totals": {
            "trainees": len(rows),
            "cohorts": len(cohort_names),
            "plans": db.plans.count_documents({}),
            **counts,
        },
        "trainees": rows,
    }


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
ROUTES = {
    "cohorts": cohorts,
    "trainees": trainees,
    "plans": plans,
    "reports": reports,
    "notices": notices,
    "dashboard": dashboard,
}


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    if method == "OPTIONS":
        return respond(200, {})

    path = event.get("rawPath") or event.get("path") or "/"
    parts = [p for p in path.strip("/").split("/") if p]
    query = event.get("queryStringParameters") or {}

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            return respond(400, {"error": "Request body must be valid JSON"})

    if not parts:
        return respond(200, {"service": "NoticeBoardTracker", "routes": list(ROUTES) + ["notifications"]})

    resource = parts[0]
    item_id = parts[1] if len(parts) > 1 else None
    action = parts[2] if len(parts) > 2 else None

    try:
        db = get_db()
        if resource == "notifications":
            status, result = notifications(db, method, item_id, action, body, query)
        elif resource in ROUTES:
            status, result = ROUTES[resource](db, method, item_id, body, query)
        else:
            raise ApiError(404, f"Unknown route /{resource}")
        return respond(status, result)
    except ApiError as e:
        return respond(e.status, {"error": e.message})
    except Exception as e:
        return respond(500, {"error": str(e)})
