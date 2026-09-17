import { useEffect, useMemo, useState } from 'react'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTaskRequest,
} from '../api/tasksApi'

function useTaskData() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    async function loadTasks() {
      try {
        setError(null)
        const data = await getTasks()
        setTasks(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  const addTask = async (task) => {
    setActionLoading(true)
    setActionError(null)
    try {
      const newTask = await createTask(task)
      setTasks((prevTasks) => [...prevTasks, newTask])
    } catch (error) {
      setActionError(error.message)
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  const moveTask = async (taskId, newStatus) => {
    setActionLoading(true)
    setActionError(null)

    const previousTasks = tasks

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )

    try {
      await updateTask(taskId, { status: newStatus })
    } catch (error) {
      setTasks(previousTasks)
      setActionError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  const deleteTask = async (taskId) => {
    setActionLoading(true)
    setActionError(null)
    try {
      await deleteTaskRequest(taskId)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    } catch (error) {
      setActionError(error.message)
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // Derived state: grouped once here, not re-derived in every consumer
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
    actionLoading,
    error,
    actionError,
    addTask,
    moveTask,
    deleteTask,
  }
}

export default useTaskData