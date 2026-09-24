import { useState } from 'react'
import { useTasks } from '../context/TaskContext'

function TaskForm() {
  const {
    addTask,
    actionLoading,
    actionError,
  } = useTasks()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim()) return

    try {
      await addTask({
        title,
        description,
        status: 'todo',
      })

      setTitle('')
      setDescription('')
    } catch {
      // The hook already stores the error.
    }
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

      <button type="submit" disabled={actionLoading}>
        {actionLoading ? 'Adding...' : 'Add Task'}
      </button>

      {actionError && <p>{actionError}</p>}
    </form>
  )
}

export default TaskForm