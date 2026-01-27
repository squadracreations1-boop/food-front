import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login, clearAuthError } from '../../../actions/userActions'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import { FcGoogle, } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { LogIn } from 'lucide-react'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { isAuthenticated, loading, error } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)

  const from = location.state?.from?.pathname || '/'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      // dispatch(clearAuthError()) → provided externally
      clearAuthError(dispatch)
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await dispatch(login(formData))
      navigate(from, { replace: true })
      toast.success('Login successful')
    } catch (error) {
      toast.error(error)
    }
  }



  return (
    <PageWrapper

      className="max-w-md mx-auto"
    >
      <div className="bg-gray-200 rounded-xl border shadow-xl border-gray-400 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">
              <LogIn size={25} strokeWidth={2} color='green' />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>

        </div>





        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter Your gmail ..."
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            showPasswordToggle={true}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>

            <Link
              to="/password/forgot"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => toast.info('Google login coming soon')}
            >
              <div className="flex items-center justify-center gap-2">
                <span><FcGoogle size={20} strokeWidth={1.5} color='black' /></span>
                Google
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => toast.info('Facebook login coming soon')}
            >
              <div className="flex items-center justify-center gap-2">
                <span><FaFacebookF size={20} strokeWidth={1.5} color='blue' /></span>
                Facebook
              </div>
            </Button>
          </div>
        </div>

        {/* Sign up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Login