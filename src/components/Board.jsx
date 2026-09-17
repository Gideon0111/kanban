import Column from './Column'
import { useTasks } from '../context/TaskContext'

function Board() {
  const { tasksByStatus, loading, error } = useTasks()

  if (loading) {
    return <p>Loading tasks...</p>
  }

  if (error) {
    return <p>Unable to load tasks: {error}</p>
  }  

  return (
    <main className="board">
      <Column title="Todo" tasks={tasksByStatus.todo} />
      <Column title="In Progress" tasks={tasksByStatus['in-progress']} />
      <Column title="Done" tasks={tasksByStatus.done} />
    </main>
  )
  }
export default Board