import { useState } from 'react'
import { useTasks } from '../context/TaskContext'

function TaskForm() {
  const { addTask } = useTasks()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim()) return

    addTask({
      title,
      description,
      status: 'todo',
    })

    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <input
        type="text"
        placeholder="Task description"
        value={description}
        onChange={event => setDescription(event.target.value)}
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  )
}

export default TaskForm