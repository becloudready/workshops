import express from 'express';
import path from 'path';
import { isDatabaseReady } from './db/mongo';
import noticeRoutes from './routes/noticeRoutes';

const app = express();
const clientDistPath = path.resolve(process.cwd(), 'client/dist');

app.use(express.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  next();
});

app.options('*', (_req, res) => res.sendStatus(204));

app.get('/api', (_req, res) => {
  res.json({ message: 'Notice Board API is running' });
});

app.get('/health', async (_req, res) => {
  const ready = await isDatabaseReady();
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'unavailable',
    database: ready ? 'connected' : 'disconnected',
  });
});

app.get('/health/live', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/notices', noticeRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(express.static(clientDistPath));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

export default app;
