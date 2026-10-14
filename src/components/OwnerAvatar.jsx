import Tooltip from './Tooltip'

const TONE_COUNT = 6

function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Same name always maps to the same colour. A tiny hash means
// nothing needs to be stored.
function getTone(name) {
  let hash = 0
  for (const char of name.trim().toLowerCase()) {
    hash = (hash * 31 + char.codePointAt(0)) >>> 0
  }
  return hash % TONE_COUNT
}

function OwnerAvatar({ owner }) {
  if (!owner || !owner.trim()) return null

  return (
    <Tooltip label={owner}>
      <span
        className={`owner-avatar owner-avatar--tone-${getTone(owner)}`}
        aria-label={`Assigned to ${owner}`}
      >
        {getInitials(owner)}
      </span>
    </Tooltip>
  )
}

export default OwnerAvatar