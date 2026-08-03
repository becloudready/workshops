import { Router } from 'express';
import {
  createNotice,
  deleteNotice,
  listNotices,
} from '../repositories/noticeRepository';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.json({ notices: await listNotices() });
  } catch (error) {
    console.error('Failed to list notices', error);
    res.status(500).json({ error: 'Failed to load notices' });
  }
});

router.post('/', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!name || !message) {
    res.status(400).json({ error: 'name and message are required' });
    return;
  }
  if (name.length > 80 || message.length > 2000) {
    res.status(400).json({ error: 'name or message is too long' });
    return;
  }

  try {
    res.status(201).json({ notice: await createNotice(name, message) });
  } catch (error) {
    console.error('Failed to create notice', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteNotice(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }
    res.json({ deleted: req.params.id });
  } catch (error) {
    console.error('Failed to delete notice', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

export default router;
