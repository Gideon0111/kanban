import { useTasks } from '../context/TaskContext'

const VIEWS = [
  { id: 'board', label: 'Board' },
  { id: 'archive', label: 'Archive' },
]

function ViewSwitcher({ view, onChange }) {
  const { archivedTasks } = useTasks()

  return (
    <nav className="view-switcher" aria-label="Views">
      {VIEWS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-current={view === id ? 'page' : undefined}
          className={`view-switcher__tab ${view === id ? 'view-switcher__tab--active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
          {id === 'archive' && archivedTasks.length > 0 && (
            <span className="view-switcher__count">{archivedTasks.length}</span>
          )}
        </button>
      ))}
    </nav>
  )
}

export default ViewSwitcher