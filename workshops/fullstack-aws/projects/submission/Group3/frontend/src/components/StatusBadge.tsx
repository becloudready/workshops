import { StatusBadgeWrapper, StatusDot } from './ProgressBar.styled'

function StatusBadge({ completed, small }: { completed: boolean; small?: boolean }) {
  return (
    <StatusBadgeWrapper $completed={completed} $small={small}>
      <StatusDot $completed={completed} $small={small} />
      {completed ? 'Complete' : 'Pending'}
    </StatusBadgeWrapper>
  )
}

export default StatusBadge
