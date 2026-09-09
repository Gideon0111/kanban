import './App.css'
import Board from './components/Board'  
import TaskForm from './components/TaskForm'
import { TaskProvider } from './context/TaskContext'


function App() { 
  return (
    <TaskProvider>
      <main>
        <h1>My Kanban Board</h1>
        <TaskForm />
        <Board />
      </main>
    </TaskProvider>
  )
}
export default App