import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { routes } from '../../routes/routeConfig'
import Loader from '../../components/feedback/Loader'
import { AccessDenied } from '../../components/feedback/ErrorFallback'

const RequireAdmin = () => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth)
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen message="Checking permissions..." />
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={routes.login} state={{ from: location }} replace />
  }

  // If authenticated but not admin, show access denied
  if (user?.role !== 'admin') {
    return <AccessDenied />
  }

  return <Outlet/>
}

export default RequireAdmin