// TaskCard.jsx
import { useTasks } from '../context/TaskContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function TaskCard({ task }) {
  const { moveTask, deleteTask, pendingTaskIds } = useTasks()
  const isPending = pendingTaskIds.has(task.id)

  if (isPending) {
    return (
      <article className="task-card" aria-busy="true" aria-live="polite">
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} count={2} style={{ marginTop: 6 }} />
        <Skeleton height={32} width={90} style={{ marginTop: 10 }} />
      </article>
    )
  }

  return (
    <article className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="task-actions">
        {task.status !== 'todo' && (
          <button onClick={() => moveTask(task.id, 'todo')}>Move to Todo</button>
        )}
        {task.status !== 'in-progress' && (
          <button onClick={() => moveTask(task.id, 'in-progress')}>Move to In Progress</button>
        )}
        {task.status !== 'done' && (
          <button onClick={() => moveTask(task.id, 'done')}>Move to Done</button>
        )}
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </article>
  )
}

export default TaskCard