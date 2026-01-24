import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { resetPassword, clearAuthError } from '../../../actions/userActions'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  useEffect(() => {
    // Check if token is present
    if (!token) {
      setTokenValid(false)
      toast.error('Invalid or missing reset token')
    }

    return () => {
      dispatch(clearAuthError())
    }
  }, [token, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    try {
      await dispatch(resetPassword(formData, token))
      toast.success('Password reset successfully!')
      setSubmitted(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
    }
  }

  if (!tokenValid) {
    return (
      <PageWrapper title="Invalid Token" description="Password reset token is invalid">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h3>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new reset link.
            </p>
            <Link to="/password/forgot">
              <Button>Request New Reset Link</Button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      title="Reset Password"
      description="Create a new password for your account"
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {submitted
              ? 'Password reset successful! Redirecting to login...'
              : 'Create a new password for your account'
            }
          </p>
        </div>

        {/* Error Display */}
        {error && !submitted && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 p-6 bg-emerald-50 rounded-lg text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">
              Password Reset Successful!
            </h3>
            <p className="text-emerald-800">
              Your password has been updated. Redirecting to login...
            </p>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              helperText="At least 8 characters with uppercase, lowercase, number, and special character"
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            {/* Password Requirements */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Password Requirements</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-emerald-600' : ''}`}>
                  <span className="mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                  <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
                  One number
                </li>
                <li className={`flex items-center ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-emerald-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[@$!%*?&])/.test(formData.password) ? '✓' : '○'}</span>
                  One special character (@$!%*?&)
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔒</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Security Note</p>
              <p className="text-sm text-blue-800">
                For security reasons, this reset link will expire after 1 hour and can only be used once.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default ResetPassword