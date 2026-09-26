import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Column from './Column'
import { useTasks } from '../context/TaskContext'

const COLUMN_DEFS = [
  { key: 'todo', title: 'Todo' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
]

function BoardSkeleton() {
  return (
    <SkeletonTheme baseColor="#e2e2e2" highlightColor="#f5f5f5">
      <main className="board" aria-busy="true" aria-label="Loading tasks">
        {COLUMN_DEFS.map(({ key }) => (
          <section className="column" key={key}>
            <Skeleton width={100} height={20} />
            <div className="task-list">
              <Skeleton height={64} style={{ marginBottom: 8 }} />
              <Skeleton height={64} style={{ marginBottom: 8 }} />
              <Skeleton height={64} />
            </div>
          </section>
        ))}
      </main>
    </SkeletonTheme>
  )
}

function Board() {
  const { tasksByStatus, loading, error, retry } = useTasks()

  if (loading) {
    return <BoardSkeleton />
  }

  if (error) {
    return (
      <div className="board-error" role="alert" aria-live="assertive">
        <p>Unable to load tasks: {error}</p>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <main className="board">
      {COLUMN_DEFS.map(({ key, title }) => (
        <Column key={key} title={title} tasks={tasksByStatus[key]} />
      ))}
    </main>
  )
}

export default Board

