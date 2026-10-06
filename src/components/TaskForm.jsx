import { useState } from 'react'
import { useTasks } from '../context/TaskContext'

function TaskForm() {
  const { addTask, isAdding, actionError } = useTasks()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [owner, setOwner] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim()) return

    try {
      await addTask({
        title,
        description,
        status: 'todo',
        dueDate: dueDate || null,
        owner: owner.trim() || null,
        priority,
      })

      setTitle('')
      setDescription('')
      setDueDate('')
      setOwner('')
      setPriority('medium')
    } catch {
      // The hook already stores the error.
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isAdding}
      />

      <input
        type="text"
        placeholder="Task description"
        value={description}
        onChange={event => setDescription(event.target.value)}
        disabled={isAdding}
      />

      <input
        type="date"
        value={dueDate}
        onChange={event => setDueDate(event.target.value)}
        disabled={isAdding}
        aria-label="Due date"
      />

      <input
        type="text"
        placeholder="Assigned to"
        value={owner}
        onChange={event => setOwner(event.target.value)}
        disabled={isAdding}
        aria-label="Owner"
      />

      <select
        value={priority}
        onChange={event => setPriority(event.target.value)}
        disabled={isAdding}
        aria-label="Priority"
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add Task'}
      </button>

      {actionError && <p role="alert">{actionError}</p>}
    </form>
  )
}

export default TaskForm