import Tooltip from './Tooltip'

const LEVELS = { low: 1, medium: 2, high: 3 }
const LABELS = { low: 'Low priority', medium: 'Medium priority', high: 'High priority' }

function PriorityFlag({ priority = 'medium' }) {
  const level = LEVELS[priority] ?? 2
  const label = LABELS[priority] ?? LABELS.medium

  return (
    <Tooltip label={label}>
      <span className="priority-meter" role="img" aria-label={label}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`priority-meter__segment ${n <= level ? 'priority-meter__segment--filled' : ''}`}
          />
        ))}
      </span>
    </Tooltip>
  )
}

export default PriorityFlag