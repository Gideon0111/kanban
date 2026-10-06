import { getTemporalState, formatDueLabel, TEMPORAL_STATE_CONFIG } from '../utils/taskUrgency'

function TemporalIndicator({ task }) {
  const state = getTemporalState(task)

  // Completed/cancelled tasks don't show a due-countdown dot —
  // completed gets getCompletionSummary instead; cancelled gets a plain muted tag.
  if (state === 'completed') return null
  if (state === 'cancelled') {
    return <span className="temporal-indicator temporal-indicator--cancelled">Cancelled</span>
  }
  if (!task.dueDate) return null

  const config = TEMPORAL_STATE_CONFIG[state]
  const label = formatDueLabel(task)

  return (
    <div className="temporal-indicator" role="status">
      <span
        className="temporal-dot"
        style={{ backgroundColor: `var(${config.dotVar})` }}
        aria-hidden="true"
      />
      <span className="temporal-indicator__label">{label}</span>
    </div>
  )
}

export default TemporalIndicator