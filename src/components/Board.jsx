import Column from './Column'

function Board() {
  return (
    <section className="board">
      <Column title="Todo" status="todo" />
      <Column title="In Progress" status="in-progress" />
      <Column title="Done" status="done" />
    </section>
  )
}
export default Board