import { useRef, useState } from 'react'                          // NEW
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Column from './Column'
import ColumnTabs from './ColumnTabs'                             // NEW
import { useTasks } from '../context/TaskContext'

const COLUMN_DEFS = [
  { key: 'todo', title: 'Todo' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
]

const SWIPE_DISTANCE = 60                                          // NEW
const isPhone = () => window.matchMedia('(max-width: 600px)').matches   // NEW

function BoardSkeleton() {
  return (
    <SkeletonTheme baseColor="#e2e2e2" highlightColor="#f5f5f5">
      {/* NEW: tab-bar placeholder, so phones don't jump when the real tabs appear */}
      <div className="column-tabs" aria-hidden="true">
        <Skeleton height={46} containerClassName="column-tabs__skeleton" />
      </div>

      {/* CHANGED: data-active-column lets CSS show only the first skeleton column on phones */}
      <main className="board" data-active-column="todo" aria-busy="true" aria-label="Loading tasks">
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

  // NEW: hooks must sit above the early returns below
  const [activeColumn, setActiveColumn] = useState(COLUMN_DEFS[0].key)
  const boardRef = useRef(null)
  const touchStart = useRef(null)

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

  const tabs = COLUMN_DEFS.map((column) => ({
    ...column,
    count: tasksByStatus[column.key].length,
  }))

  // NEW: switching columns while scrolled deep would land you mid-list.
  // If the board's top is above the viewport, bring it back (CSS scroll-margin-top clears the sticky tabs).
  function selectColumn(key) {
    setActiveColumn(key)
    const board = boardRef.current
    if (board && board.getBoundingClientRect().top < 0) {
      board.scrollIntoView({ block: 'start' })
    }
  }

  // NEW: swipe between columns. Only counts when the move is mostly horizontal,
  // so normal vertical scrolling is never hijacked.
  function handleTouchStart(event) {
    const { clientX, clientY } = event.touches[0]
    touchStart.current = { x: clientX, y: clientY }
  }

  function handleTouchEnd(event) {
    if (!touchStart.current || !isPhone()) return

    const { clientX, clientY } = event.changedTouches[0]
    const dx = clientX - touchStart.current.x
    const dy = clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return

    const index = COLUMN_DEFS.findIndex((column) => column.key === activeColumn)
    const next = COLUMN_DEFS[index + (dx < 0 ? 1 : -1)]
    if (next) selectColumn(next.key)
  }

  return (
    <>
      {/* NEW */}
      <ColumnTabs columns={tabs} active={activeColumn} onSelect={selectColumn} />

      {/* CHANGED: ref, data-active-column and touch handlers added */}
      <main
        ref={boardRef}
        className="board"
        data-active-column={activeColumn}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {COLUMN_DEFS.map(({ key, title }) => (
          <Column key={key} title={title} tasks={tasksByStatus[key]} />
        ))}
      </main>
    </>
  )
}

export default Board