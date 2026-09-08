import { useState } from 'react'
import Column from './Column'
import { mockTasks } from '../data/mockTasks';

function Board() {
  const [tasks, setTasks] = useState(mockTasks);

  const todoTasks = tasks.filter(task => task.status === 'todo')
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
  const doneTasks = tasks.filter(task => task.status === 'done')
  return (
    <section className="board">
      <Column title="Todo" tasks={todoTasks} />
      <Column title="In Progress" tasks={inProgressTasks} />
      <Column title="Done" tasks={doneTasks} />
    </section>
  )
}
export default Board