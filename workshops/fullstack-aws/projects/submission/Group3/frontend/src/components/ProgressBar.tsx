import { ProgressWrapper, ProgressTrack, ProgressFill, ProgressLabel } from './ProgressBar.styled'

function ProgressBar({
  value,
  completed,
  mini,
}: {
  value: number
  completed: boolean
  mini?: boolean
}) {
  return (
    <ProgressWrapper>
      <ProgressTrack $mini={mini}>
        <ProgressFill $value={value} $completed={completed} />
      </ProgressTrack>
      <ProgressLabel $mini={mini}>{value}%</ProgressLabel>
    </ProgressWrapper>
  )
}

export default ProgressBar
