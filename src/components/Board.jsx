import Column from './Column'
import { useTasks } from '../context/TaskContext'

function Board() {
  const { tasks } = useTasks()

  const todoTasks = tasks.filter((task) => task.status === 'todo')
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress')
  const doneTasks = tasks.filter((task) => task.status === 'done')

  return (
    <main className="board">
      <Column title="Todo" tasks={todoTasks} />
      <Column title="In Progress" tasks={inProgressTasks} />
      <Column title="Done" tasks={doneTasks} />
    </main>
  )
}

export default Board