import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register, clearAuthError } from '../../../actions/userActions'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import { Leaf } from 'lucide-react'
import { FcGoogle, } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, loading, error } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

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

    // Clear field error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeToTerms) {
      errors.terms = 'You must agree to the terms and conditions'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Please fix the form errors')
      return
    }

    const userData = new FormData()
    userData.append('name', formData.name)
    userData.append('email', formData.email)
    userData.append('password', formData.password)

    try {
      // dispatch(register(userData)) → provided externally
      await dispatch(register(userData))
      toast.success('Registration successful! Welcome to OrganicStore!')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error('Registration Failed! Please try again later.')

    }
  }

  return (
    <PageWrapper
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gray-200 rounded-xl border border-gray-400 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-200 rounded-full flex items-center justify-center">
            <span className="text-2xl"><Leaf size={25} strokeWidth={2} color='green' /></span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>

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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
              placeholder="Enter Your Name ..."
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              placeholder="Enter Your Email ..."
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
              placeholder="Create a password"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              helperText="Minimum 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
              placeholder="Confirm your password"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>

          {/* Password Strength Suggestions */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Password Strength (Optional)</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className={`flex items-center ${formData.password.length >= 6 ? 'text-emerald-600' : ''}`}>
                <span className="mr-2">{formData.password.length >= 6 ? '✓' : '○'}</span>
                At least 6 characters (Required)
              </li>
              <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
                Lowercase letter
              </li>
              <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                Uppercase letter
              </li>
              <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
                Number
              </li>
              <li className={`flex items-center ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                <span className="mr-2">{/(?=.*[@$!%*?&])/.test(formData.password) ? '✓' : '○'}</span>
                Special character
              </li>
            </ul>
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700">
                  Privacy Policy
                </a>
                . I understand that my data will be used in accordance with these documents.
              </span>
            </label>
            {formErrors.terms && (
              <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
        </div>

        {/* Social Sign Up */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => toast.info('Google sign up coming soon')}
          >
            <div className="flex items-center justify-center gap-2">
              <span><FcGoogle size={25} strokeWidth={2.5} color='green' /></span>
              Google
            </div>
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => toast.info('Facebook sign up coming soon')}
          >
            <div className="flex items-center justify-center gap-2">
              <span><FaFacebookF size={25} strokeWidth={2.5} color='blue' /></span>
              Facebook
            </div>
          </Button>
        </div>

        {/* Sign in Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Membership Benefits */}
      {/* <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Why join OrganicStore?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-emerald-50 rounded-xl">
            <div className="w-12 h-12 mb-4 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎁</span>
            </div>
            <h4 className="font-semibold text-emerald-900 mb-2">Welcome Offer</h4>
            <p className="text-sm text-emerald-800">
              Get 20% off your first order
            </p>
          </div>

          <div className="p-6 bg-emerald-50 rounded-xl">
            <div className="w-12 h-12 mb-4 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🚚</span>
            </div>
            <h4 className="font-semibold text-emerald-900 mb-2">Free Delivery</h4>
            <p className="text-sm text-emerald-800">
              Free shipping on orders over $50
            </p>
          </div>

          <div className="p-6 bg-emerald-50 rounded-xl">
            <div className="w-12 h-12 mb-4 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <h4 className="font-semibold text-emerald-900 mb-2">Member Rewards</h4>
            <p className="text-sm text-emerald-800">
              Earn points on every purchase
            </p>
          </div>
        </div>
      </div> */}
    </PageWrapper>
  )
}

export default Register