import { createContext, useContext } from 'react'
import useTaskData from '../hooks/useTaskData'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const taskData = useTaskData()

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