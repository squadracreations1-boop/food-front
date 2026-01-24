import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, register, logout, updateProfile, updatePassword } from '../actions/userActions'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, loading, error } = useSelector(state => state.auth)

  const handleLogin = async (email, password) => {
    try {
      await dispatch(login({ email, password }))
      toast.success('Logged in successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData))
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'Registration failed')
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout())
      toast.success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
      throw error
    }
  }

  const handleUpdateProfile = async (profileData) => {
    try {
      await dispatch(updateProfile(profileData))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
      throw error
    }
  }

  const handleUpdatePassword = async (passwordData) => {
    try {
      await dispatch(updatePassword(passwordData))
      toast.success('Password updated successfully!')
    } catch (error) {
      toast.error('Failed to update password')
      throw error
    }
  }

  return {
    // State
    isAuthenticated,
    user,
    loading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,

    // Derived state
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  }
}