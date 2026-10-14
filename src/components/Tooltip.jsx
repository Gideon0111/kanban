import { useId } from 'react'

function Tooltip({ label, children }) {
  const tooltipId = useId()

  return (
    <span className="tooltip-wrapper" tabIndex={0} aria-describedby={tooltipId}>
      {children}
      <span role="tooltip" id={tooltipId} className="tooltip-bubble">
        {label}
      </span>
    </span>
  )
}

export default Tooltip