import { useTasks } from '../context/TaskContext'

function TaskCard({ task }) {
  const { moveTask, deleteTask } = useTasks()

  return (
    <article className="task-card">
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <div className="task-actions">
        {task.status !== 'todo' && (
          <button
            onClick={() => moveTask(task.id, 'todo')}
          >
            Move to Todo
          </button>
        )}

        {task.status !== 'in-progress' && (
          <button
            onClick={() => moveTask(task.id, 'in-progress')}
          >
            Move to In Progress
          </button>
        )}

        {task.status !== 'done' && (
          <button
            onClick={() => moveTask(task.id, 'done')}
          >
            Move to Done
          </button>
        )}

        <button
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default TaskCard