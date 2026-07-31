from database.database import client

db = client["notice_board_db"]

noticesCol = db["Notices"]

def getNoticesDB():
    res = list(noticesCol.find())

    for r in res:
        r["_id"] = str(r["_id"])
        r["createdAt"] = r["createdAt"].isoformat()

    return res