import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useTasks } from '../context/TaskContext'
import TaskCard from './TaskCard'

function ArchiveView() {
  const { archivedTasks, loading, error, retry } = useTasks()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return archivedTasks
    return archivedTasks.filter((task) =>
      [task.title, task.description, task.owner]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [archivedTasks, query])

  if (loading) {
    return (
      <section className="archive-view" aria-busy="true">
        <Skeleton count={3} height={90} style={{ marginBottom: 12 }} />
      </section>
    )
  }

  if (error) {
    return (
      <div className="board-error" role="alert">
        <p>Unable to load tasks: {error}</p>
        <button type="button" onClick={retry}>Retry</button>
      </div>
    )
  }

  return (
    <section className="archive-view" aria-labelledby="archive-title">
      <header className="archive-view__header">
        <div>
          <h2 id="archive-title">Archive</h2>
          <p>Completed and cancelled tasks you've tucked away. Unarchive to bring one back.</p>
        </div>
        <input
          type="search"
          className="archive-search"
          placeholder="Search title or description"
          aria-label="Search archived tasks"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>

      {results.length === 0 ? (
        <div className="empty-column">
          <p>{archivedTasks.length === 0 ? 'Nothing archived yet.' : 'No archived tasks match your search.'}</p>
          <span className="empty-column__hint">
            {archivedTasks.length === 0
              ? 'Archive finished tasks from the board to keep it focused.'
              : 'Try a different title, description or owner.'}
          </span>
        </div>
      ) : (
        <div className="archive-list">
          {results.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ArchiveView