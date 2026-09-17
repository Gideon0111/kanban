import { useTasks } from '../context/TaskContext'

function TaskCard({ task }) {
  const {
    moveTask,
    deleteTask,
    actionLoading,
  } = useTasks()

  return (
    <article className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="task-actions">
        {task.status !== 'todo' && (
          <button
            disabled={actionLoading}
            onClick={() => moveTask(task.id, 'todo')}
          >
            Move to Todo
          </button>
        )}

        {task.status !== 'in-progress' && (
          <button
            disabled={actionLoading}
            onClick={() => moveTask(task.id, 'in-progress')}
          >
            Move to In Progress
          </button>
        )}

        {task.status !== 'done' && (
          <button
            disabled={actionLoading}
            onClick={() => moveTask(task.id, 'done')}
          >
            Move to Done
          </button>
        )}

        <button
          disabled={actionLoading}
          onClick={() => deleteTask(task.id)}
        >
          {actionLoading ? 'Processing...' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default TaskCard