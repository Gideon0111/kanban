import { useState } from 'react'
import TaskCard from './TaskCard'

function Column({ title, tasks }) {
  const [visibleCount, setVisibleCount] = useState(3)

  const visibleTasks = tasks.slice(0, visibleCount)
  const hasMoreTasks = visibleCount < tasks.length

  function handleShowMore() {
    setVisibleCount((currentCount) => currentCount + 3)
  }

  return (
    <section className="column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <p className="empty-column">No tasks here yet.</p>
        )}
      </div>

      {hasMoreTasks && (
        <button
          type="button"
          className="show-more-button"
          onClick={handleShowMore}
        >
          Show more
          <span>+{tasks.length - visibleCount}</span>
        </button>
      )}
    </section>
  )
}

export default Column