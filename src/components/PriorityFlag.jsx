const PRIORITY_CONFIG = {
  low: { marks: '▽', label: 'Low priority' },
  high: { marks: '▲▲', label: 'High priority' },
}

// Medium renders nothing — it's the statistical default, and marking every card would make the flag wallpaper instead of a signal.

function PriorityFlag({ priority }) {
  if (!priority || priority === 'medium') return null
  const config = PRIORITY_CONFIG[priority]
  if (!config) return null

  return (
    <span
      className={`priority-flag priority-flag--${priority}`}
      title={config.label}
      aria-label={config.label}
    >
      {config.marks}
    </span>
  )
}

export default PriorityFlag