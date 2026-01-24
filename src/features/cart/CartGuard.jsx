import React, { useEffect } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { routes } from '../../routes/routeConfig'
import { EmptyCart } from '../../components/feedback/EmptyState'
import Loader from '../../components/feedback/Loader'
import { 
  getCart
} from '../../actions/cartActions';

const CartGuard = () => {
  const location = useLocation()
  const { items , loading,dbSynced } = useSelector(state => state.cart || {})
  const { isAuthenticated } = useSelector(state => state.auth)
const safeItems = Array.isArray(items) ? items : [];
const dispatch = useDispatch();
useEffect(() => {
  if (isAuthenticated && !dbSynced && !loading) {
    dispatch(getCart());
  }
}, [isAuthenticated, dbSynced, loading, dispatch]);
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={routes.login} state={{ from: location }} replace />
  }

  // Show loading state
  if (loading) {
    return <Loader message="Loading cart..." />
  }

  // Check if cart is empty
  if (safeItems.length === 0) {
    return (
      <div className="container py-12">
        <EmptyCart />
      </div>
    )
  }

  return <Outlet />
}

export default CartGuard