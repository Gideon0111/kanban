import { getTemporalState, formatDueLabel } from '../utils/taskUrgency'

function TemporalIndicator({ task }) {
  const state = getTemporalState(task)

  // Completed and cancelled cards get their own summary line in TaskCard.
  if (state === 'completed' || state === 'cancelled' || !task.dueDate) return null

  return (
    <div className="temporal-indicator" role="status">
      <span className={`temporal-dot temporal-dot--${state}`} aria-hidden="true" />
      <span className="temporal-indicator__label">{formatDueLabel(task)}</span>
    </div>
  )
}

export default TemporalIndicator