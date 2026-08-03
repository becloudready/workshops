import { ObjectId } from 'mongodb';
import { getDatabase } from '../db/mongo';
import { Notice, NoticeDocument, toNotice } from '../models/notice';

async function noticesCollection() {
  const database = await getDatabase();
  return database.collection<NoticeDocument>('notices');
}

export async function listNotices(): Promise<Notice[]> {
  const collection = await noticesCollection();
  const documents = await collection.find({}).sort({ created_at: -1 }).toArray();
  return documents.map((document) => toNotice(document as NoticeDocument & { _id: ObjectId }));
}

export async function createNotice(name: string, message: string): Promise<Notice> {
  const collection = await noticesCollection();
  const document: NoticeDocument = {
    name,
    message,
    created_at: new Date().toISOString(),
  };
  const result = await collection.insertOne(document);
  return toNotice({ ...document, _id: result.insertedId });
}

export async function deleteNotice(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  const collection = await noticesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
