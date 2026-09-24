import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { useTheme } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContext'
import { ThemeProvider } from './context/ThemeContext'

import './App.css'
import Board from './components/Board'
import TaskForm from './components/TaskForm'
import ThemeToggle from './components/ThemeToggle'
import ErrorFallback from './components/ErrorFallback'

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
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <TaskProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </TaskProvider>
      <Toaster position="top-right" richColors closeButton />
    </ErrorBoundary>
  )
}

export default App