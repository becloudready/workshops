import { Card, CardContent, Typography, Box } from '@mui/material'

export default function NoticeCard({ notice }) {
  return (
    <Card sx={{ mb: 1.5 }} elevation={1}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="baseline">
          <Typography variant="subtitle2" fontWeight="bold">{notice.name}</Typography>
          {notice.created_at && (
            <Typography variant="caption" color="text.secondary">
              {new Date(notice.created_at).toLocaleString()}
            </Typography>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 0.5 }}>{notice.message}</Typography>
      </CardContent>
    </Card>
  )
}
