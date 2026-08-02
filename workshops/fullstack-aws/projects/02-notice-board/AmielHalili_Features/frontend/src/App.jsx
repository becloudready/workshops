import { useState, useEffect } from 'react'
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material'
import NoticeList from './components/NoticeList'
import { getNotices } from './api'

export default function App() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => { fetchNotices() }, [])

  async function fetchNotices() {
    try {
      setLoading(true)
      const data = await getNotices()
      setNotices(data.notices || [])
    } catch (e) {
      setError('Failed to load notices. Check your API URL.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3, mb: 3 }}>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight="bold">Notice Board</Typography>
        </Container>
      </Box>

      <Container maxWidth="sm">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading
          ? <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
          : <NoticeList notices={notices} />
        }
      </Container>
    </Box>
  )
}
