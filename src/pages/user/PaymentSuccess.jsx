import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/common/Button'
import Loader from '../../components/feedback/Loader'
import PageWrapper from '../../components/layout/PageWrapper'
import { clearCartAction } from '../../actions/cartActions'
import { verifyPaymentLink } from '../../actions/checkoutActions'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const verificationAttempted = useRef(false)
  
  const [status, setStatus] = useState('loading') // loading, verifying, success, error
  const [orderDetails, setOrderDetails] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const { currentOrder } = useSelector(state => state.checkout)

  useEffect(() => {
    // Prevent double verification
    if (verificationAttempted.current) return
    verificationAttempted.current = true

    const verifyPayment = async () => {
      // Get URL params from Razorpay redirect
      const razorpayPaymentId = searchParams.get('razorpay_payment_id')
      const razorpayPaymentLinkId = searchParams.get('razorpay_payment_link_id')
      const razorpayPaymentLinkStatus = searchParams.get('razorpay_payment_link_status')

      // Case 1: Redirected from Razorpay Payment Link (WhatsApp flow)
      if (razorpayPaymentId && razorpayPaymentLinkId) {
        setStatus('verifying')
        
        try {
          const result = await dispatch(verifyPaymentLink({
            razorpay_payment_id: razorpayPaymentId,
            razorpay_payment_link_id: razorpayPaymentLinkId,
            razorpay_payment_link_status: razorpayPaymentLinkStatus
          }))

          if (result?.success && result?.order) {
            setOrderDetails(result.order)
            setStatus('success')
            dispatch(clearCartAction())
          } else {
            // Payment was made but verification had issue - still show success
            // The webhook will update the status
            setOrderDetails({
              _id: razorpayPaymentLinkId,
              totalPrice: 0,
              paymentInfo: {
                razorpayPaymentId: razorpayPaymentId,
                status: razorpayPaymentLinkStatus === 'paid' ? 'PAID' : 'PENDING'
              }
            })
            setStatus('success')
            dispatch(clearCartAction())
          }
        } catch (error) {
          console.error('Verification error:', error)
          // Still show success - webhook will handle update
          setOrderDetails({
            _id: razorpayPaymentLinkId,
            paymentInfo: { razorpayPaymentId }
          })
          setStatus('success')
          dispatch(clearCartAction())
        }
        return
      }

      // Case 2: Came from direct Razorpay (via navigate with state)
      if (currentOrder) {
        setOrderDetails(currentOrder)
        setStatus('success')
        dispatch(clearCartAction())
        return
      }

      // Case 3: No payment info found
      setStatus('error')
      setErrorMessage('No payment information found')
    }

    verifyPayment()
  }, [searchParams, currentOrder, dispatch])

  // Loading/Verifying State
  if (status === 'loading' || status === 'verifying') {
    return (
      <PageWrapper title="Processing Payment" description="Please wait...">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {status === 'verifying' ? 'Verifying Payment...' : 'Loading...'}
            </h2>
            <p className="text-gray-500 text-sm">Please don't close this page</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Error State
  if (status === 'error') {
    return (
      <PageWrapper title="Payment Status" description="Check your payment">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Status Unknown</h1>
            <p className="text-gray-600 mb-6">
              If you completed the payment, your order will be confirmed shortly. 
              Please check your orders page.
            </p>
            
            <div className="space-y-3">
              <Button fullWidth onClick={() => navigate('/orders')}>
                Check My Orders
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Success State - Clean Flipkart/Amazon style
  const orderId = orderDetails?._id || ''
  const displayOrderId = orderId.length > 8 ? orderId.slice(-8).toUpperCase() : orderId
  const paymentId = orderDetails?.paymentInfo?.razorpayPaymentId || searchParams.get('razorpay_payment_id') || ''
  const displayPaymentId = paymentId.length > 10 ? paymentId.slice(-10).toUpperCase() : paymentId
  const totalAmount = orderDetails?.totalPrice || 0

  return (
    <PageWrapper title="Order Confirmed" description="Thank you for your order">
      <div className="min-h-screen bg-gray-50">
        {/* Success Header */}
        <div className="bg-emerald-600 text-white py-8 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-emerald-100">Thank you for shopping with Maitrey Foods</p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="max-w-lg mx-auto px-4 -mt-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Order Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">Order ID</span>
                <span className="font-mono font-bold text-gray-900">#{displayOrderId}</span>
              </div>
              
              {displayPaymentId && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">Payment ID</span>
                  <span className="font-mono text-sm text-gray-700">{displayPaymentId}</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">Payment Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Paid
                </span>
              </div>

              {totalAmount > 0 && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-gray-700 font-medium">Amount Paid</span>
                  <span className="text-xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-3">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-600">You'll receive order confirmation on WhatsApp</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-600">We'll prepare and ship your order within 24 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-600">Expected delivery: 3-5 business days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 space-y-3">
              <Button fullWidth onClick={() => navigate('/orders')}>
                View My Orders
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center py-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Maitrey Foods</span>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default PaymentSuccess
