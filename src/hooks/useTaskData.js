import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTaskRequest,
} from '../api/tasksApi'

function useTaskData() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [pendingTaskIds, setPendingTaskIds] = useState(() => new Set())
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const markPending = (taskId, isPending) => {
    setPendingTaskIds((prev) => {
      const next = new Set(prev)
      isPending ? next.add(taskId) : next.delete(taskId)
      return next
    })
  }

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const addTask = useCallback(async (task) => {
    setIsAdding(true)
    setActionError(null)
    try {
      const newTask = await createTask(task)
      const taskWithMeta = { createdAt: new Date().toISOString(), ...newTask }
      setTasks((prevTasks) => [...prevTasks, taskWithMeta])
      toast.success('Task added')
      return taskWithMeta
    } catch (error) {
      setActionError(error.message)
      toast.error(`Couldn't add task: ${error.message}`)
      throw error
    } finally {
      setIsAdding(false)
    }
  }, [])

  const moveTask = useCallback(async (taskId, newStatus) => {
    markPending(taskId, true)
    setActionError(null)
    const previousTasks = tasks
    const task = tasks.find((t) => t.id === taskId)

    const updates = { status: newStatus }
    if (newStatus === 'done') {
      updates.completedAt = new Date().toISOString()
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    )

    try {
      await updateTask(taskId, updates)

      if (newStatus === 'done' && task?.dueDate) {
        const diffMs = new Date(updates.completedAt) - new Date(task.dueDate)
        if (diffMs > 0) {
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
          toast.warning(`Task completed — ${diffDays}d overdue`)
        } else {
          toast.success('Task completed on time')
        }
      } else {
        toast.success('Task moved')
      }
    } catch (error) {
      setTasks(previousTasks)
      setActionError(error.message)
      toast.error(`Couldn't move task: ${error.message}`)
    } finally {
      markPending(taskId, false)
    }
  }, [tasks])

  const deleteTask = useCallback(async (taskId) => {
    markPending(taskId, true)
    setActionError(null)
    try {
      await deleteTaskRequest(taskId)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      toast.success('Task deleted')
    } catch (error) {
      setActionError(error.message)
      toast.error(`Couldn't delete task: ${error.message}`)
      markPending(taskId, false)
      throw error
    }
  }, [])

  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === 'todo'),
      'in-progress': tasks.filter((task) => task.status === 'in-progress'),
      done: tasks.filter((task) => task.status === 'done'),
    }
  }, [tasks])

  return {
    tasks,
    tasksByStatus,
    loading,
    isAdding,
    pendingTaskIds,
    error,
    actionError,
    addTask,
    moveTask,
    deleteTask,
    retry: loadTasks,
  }
}

export default useTaskData