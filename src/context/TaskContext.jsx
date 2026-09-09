import { createContext, useContext } from 'react'
import useLocalTasks from '../hooks/useLocalTasks'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const taskData = useLocalTasks()

  return (
    <TaskContext.Provider value={taskData}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider')
  }

  return context
}