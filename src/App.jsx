import { useTheme } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContext'
import {ThemeProvider} from './context/ThemeContext'

import './App.css'
import Board from './components/Board'  
import TaskForm from './components/TaskForm'
import ThemeToggle from './components/ThemeToggle'

function AppContent() {
  const { theme } = useTheme()
  return (
    <div className={`app ${theme}`}>
      <div className="app-header">
        <ThemeToggle />
      </div>
      <TaskForm />
      <Board />
    </div>
  )
}

function App() { 
  return (
    <TaskProvider>
      <ThemeProvider> 
      <AppContent />
      </ThemeProvider>
    </TaskProvider>
  )
}
export default App