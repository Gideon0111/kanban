import { useState } from 'react'
import { useTasks } from '../context/TaskContext'

const EMPTY_FORM = { title: '', description: '', dueDate: '', owner: '', priority: 'medium' }

// datetime-local wants "YYYY-MM-DDTHH:mm" in LOCAL time (toISOString would give UTC).
function toLocalInputValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Give the task a title'
  if (!values.description.trim()) errors.description = 'Add a short description'
  if (!values.dueDate) errors.dueDate = 'Choose when this task is due'
  else if (new Date(values.dueDate) <= new Date()) errors.dueDate = 'Due date must be in the future'
  if (!values.owner.trim()) errors.owner = 'Assign someone to this task'
  return errors
}

function Field({ name, label, hint, error, wide, children }) {
  return (
    <div className={`form-field ${wide ? 'form-field--wide' : ''}`}>
      <label htmlFor={name} className="form-field__label">{label}</label>
      {children}
      {error ? (
        <span id={`${name}-error`} className="form-field__error" role="alert">{error}</span>
      ) : (
        hint && <span id={`${name}-hint`} className="form-field__hint">{hint}</span>
      )}
    </div>
  )
}

function TaskForm() {
  const { addTask, isAdding, actionError } = useTasks()
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    const nextErrors = validate(values)
    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      form.elements[firstInvalid]?.focus()
      return
    }

    try {
      await addTask({
        title: values.title.trim(),
        description: values.description.trim(),
        status: 'todo',
        dueDate: new Date(values.dueDate).toISOString(),
        owner: values.owner.trim(),
        priority: values.priority,
      })
      setValues(EMPTY_FORM)
    } catch {
      // The hook already stores the error and shows a toast.
    }
  }

  const fieldProps = (name, hasHint = false) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    disabled: isAdding,
    required: true,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : hasHint ? `${name}-hint` : undefined,
  })

  const [isOpen, setIsOpen] = useState(false) 
  // setIsOpen(false)

  return (  
    <form className="task-form" data-open={isOpen} onSubmit={handleSubmit} noValidate>
    <button
      type="button"
      className="task-form__toggle"
      aria-expanded={isOpen}
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? 'Close' : '+ Add task'}
    </button>

      <p className="task-form__note">All fields are required.</p>

      <Field name="title" label="Title" error={errors.title} wide>
        <input type="text" placeholder="" {...fieldProps('title')} />
      </Field>

      <Field name="description" label="Description" error={errors.description} wide>
        <input type="text" placeholder="" {...fieldProps('description')} />
      </Field>

      <Field
        name="dueDate"
        label="Due date & time"
        error={errors.dueDate}
      >
        <input type="datetime-local" min={toLocalInputValue()} {...fieldProps('dueDate', true)} />
      </Field>

      <Field name="owner" label="Owner" error={errors.owner}>
        <input type="text" placeholder="" {...fieldProps('owner')} />
      </Field>

      <Field name="priority" label="Priority" error={errors.priority}>
        <select {...fieldProps('priority')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </Field>

      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add Task'}
      </button>

      {actionError && <p role="alert" className="form-error">{actionError}</p>}
    </form>
  )
}

export default TaskForm