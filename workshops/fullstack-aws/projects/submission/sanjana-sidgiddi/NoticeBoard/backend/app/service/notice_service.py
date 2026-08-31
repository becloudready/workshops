from app.repository.notice_repository import (
    insert_notice,
    find_all_notices,
    find_notice_by_id,
    replace_notice_by_id,
    update_notice_by_id,
    delete_notice_by_id,
)

'''
    Implement Create Notice Service
'''
def create_notice(notice):
    notice_data = notice.model_dump()
    notice_data["date"] = notice_data["date"].isoformat()
    return insert_notice(notice_data)

'''
    Implement Get All Notices Service
'''
def get_all_notices():
    return find_all_notices()

'''
    Implement Get Notice by ID Service
'''
def get_notice_by_id(notice_id: str):
    return find_notice_by_id(notice_id)

'''
    Implement Replace Notice by ID Service
'''
def replace_notice(notice_id: str, notice):
    notice_data = notice.model_dump()
    notice_data["date"] = notice_data["date"].isoformat()
    return replace_notice_by_id(
        notice_id,
        notice_data
    )

'''
    Implement Update Notice by ID Service
'''
def update_notice(notice_id: str, notice):
    update_data = notice.model_dump(exclude_unset=True)
    if "date" in update_data and update_data["date"] is not None:
        update_data["date"] = update_data["date"].isoformat()
    if not update_data:
        return find_notice_by_id(notice_id)
    return update_notice_by_id(
        notice_id,
        update_data
    )

'''
    Implement Delete Notice by ID Service
'''
def delete_notice(notice_id: str):
    return delete_notice_by_id(notice_id)