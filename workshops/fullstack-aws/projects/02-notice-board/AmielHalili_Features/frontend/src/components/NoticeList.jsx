import { Typography, Paper } from '@mui/material'
import NoticeCard from './NoticeCard'

export default function NoticeList({ notices }) {
  if (notices.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa' }}>
        <Typography variant="body2" color="text.secondary">No notices yet</Typography>
      </Paper>
    )
  }

  return notices.map(notice => <NoticeCard key={notice.id} notice={notice} />)
}
