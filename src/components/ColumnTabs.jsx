function ColumnTabs({ columns, active, onSelect }) {
  return (
    <nav className="column-tabs" aria-label="Board columns">
      {columns.map(({ key, title, count }) => {
        const isActive = active === key

        return (
          <button
            key={key}
            type="button"
            data-column={key}
            className={`column-tab ${isActive ? 'column-tab--active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`${title}, ${count} ${count === 1 ? 'task' : 'tasks'}`}
            onClick={() => onSelect(key)}
          >
            <span className="column-tab__label">{title}</span>
            <span className="column-tab__count" aria-hidden="true">{count}</span>
          </button>
        )
      })}
    </nav>
  )
}
export default ColumnTabs