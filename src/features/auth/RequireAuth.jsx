import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { routes } from '../../routes/routeConfig'
import Loader from '../../components/feedback/Loader'

const RequireAuth = () => {
  const { isAuthenticated, loading } = useSelector(
    state => state.auth
  )
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen message="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={routes.login}
        state={{ from: location }}
        replace
      />
    )
  }

  return <Outlet />
}

export default RequireAuth
