import React from 'react'

const Loader = ({ fullScreen = false, size = 'md', message = 'Loading...', type = 'spinner' }) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin text-emerald-500 ${sizes[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && <p className="mt-3 text-gray-600">{message}</p>}
    </div>
  )

  const Dots = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="flex space-x-2">
        <div className={`${sizes[size]} bg-emerald-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${sizes[size]} bg-emerald-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${sizes[size]} bg-emerald-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
      </div>
      {message && <p className="mt-3 text-gray-600">{message}</p>}
    </div>
  )

  const Skeleton = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} bg-gray-200 rounded-full animate-pulse`} />
      {message && (
        <div className="mt-3 h-4 w-32 bg-gray-200 rounded animate-pulse" />
      )}
    </div>
  )

  const LoaderContent = () => {
    switch (type) {
      case 'dots':
        return <Dots />
      case 'skeleton':
        return <Skeleton />
      case 'spinner':
      default:
        return <Spinner />
    }
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <LoaderContent />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoaderContent />
    </div>
  )
}

export default Loader