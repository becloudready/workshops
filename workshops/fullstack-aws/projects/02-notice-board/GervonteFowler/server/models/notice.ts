import type { ObjectId } from 'mongodb';

export interface NoticeDocument {
  _id?: ObjectId;
  name: string;
  message: string;
  created_at: string;
}

export interface Notice {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export function toNotice(document: NoticeDocument & { _id: ObjectId }): Notice {
  return {
    id: document._id.toHexString(),
    name: document.name,
    message: document.message,
    created_at: document.created_at,
  };
}
