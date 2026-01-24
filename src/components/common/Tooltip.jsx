import React, { useState, useRef, useEffect } from 'react'

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 100,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({})
  const timeoutRef = useRef(null)
  const triggerRef = useRef(null)

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCoords({
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        })
      }
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getTooltipPosition = () => {
    const tooltipWidth = 200 // approximate width
    const tooltipHeight = 60 // approximate height
    const offset = 8

    switch (position) {
      case 'top':
        return {
          top: coords.top - tooltipHeight - offset,
          left: coords.left + coords.width / 2 - tooltipWidth / 2,
        }
      case 'bottom':
        return {
          top: coords.top + coords.height + offset,
          left: coords.left + coords.width / 2 - tooltipWidth / 2,
        }
      case 'left':
        return {
          top: coords.top + coords.height / 2 - tooltipHeight / 2,
          left: coords.left - tooltipWidth - offset,
        }
      case 'right':
        return {
          top: coords.top + coords.height / 2 - tooltipHeight / 2,
          left: coords.left + coords.width + offset,
        }
      default:
        return {
          top: coords.top - tooltipHeight - offset,
          left: coords.left + coords.width / 2 - tooltipWidth / 2,
        }
    }
  }

  const tooltipStyle = isVisible ? getTooltipPosition() : {}

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg"
          style={tooltipStyle}
          role="tooltip"
        >
          {content}
          {/* Tooltip arrow */}
          <div className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
            ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
            ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
            ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
          `} />
        </div>
      )}
    </div>
  )
}

export default Tooltip