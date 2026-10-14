import { useState } from 'react'                                    
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { ThemeProvider, useTheme } from './context/ThemeContext'    
import { TaskProvider } from './context/TaskContext'

import './App.css'
import Board from './components/Board'
import TaskForm from './components/TaskForm'
import ThemeToggle from './components/ThemeToggle'
import ErrorFallback from './components/ErrorFallback'
import ViewSwitcher from './components/ViewSwitcher'              
import ArchiveView from './components/ArchiveView' 

function AppContent() {
  const { theme } = useTheme()
  const [view, setView] = useState('board') 
  
   return (
    <div className={`app ${theme}`}>
      <div className="app-header">

        <ViewSwitcher view={view} onChange={setView} />
        <ThemeToggle />
      </div>

      <div hidden={view !== 'board'}>
        <TaskForm />
        <Board />
      </div>

      {view === 'archive' && <ArchiveView />}
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