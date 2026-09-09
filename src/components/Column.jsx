import TaskCard from './TaskCard'
import { useTasks } from '../context/TaskContext'

function Column({ title, status }) {
  const { tasks } = useTasks()

  const columnTasks = tasks.filter(
    task => task.status === status
  )

  return (
    <div className="column">
      <h2>{title}</h2>

      <div className="task-list">
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </div>
  )
}

export default Column