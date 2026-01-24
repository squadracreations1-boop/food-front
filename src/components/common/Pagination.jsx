import React from 'react'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageRange = 2,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
}) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const start = Math.max(2, currentPage - pageRange)
    const end = Math.min(totalPages - 1, currentPage + pageRange)

    // Always show first page
    pages.push(1)

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Go to first page"
        >
          «
        </button>
      )}

      {/* Previous Page */}
      {showPrevNext && currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Go to previous page"
        >
          ‹
        </button>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg border transition-colors
            ${page === currentPage
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
            ${page === '...' ? 'cursor-default' : 'cursor-pointer'}
          `}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next Page */}
      {showPrevNext && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Go to next page"
        >
          ›
        </button>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Go to last page"
        >
          »
        </button>
      )}
    </div>
  )
}

export default Pagination