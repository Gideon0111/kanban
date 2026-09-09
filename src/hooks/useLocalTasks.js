import { useEffect, useState } from 'react'
import mockTasks from '../data/mockTasks'

function useLocalTasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanban-tasks')
    return savedTasks ? JSON.parse(savedTasks) : mockTasks
  })

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task) => {
    setTasks(prevTasks => [...prevTasks, {...task, id: Date.now(),},])
  }
  const deleteTask = (taskId) => { 
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }
  const moveTask = (taskId, newStatus) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? 
    { ...task, status: newStatus } : task ))
	}

  return {
    tasks, addTask, deleteTask, moveTask,
  }
}
export default useLocalTasks