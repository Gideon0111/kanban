function OwnerAvatar({ owner }) {
  if (!owner || !owner.trim()) return null

  const initials = owner
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span className="owner-avatar" title={owner} aria-label={`Assigned to ${owner}`}>
      {initials}
    </span>
  )
}

export default OwnerAvatar