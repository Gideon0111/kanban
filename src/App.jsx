import './App.css'
import { TaskCard } from './components/TaskCard'

function App() {
  
  return (
    <>
    <TaskCard task={{ title: "Sample Task", description: "This is a sample task.", status: "To Do" }} />
    </>
  )
}

export default App
