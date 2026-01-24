import React from 'react'
import { useRouteError, useNavigate } from 'react-router-dom'
import Button from '../common/Button'

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  showDetails = false,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}) => {
  const routeError = useRouteError()
  const navigate = useNavigate()
  
  const actualError = error || routeError
  const errorMessage = actualError?.message || 'Unknown error'
  const errorStack = actualError?.stack

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    } else {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button onClick={handleRetry} variant="primary">
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            Go Home
          </Button>
        </div>

        {showDetails && actualError && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="font-medium text-red-800 mb-2">Error Details:</p>
            <p className="text-sm text-red-600 mb-2">{errorMessage}</p>
            {errorStack && (
              <details className="text-xs text-red-500">
                <summary className="cursor-pointer mb-2">Stack trace</summary>
                <pre className="overflow-auto max-h-40 p-2 bg-red-100 rounded">
                  {errorStack}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Pre-configured error components
export const Error404 = () => (
  <ErrorFallback
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved."
    showDetails={false}
  />
)

export const Error500 = () => (
  <ErrorFallback
    title="Server Error"
    message="Something went wrong on our end. We're working to fix it."
    showDetails={false}
  />
)

export const NetworkError = () => (
  <ErrorFallback
    title="Network Error"
    message="Please check your internet connection and try again."
    showDetails={false}
  />
)

export const AccessDenied = () => (
  <ErrorFallback
    title="Access Denied"
    message="You don't have permission to access this page."
    showDetails={false}
  />
)

export default ErrorFallback