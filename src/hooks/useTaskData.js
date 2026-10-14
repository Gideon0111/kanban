import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTaskRequest,
} from '../api/tasksApi'
import { formatDuration, getOverdueMs } from '../utils/taskUrgency'

const STATUS_LABELS = { todo: 'Todo', 'in-progress': 'In Progress', done: 'Done' }

function useTaskData() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [pendingTaskIds, setPendingTaskIds] = useState(() => new Set())
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const tasksRef = useRef(tasks)
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const markPending = useCallback((taskId, isPending) => {
    setPendingTaskIds((prev) => {
      const next = new Set(prev)
      if (isPending) next.add(taskId)
      else next.delete(taskId)
      return next
    })
  }, [])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTasks(await getTasks())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Core of every optimistic update: apply locally, persist, roll back
  // only this one task if the request fails.
  const patchTask = useCallback(
    async (taskId, updates, { onSuccess, errorMessage = "Couldn't update task" } = {}) => {
      const previousTask = tasksRef.current.find((t) => t.id === taskId)
      if (!previousTask) return false

      markPending(taskId, true)
      setActionError(null)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))

      try {
        await updateTask(taskId, updates)
        onSuccess?.(previousTask)
        return true
      } catch (err) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? previousTask : t)))
        setActionError(err.message)
        toast.error(`${errorMessage}: ${err.message}`)
        return false
      } finally {
        markPending(taskId, false)
      }
    },
    [markPending]
  )

  const addTask = useCallback(async (task) => {
    setIsAdding(true)
    setActionError(null)
    try {
      // createdAt is stamped BEFORE the request so it is persisted.
      const newTask = await createTask({
        cancelled: false,
        archived: false,
        completedAt: null,
        ...task,
        createdAt: new Date().toISOString(),
      })
      setTasks((prev) => [...prev, newTask])
      toast.success('Task added')
      return newTask
    } catch (err) {
      setActionError(err.message)
      toast.error(`Couldn't add task: ${err.message}`)
      throw err
    } finally {
      setIsAdding(false)
    }
  }, [])

  const moveTask = useCallback(
    (taskId, newStatus) => {
      const now = new Date()
      const completedAt = newStatus === 'done' ? now.toISOString() : null

      return patchTask(
        taskId,
        { status: newStatus, completedAt },
        {
          errorMessage: "Couldn't move task",
          onSuccess: (previousTask) => {
            const overdueMs = getOverdueMs(previousTask, now)

            if (newStatus === 'done') {
              const message = !previousTask.dueDate
                ? 'Task completed'
                : overdueMs > 0
                  ? `Task completed — ${formatDuration(overdueMs)} overdue`
                  : 'Task completed on time'

              toast[overdueMs > 0 ? 'warning' : 'success'](message, {
                duration: 8000,
                action: {
                  label: 'Undo',
                  onClick: () =>
                    patchTask(
                      taskId,
                      { status: previousTask.status, completedAt: null },
                      { onSuccess: () => toast('Completion undone') }
                    ),
                },
              })
              return
            }

            const label = `Moved to ${STATUS_LABELS[newStatus]}`
            if (overdueMs > 0) toast.warning(`${label} — ${formatDuration(overdueMs)} overdue`)
            else toast.success(label)
          },
        }
      )
    },
    [patchTask]
  )

  const cancelTask = useCallback(
    async (taskId) => {
      const task = tasksRef.current.find((t) => t.id === taskId)
      if (!task) return

      // previousStatus is what makes "Restore" possible later.
      await patchTask(
        taskId,
        {
          cancelled: true,
          cancelledAt: new Date().toISOString(),
          previousStatus: task.status,
          status: 'done',
          completedAt: null,
        },
        {
          errorMessage: "Couldn't cancel task",
          onSuccess: () => toast('Task cancelled'),
        }
      )
    },
    [patchTask]
  )

  const restoreTask = useCallback(
    async (taskId) => {
      const task = tasksRef.current.find((t) => t.id === taskId)
      if (!task) return

      const status = task.previousStatus || 'todo'
      await patchTask(
        taskId,
        { cancelled: false, cancelledAt: null, previousStatus: null, completedAt: null, status },
        {
          errorMessage: "Couldn't restore task",
          onSuccess: () => toast.success(`Task restored to ${STATUS_LABELS[status]}`),
        }
      )
    },
    [patchTask]
  )

  const unarchiveTask = useCallback(
    (taskId) =>
      patchTask(
        taskId,
        { archived: false, archivedAt: null },
        {
          errorMessage: "Couldn't unarchive task",
          onSuccess: () => toast.success('Task unarchived'),
        }
      ),
    [patchTask]
  )

  const archiveTask = useCallback(
    (taskId) =>
      patchTask(
        taskId,
        { archived: true, archivedAt: new Date().toISOString() },
        {
          errorMessage: "Couldn't archive task",
          onSuccess: () =>
            toast.success('Task archived', {
              action: { label: 'Undo', onClick: () => unarchiveTask(taskId) },
            }),
        }
      ),
    [patchTask, unarchiveTask]
  )

  const deleteTask = useCallback(
    async (taskId) => {
      markPending(taskId, true)
      setActionError(null)
      try {
        await deleteTaskRequest(taskId)
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
        toast.success('Task deleted')
      } catch (err) {
        setActionError(err.message)
        toast.error(`Couldn't delete task: ${err.message}`)
      } finally {
        markPending(taskId, false)
      }
    },
    [markPending]
  )

  const activeTasks = useMemo(() => tasks.filter((t) => !t.archived), [tasks])

  const archivedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.archived)
        .sort((a, b) => new Date(b.archivedAt || 0) - new Date(a.archivedAt || 0)),
    [tasks]
  )

  const tasksByStatus = useMemo(
    () => ({
      todo: activeTasks.filter((t) => t.status === 'todo'),
      'in-progress': activeTasks.filter((t) => t.status === 'in-progress'),
      done: activeTasks.filter((t) => t.status === 'done'),
    }),
    [activeTasks]
  )

  return {
    tasks,
    tasksByStatus,
    archivedTasks,
    loading,
    isAdding,
    pendingTaskIds,
    error,
    actionError,
    addTask,
    moveTask,
    cancelTask,
    restoreTask,
    archiveTask,
    unarchiveTask,
    deleteTask,
    retry: loadTasks,
  }
}

export default useTaskData