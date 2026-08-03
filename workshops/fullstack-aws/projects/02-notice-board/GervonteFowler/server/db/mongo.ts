import 'dotenv/config';
import {
  ClientSession,
  Db,
  MongoClient,
  ServerApiVersion,
  TransactionOptions,
} from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'noticeboard';

let client: MongoClient | null = null;
let database: Db | null = null;
let connectPromise: Promise<MongoClient> | null = null;
let initializationPromise: Promise<void> | null = null;

async function initializeDatabase(db: Db): Promise<void> {
  await db.collection('notices').createIndex({ created_at: -1 });
}

export async function connectToDatabase(): Promise<Db> {
  if (database && initializationPromise) {
    await initializationPromise;
    return database;
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your .env file.');
  }

  if (!connectPromise) {
    const mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    connectPromise = mongoClient.connect();
  }

  client = await connectPromise;
  database = client.db(dbName);

  if (!initializationPromise) {
    initializationPromise = initializeDatabase(database);
  }
  await initializationPromise;
  await database.command({ ping: 1 });
  return database;
}

export async function getDatabase(): Promise<Db> {
  return connectToDatabase();
}

export async function runInTransaction<T>(
  operation: (session: ClientSession) => Promise<T>,
): Promise<T> {
  await connectToDatabase();
  if (!client) {
    throw new Error('MongoDB client is not connected');
  }

  const options: TransactionOptions = {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary',
  };

  return client.withSession((session) =>
    session.withTransaction(() => operation(session), options),
  );
}

export async function isDatabaseReady(): Promise<boolean> {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
  }
  client = null;
  database = null;
  connectPromise = null;
  initializationPromise = null;
}
