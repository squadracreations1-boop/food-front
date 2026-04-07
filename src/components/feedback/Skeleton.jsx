import React from 'react'

const Skeleton = ({ type = 'text', count = 1, width, height, className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'

  const skeletons = {
    text: (
      <div className={`${baseClasses} h-4 ${className}`} style={{ width: width || '100%' }} />
    ),
    circle: (
      <div className={`${baseClasses} rounded-full ${className}`} style={{ width: width || height, height: height || width }} />
    ),
    rectangle: (
      <div className={`${baseClasses} ${className}`} style={{ width: width || '100%', height: height || '200px' }} />
    ),
    card: (
      <div className={`${baseClasses} rounded-lg ${className}`} style={{ width: width || '100%', height: height || '300px' }} />
    ),
    avatar: (
      <div className={`${baseClasses} rounded-full w-12 h-12 ${className}`} />
    ),
    button: (
      <div className={`${baseClasses} rounded-lg h-10 w-24 ${className}`} />
    ),
    input: (
      <div className={`${baseClasses} rounded-lg h-12 ${className}`} style={{ width: width || '100%' }} />
    ),
  }

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {React.cloneElement(skeletons[type], { key: index })}
          </div>
        ))}
      </div>
    )
  }

  return skeletons[type]
}

// Specific skeleton components
export const ProductCardSkeleton = ({ count = 1 }) => {
  if (count > 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <Skeleton type="rectangle" height="200px" className="mb-4" />
            <Skeleton type="text" width="70%" className="mb-2" />
            <Skeleton type="text" width="50%" className="mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton type="text" width="30%" />
              <Skeleton type="button" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <Skeleton type="rectangle" height="200px" className="mb-4" />
      <Skeleton type="text" width="70%" className="mb-2" />
      <Skeleton type="text" width="50%" className="mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton type="text" width="30%" />
        <Skeleton type="button" />
      </div>
    </div>
  )
}

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} type="text" width="100%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} type="text" width="100%" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Skeleton