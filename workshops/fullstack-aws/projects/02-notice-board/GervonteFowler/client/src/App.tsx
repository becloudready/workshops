import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as api from './api';
import type { Notice } from './api';

const EMPTY_FORM = { name: '', message: '' };

export default function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getNotices()
      .then((result) => setNotices(result.notices))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function submitNotice(): Promise<void> {
    setSubmitting(true);
    setError('');
    try {
      const result = await api.createNotice(form);
      setNotices((current) => [result.notice, ...current]);
      setForm(EMPTY_FORM);
      setFormOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function removeNotice(id: string): Promise<void> {
    setDeletingId(id);
    setError('');
    try {
      await api.deleteNotice(id);
      setNotices((current) => current.filter((notice) => notice.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Container
            maxWidth="md"
            disableGutters
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
              Community Notice Board
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
            >
              Post notice
            </Button>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          Latest notices
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Share an update with everyone in the community.
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress aria-label="Loading notices" />
          </Box>
        ) : notices.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ py: 7, textAlign: 'center' }}>
              <Typography variant="h6">No notices yet</Typography>
              <Typography color="text.secondary">Be the first to post an update.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {notices.map((notice) => (
              <Card key={notice.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {notice.name}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{notice.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notice.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                  <Tooltip title="Delete notice">
                    <span>
                      <IconButton
                        color="error"
                        disabled={deletingId === notice.id}
                        onClick={() => void removeNotice(notice.id)}
                        aria-label={`Delete notice from ${notice.name}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </Container>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Post a notice</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Your name"
              value={form.name}
              slotProps={{ htmlInput: { maxLength: 80 } }}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <TextField
              label="Message"
              value={form.message}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              multiline
              minRows={4}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => void submitNotice()}
            disabled={submitting || !form.name.trim() || !form.message.trim()}
          >
            {submitting ? 'Posting…' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
