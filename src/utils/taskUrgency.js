const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const APPROACHING_WINDOW_DAYS = 3

function isSameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export const TEMPORAL_STATE_CONFIG = {
  normal:      { dotVar: '--success', emoji: '🟢', label: 'Normal' },
  approaching: { dotVar: '--warning', emoji: '🟡', label: 'Approaching deadline' },
  due:         { dotVar: '--due',     emoji: '🟠', label: 'Due' },
  overdue:     { dotVar: '--danger',  emoji: '🔴', label: 'Overdue' },
  completed:   { dotVar: '--text-muted', emoji: '✅', label: 'Completed' },
  cancelled:   { dotVar: '--text-muted', emoji: '⚪', label: 'Cancelled' },
}

// status + cancelled flag take priority over date math — once a task is
// done or cancelled, "is it overdue right now" is no longer a live question.
export function getTemporalState(task) {
  if (task.cancelled) return 'cancelled'
  if (task.status === 'done') return 'completed'
  if (!task.dueDate) return 'normal'

  const due = new Date(task.dueDate)
  const now = new Date()

  if (due < now) return 'overdue'
  if (isSameCalendarDay(due, now)) return 'due'

  const diffDays = (due - now) / DAY_MS
  if (diffDays <= APPROACHING_WINDOW_DAYS) return 'approaching'
  return 'normal'
}

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const shortDateFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

// The label shown next to the dot. Returns null for completed/cancelled —
// those get their own treatment (getCompletionSummary, or a plain "Cancelled" tag).
export function formatDueLabel(task) {
  const state = getTemporalState(task)
  if (state === 'completed' || state === 'cancelled' || !task.dueDate) return null

  const due = new Date(task.dueDate)
  const now = new Date()
  const diffMs = due - now

  if (state === 'overdue') {
    return `${formatDuration(Math.abs(diffMs))} overdue`
  }
  if (state === 'due') {
    return `Due today at ${timeFormatter.format(due)}`
  }
  if (state === 'approaching') {
    const diffDays = Math.round(diffMs / DAY_MS)
    return diffDays <= 1 ? 'Due tomorrow' : `Due in ${diffDays} days`
  }
  return `Due ${shortDateFormatter.format(due)}` // normal
}

// Historical summary for a task already in the Done column.
// Always neutral in tone/color — it's a record, not an alarm.
export function getCompletionSummary(task) {
  if (task.status !== 'done' || !task.completedAt) return null
  if (!task.dueDate) return 'Completed'

  const diffMs = new Date(task.completedAt) - new Date(task.dueDate)
  if (diffMs <= 0) return 'Completed on time'

  return `Completed late — ${formatDuration(diffMs)} overdue`
}

export function formatDate(isoDate) {
  if (!isoDate) return null
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoDate))
}