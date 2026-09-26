import { useState } from 'react'
import TaskCard from './TaskCard'

function Column({ title, tasks }) {
  const [visibleCount, setVisibleCount] = useState(3)

  const visibleTasks = tasks.slice(0, visibleCount)
  const hasMoreTasks = visibleCount < tasks.length
  const columnId = `column-${title.toLowerCase().replace(/\s+/g, '-')}`

  function handleShowMore() {
    setVisibleCount((currentCount) => currentCount + 3)
  }

  return (
    <section className="column" aria-labelledby={columnId}>
      <div className="column-header">
        <h2 className="column-title" id={columnId}>{title}</h2>
        <span className="column-count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </div>

      <div className="task-list" role="list" aria-live="polite">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="empty-column">
            <p>No tasks in {title.toLowerCase()} yet.</p>
            <span className="empty-column__hint">
              {title === 'Todo' ? 'Add one to get started.' : 'Move a task here when it\u2019s ready.'}
            </span>
          </div>
        )}
      </div>

      {hasMoreTasks && (
        <button
          type="button"
          className="show-more-button"
          onClick={handleShowMore}
          aria-label={`Show ${tasks.length - visibleCount} more tasks in ${title}`}
        >
          Show more
          <span aria-hidden="true">+{tasks.length - visibleCount}</span>
        </button>
      )}
    </section>
  )
}

export default Column