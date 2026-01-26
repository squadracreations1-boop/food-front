
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import AppRoutes from '../routes/AppRoutes'
import { loadUser } from '../actions/userActions'
import { loadUserFail } from '../slices/authSlice'
import { getWishlist } from '../actions/wishlistActions'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Loader from '../components/feedback/Loader'
import CartAnimation from '../components/common/CartAnimation'

import MobileBottomNav from '../components/layout/MobileBottomNav'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector(state => state.auth)

  // Load user on initial mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token && !isAuthenticated) {
      dispatch(loadUser())
    } else if (!token && loading) {
      // If no token, stop showing the full-screen loader
      dispatch(loadUserFail())
    }
  }, [dispatch, isAuthenticated, loading])

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster
        position="bottom-right"
        containerClassName="toast-container"
        toastOptions={{
          duration: 3000,
          className: 'glass-toast',
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 24px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '400px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
            style: {
              borderLeft: '4px solid #10B981',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
        }}
      />

      <Header />
      <CartAnimation />

      {/* Add padding bottom on mobile to prevent content being hidden by nav */}
      <main className="flex-grow pb-16 md:pb-0">
        <AppRoutes />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default App