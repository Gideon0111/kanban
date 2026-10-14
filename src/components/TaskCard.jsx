import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  formatDate,
  getCompletionSummary,
  getCancellationSummary,
} from '../utils/taskUrgency'
import TemporalIndicator from './TemporalIndicator'
import PriorityFlag from './PriorityFlag'
import OwnerAvatar from './OwnerAvatar'

// The lifecycle table, in code: which actions exist in which state.
function TaskActions({ task }) {
  const { moveTask, cancelTask, restoreTask, archiveTask, unarchiveTask, deleteTask } = useTasks()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Inline two-step confirm: lighter than a modal, still prevents accidents.
  const deleteControls = confirmingDelete ? (
    <>
      <button
        type="button"
        className="delete-button delete-button--confirm"
        onClick={() => deleteTask(task.id)}
      >
        Confirm delete
      </button>
      <button type="button" onClick={() => setConfirmingDelete(false)}>
        Keep
      </button>
    </>
  ) : (
    <button type="button" className="delete-button" onClick={() => setConfirmingDelete(true)}>
      Delete
    </button>
  )

  if (task.archived) {
    return (
      <div className="task-actions">
        <button type="button" onClick={() => unarchiveTask(task.id)}>Unarchive</button>
        {deleteControls}
      </div>
    )
  }

  if (task.cancelled) {
    return (
      <div className="task-actions">
        <button type="button" className="restore-button" onClick={() => restoreTask(task.id)}>
          Restore
        </button>
        <button type="button" className="archive-button" onClick={() => archiveTask(task.id)}>
          Archive
        </button>
      </div>
    )
  }

  if (task.status === 'done') {
    return (
      <div className="task-actions">
        <button type="button" className="archive-button" onClick={() => archiveTask(task.id)}>
          Archive
        </button>
      </div>
    )
  }

  return (
    <div className="task-actions">
      {task.status !== 'todo' && (
        <button type="button" onClick={() => moveTask(task.id, 'todo')}>Move to Todo</button>
      )}
      {task.status !== 'in-progress' && (
        <button type="button" onClick={() => moveTask(task.id, 'in-progress')}>
          Move to In Progress
        </button>
      )}
      <button type="button" onClick={() => moveTask(task.id, 'done')}>Move to Done</button>
      <button type="button" className="cancel-button" onClick={() => cancelTask(task.id)}>
        Cancel
      </button>
      {deleteControls}
    </div>
  )
}

// NEW: leading marker that tells Done-column cards apart at a glance.
// aria-hidden because the summary line already says "Completed..." / "Cancelled..."
function StatusMark({ isCompleted, isCancelled }) {
  if (isCompleted) {
    return (
      <span className="task-status-mark task-status-mark--completed" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="18" height="18">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
          <path
            d="M5.5 10.5l3 3 6-6.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }

  if (isCancelled) {
    return (
      <span className="task-status-mark task-status-mark--cancelled" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="18" height="18">
          <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7 7l6 6M13 7l-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }

  return null
}

function TaskCard({ task }) {
  const { pendingTaskIds } = useTasks()

  if (pendingTaskIds.has(task.id)) {
    return (
      <article className="task-card" aria-busy="true" aria-live="polite">
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} count={2} style={{ marginTop: 6 }} />
        <Skeleton height={12} width="50%" style={{ marginTop: 8 }} />
        <Skeleton height={32} width={90} style={{ marginTop: 10 }} />
      </article>
    )
  }

  const isCancelled = Boolean(task.cancelled)
  const isCompleted = task.status === 'done' && !isCancelled

  let statusLine
  if (isCancelled) {
    statusLine = (
      <span className="task-completion-summary task-completion-summary--cancelled">
        {getCancellationSummary(task)}
      </span>
    )
  } else if (isCompleted) {
    const summary = getCompletionSummary(task)
    statusLine = summary && <span className="task-completion-summary">{summary}</span>
  } else {
    statusLine = <TemporalIndicator task={task} />
  }

  return (
    <article className={`task-card ${isCancelled ? 'task-card--cancelled' : ''}`}>
      <div className="task-card__header">
        <div className="task-card__title-row">
        <StatusMark isCompleted={isCompleted} isCancelled={isCancelled} />
        <h3>{task.title}</h3>
        </div>

        <div className="task-card__badges">
          <PriorityFlag priority={task.priority || 'medium'} />
          <OwnerAvatar owner={task.owner} />
        </div>
      </div>

      <p>{task.description}</p>

      <div className="task-meta">
        {task.createdAt && <span className="task-meta__added">Added {formatDate(task.createdAt)}</span>}
        {task.archived && task.archivedAt && (
          <span className="task-meta__added">Archived {formatDate(task.archivedAt)}</span>
        )}
        {statusLine}
      </div>

      <TaskActions task={task} />
    </article>
  )
}

export default TaskCard