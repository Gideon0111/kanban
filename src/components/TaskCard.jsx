import { useTasks } from '../context/TaskContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { formatDate, getCompletionSummary } from '../utils/taskUrgency'
import TemporalIndicator from './TemporalIndicator'
import PriorityFlag from './PriorityFlag'
import OwnerAvatar from './OwnerAvatar'

function TaskCard({ task }) {
  const { moveTask, deleteTask, pendingTaskIds } = useTasks()
  const isPending = pendingTaskIds.has(task.id)

  if (isPending) {
    return (
      <article className="task-card" aria-busy="true" aria-live="polite">
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} count={2} style={{ marginTop: 6 }} />
        <Skeleton height={12} width="50%" style={{ marginTop: 8 }} />
        <Skeleton height={32} width={90} style={{ marginTop: 10 }} />
      </article>
    )
  }

  const completionSummary = getCompletionSummary(task)

  return (
    <article className="task-card">
      <div className="task-card__header">
        <h3>{task.title}</h3>
        <div className="task-card__badges">
          <PriorityFlag priority={task.priority} />
          <OwnerAvatar owner={task.owner} />
        </div>
      </div>

      <p>{task.description}</p>

      <div className="task-meta">
        <span className="task-meta__added">Added {formatDate(task.createdAt)}</span>
        {task.status === 'done' ? (
          completionSummary && (
            <span className="task-completion-summary">{completionSummary}</span>
          )
        ) : (
          <TemporalIndicator task={task} />
        )}
      </div>

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