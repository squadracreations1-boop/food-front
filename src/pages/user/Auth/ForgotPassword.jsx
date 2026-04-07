import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { forgotPassword, clearAuthError } from '../../../actions/userActions'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    try {
      // dispatch(forgotPassword({ email })) → provided externally
      await dispatch(forgotPassword({ email }))
      toast.success('Password reset email sent! Check your inbox.')
      setSubmitted(true)
    } catch (error) {
      // Error is handled by Redux action
    }
  }

  return (
    <PageWrapper
      title="Forgot Password"
      description="Reset your account password"
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-gray-600 mt-2">
            {submitted
              ? 'Check your email for reset instructions'
              : "Enter your email and we'll send you a link to reset your password"
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
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">
              Check Your Email
            </h3>
            <p className="text-emerald-800 mb-4">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <div className="text-sm text-emerald-700 space-y-2">
              <p>• Check your spam folder if you don't see the email</p>
              <p>• The link will expire in 1 hour</p>
              <p>• Contact support if you need further assistance</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              helperText="Enter the email address associated with your account"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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

        {/* Need Help */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">❓</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Need help?</p>
              <p className="text-sm text-gray-600">
                Contact our support team at support@organicstore.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default ForgotPassword