import { useTasks } from '../context/TaskContext'

function TaskCard({ task }) {
  const { moveTask, deleteTask, pendingTaskIds } = useTasks()
  const isPending = pendingTaskIds.has(task.id)

  return (
    <article className="task-card" aria-busy={isPending}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="task-actions">
        {task.status !== 'todo' && (
          <button disabled={isPending} onClick={() => moveTask(task.id, 'todo')}>
            Move to Todo
          </button>
        )}
        {task.status !== 'in-progress' && (
          <button disabled={isPending} onClick={() => moveTask(task.id, 'in-progress')}>
            Move to In Progress
          </button>
        )}
        {task.status !== 'done' && (
          <button disabled={isPending} onClick={() => moveTask(task.id, 'done')}>
            Move to Done
          </button>
        )}
        <button disabled={isPending} onClick={() => deleteTask(task.id)}>
          {isPending ? 'Processing...' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default TaskCard