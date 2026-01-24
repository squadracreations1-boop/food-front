import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  createWhatsAppRazorpayOrder,
  createDirectRazorpayOrder,
  createCODOrder,
  verifyPayment,
  createWhatsAppOrder
} from '../../actions/checkoutActions'
import { saveShippingInfoAction } from '../../actions/cartActions'
import { userOrders, orderDetail } from '../../actions/orderActions'
import OrderSummary from '../../components/ecommerce/OrderSummary'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Model'
import Loader from '../../components/feedback/Loader'
import PageWrapper from '../../components/layout/PageWrapper'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

// Payment methods configuration
const PAYMENT_METHODS = {
  WHATSAPP: {
    id: 'WHATSAPP',
    name: 'Order via WhatsApp',
    description: 'Place your order and send details to us on WhatsApp',
    icon: '📱'
  },
  RAZORPAY: {
    id: 'RAZORPAY',
    name: 'Direct Razorpay',
    description: 'Currently Unavailable',
    icon: '💳',
    disabled: true
  },
  // COD: {
  //   id: 'COD',
  //   name: 'Cash on Delivery',
  //   description: 'Pay when your order arrives',
  //   icon: '💵'
  // }
}

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get cart data
  const {
    items: cartItems = [],
    cartTotal = 0,
    cartCount = 0,
    clearCart,
    shippingInfo: savedShippingInfo
  } = useCart()

  // Redux state
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const { loading: checkoutLoading, currentOrder, success: checkoutSuccess } = useSelector(state => state.checkout)
  const { order } = useSelector(state => state.order)
  const location = useLocation()

  // Redirect to login if trying to access checkout directly without auth
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
    }
  }, [isAuthenticated, navigate, location])

  // Local state
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('WHATSAPP')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmSentModal, setConfirmSentModal] = useState(false)
  const [processingOrder, setProcessingOrder] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState(null)
  const [orderCreationError, setOrderCreationError] = useState('')
  const [whatsappURL, setWhatsappURL] = useState(null)
  const [paymentLink, setPaymentLink] = useState(null)
  const [createdOrder, setCreatedOrder] = useState(null)
  const whatsappRef = useRef(null)

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
  })

  // Environment variables
  const whatsappPhoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '918220857924'
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Ry8eVpIkR34dQK'

  // Calculate shipping cost
  const calculateShippingCost = useCallback((subtotal) => {
    if (subtotal >= 1500) return 120
    if (subtotal >= 1000) return 100
    if (subtotal >= 500) return 90
    if (subtotal >= 100) return 80
    return 0
  }, [])

  // Memoized price calculations
  const { subtotal, shipping, tax, total } = useMemo(() => {
    const subtotalVal = cartTotal || 0
    const shippingVal = calculateShippingCost(subtotalVal)
    const taxVal = subtotalVal * 0.08
    const totalVal = subtotalVal + shippingVal + taxVal

    return {
      subtotal: subtotalVal,
      shipping: shippingVal,
      tax: taxVal,
      total: totalVal
    }
  }, [cartTotal, calculateShippingCost])

  // Initialize form with saved data or user data
  useEffect(() => {
    if (savedShippingInfo && Object.keys(savedShippingInfo).length > 0) {
      setShippingAddress(prev => ({
        ...prev,
        address: savedShippingInfo.address || prev.address,
        city: savedShippingInfo.city || prev.city,
        state: savedShippingInfo.state || prev.state,
        country: savedShippingInfo.country || prev.country,
        // Map backend keys (pinCode, phoneNo) to frontend state (zipCode, phone)
        zipCode: savedShippingInfo.pinCode || savedShippingInfo.zipCode || prev.zipCode,
        phone: savedShippingInfo.phoneNo || savedShippingInfo.phone || prev.phone
      }))
    } else if (user) {
      setShippingAddress(prev => ({
        ...prev,
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        phone: user.phone || '',
        country: user.country || 'India'
      }))
    }
  }, [user, savedShippingInfo])

  // Fetch order details when on confirmation step
  useEffect(() => {
    if (step === 3 && createdOrderId) {
      dispatch(orderDetail(createdOrderId))
      dispatch(userOrders())
    }
  }, [step, createdOrderId, dispatch])

  // Prepare order data
  const prepareOrderData = () => ({
    shippingAddress: { ...shippingAddress },
    items: cartItems.map(item => ({
      product: item.product || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '/default-product.jpg',
    })),
    itemsPrice: subtotal,
    taxPrice: tax,
    shippingPrice: shipping,
    totalPrice: total,
  })

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Open WhatsApp with order details
  const openWhatsApp = (url) => {
    const whatsappLink = url || whatsappURL
    if (whatsappLink) {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer')
    } else {
      toast.error('WhatsApp link not available')
    }
  }

  // Open Razorpay payment modal
  const openRazorpayPayment = async (orderData, razorpayOrder) => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay. Please check your connection.')
      setProcessingOrder(false)
      return
    }

    const options = {
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Maitrey Foods',
      description: `Order #${orderData._id?.toString().slice(-8).toUpperCase()}`,
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const verifyResult = await dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: orderData // Pass full order data for creation
          }))

          if (verifyResult?.success) {
            toast.success('Payment successful!')

            // Clear cart now that payment is verified and order is created
            clearCart()

            // Open WhatsApp (if we have a prepared WhatsApp url, OR if it came from verification)
            try {
              // Priority: URL from verification response > Ref > State
              const waUrl = verifyResult.whatsappMessage?.whatsappURL || whatsappRef.current

              // Only open if method is WHATSAPP_RAZORPAY
              if (paymentMethod === 'WHATSAPP_RAZORPAY' && waUrl) {
                window.open(waUrl, '_blank', 'noopener,noreferrer')
              }
            } catch (err) {
              // ignore open failures
            }

            navigate('/payment-success', {
              state: {
                orderDetails: verifyResult.order,
                orderId: verifyResult.order._id,
                paymentId: response.razorpay_payment_id,
                paymentMethod: paymentMethod // Pass current method
              }
            })
            setProcessingOrder(false)
          } else {
            toast.error(verifyResult?.message || 'Payment verification failed')
            setProcessingOrder(false)
          }
        } catch (error) {
          console.error('Payment verification error:', error)
          toast.error('Payment verification failed. Please contact support.')
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: shippingAddress.phone
      },
      theme: {
        color: '#059669'
      },
      modal: {
        ondismiss: () => {
          toast('Payment cancelled. You can retry from your orders.', { icon: '⚠️' })
          setProcessingOrder(false)
        }
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Razorpay error:', error)
      toast.error('Failed to open payment gateway')
      setProcessingOrder(false)
    }
  }

  // Main order creation handler
  const handleCreateOrder = async () => {
    setProcessingOrder(true)
    setOrderCreationError('')
    setWhatsappURL(null)
    setPaymentLink(null)

    const orderData = prepareOrderData()

    try {
      let result

      if (paymentMethod === 'WHATSAPP') {
        result = await dispatch(createWhatsAppOrder(orderData))
      } else if (paymentMethod === 'WHATSAPP_RAZORPAY' || paymentMethod === 'RAZORPAY') {
        // Both methods now use the same Direct Razorpay initiation flow (No DB order created yet)
        result = await dispatch(createDirectRazorpayOrder(orderData))
      } else if (paymentMethod === 'COD') {
        result = await dispatch(createCODOrder(orderData))
      }

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to create order')
      }

      const orderResponse = result

      // Store order details
      if (orderResponse.order?._id) {
        setCreatedOrderId(orderResponse.order._id)
        setCreatedOrder(orderResponse.order)
      }

      // Store WhatsApp URL and payment link
      if (orderResponse.whatsappMessage?.whatsappURL) {
        setWhatsappURL(orderResponse.whatsappMessage.whatsappURL)
        whatsappRef.current = orderResponse.whatsappMessage.whatsappURL
      }

      if (paymentMethod === 'WHATSAPP') {
        toast.success('Order initiated! Opening WhatsApp...')
        // Note: Success state and Cart clearing moved to confirmation modal

        // Smart WhatsApp Redirect
        if (orderResponse.whatsappMessage?.whatsappURL) {
          const waUrl = orderResponse.whatsappMessage.whatsappURL
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

          // Use raw message and phone from response to avoid parsing issues
          const phone = orderResponse.whatsappMessage.whatsappBusinessNumber || whatsappPhoneNumber
          const text = orderResponse.whatsappMessage.message

          if (isMobile) {
            // Direct App Open
            window.location.href = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`
          } else {
            // Desktop: Try to open via Protocol Handler (Desktop App)
            // This attempts to open the installed app "directly" without the landing page.
            // If not installed, it does nothing (browser may prompt).
            window.location.href = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`
          }
        }

        // Show confirmation modal
        setConfirmSentModal(true)
      } else if (paymentMethod === 'COD') {
        setStep(3)
        setShowSuccessModal(true)
        toast.success('COD order placed successfully!')

        // Clear cart ONLY for COD
        clearCart()

        // Immediately open WhatsApp for COD confirmation
        try {
          if (orderResponse.whatsappMessage?.whatsappURL) {
            openWhatsApp(orderResponse.whatsappMessage.whatsappURL)
          } else if (whatsappRef.current) {
            openWhatsApp(whatsappRef.current)
          }
        } catch (err) {
          // ignore
        }
      } else if (paymentMethod === 'WHATSAPP_RAZORPAY' || paymentMethod === 'RAZORPAY') {
        toast.success('Opening payment gateway...')

        // Open Razorpay modal immediately
        if (orderResponse.razorpayOrder) {
          openRazorpayPayment(orderData, orderResponse.razorpayOrder)
        }
      }

    } catch (error) {
      console.error('Order creation error:', error)
      const errorMsg = error.message || 'Order creation failed'
      setOrderCreationError(errorMsg)
      toast.error(errorMsg)
    } finally {
      if (paymentMethod !== 'RAZORPAY') {
        setProcessingOrder(false)
      }
    }
  }

  // Validate and proceed to payment step
  const handleProceedToPayment = () => {
    if (!shippingAddress.address.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.zipCode.trim() ||
      !shippingAddress.phone.trim()) {
      toast.error('Please fill in all required address fields')
      return
    }

    // Address validation: Min 8 chars AND must contain a space or comma to prevent single-word gibberish
    if (shippingAddress.address.trim().length < 8 || (!shippingAddress.address.trim().includes(' ') && !shippingAddress.address.trim().includes(','))) {
      toast.error('Please enter a complete address (min 8 chars, e.g. House No, Street Name)')
      return
    }

    // City/State validation: Min 3 chars
    if (shippingAddress.city.trim().length < 3 || shippingAddress.state.trim().length < 3) {
      toast.error('Please enter valid City and State names')
      return
    }

    // PIN Code validation: Exactly 6 digits, cannot start with 0
    if (!/^[1-9]\d{5}$/.test(shippingAddress.zipCode)) {
      toast.error('Please enter a valid 6-digit PIN Code')
      return
    }

    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = shippingAddress.phone.replace(/\D/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit Indian phone number')
      return
    }

    // Save shipping info to persistence layer (Convert to backend expectation)
    const backendShippingInfo = {
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country,
      pinCode: shippingAddress.zipCode, // Map zipCode -> pinCode
      phoneNo: shippingAddress.phone    // Map phone -> phoneNo
    }
    dispatch(saveShippingInfoAction(backendShippingInfo))

    setStep(2)
  }

  // Handle address input change
  const handleAddressChange = (field) => (e) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  // Get safe cart items for display
  const safeCartItems = useMemo(() => {
    return cartItems.map(item => ({
      ...item,
      name: item.name || 'Product',
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: item.image || '/default-product.jpg'
    }))
  }, [cartItems])

  // Redirect if cart is empty
  if (cartItems.length === 0 && step === 1) {
    return (
      <PageWrapper title="Checkout" description="Complete your order">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to checkout</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Checkout" description="Complete your order">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Confirmation' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center ${step >= s.num ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s.num ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="ml-2 font-medium hidden sm:inline">{s.label}</span>
              </div>
              {idx < 2 && (
                <div className={`w-16 sm:w-24 h-1 mx-2 ${step > s.num ? 'bg-emerald-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

                <div className="space-y-4">
                  <Input
                    label="Phone Number *"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange('phone')}
                    placeholder="Enter 10-digit phone number"
                  />

                  <Input
                    label="Address *"
                    value={shippingAddress.address}
                    onChange={handleAddressChange('address')}
                    placeholder="House no, Street, Area"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City *"
                      value={shippingAddress.city}
                      onChange={handleAddressChange('city')}
                      placeholder="City"
                    />
                    <Input
                      label="State"
                      value={shippingAddress.state}
                      onChange={handleAddressChange('state')}
                      placeholder="State"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="PIN Code *"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange('zipCode')}
                      placeholder="PIN Code"
                    />
                    <Input
                      label="Country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange('country')}
                      placeholder="Country"
                      disabled
                    />
                  </div>
                </div>

                <Button
                  fullWidth
                  className="mt-6"
                  onClick={handleProceedToPayment}
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Payment Method Selection */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

                <div className="space-y-4 mb-6">
                  {Object.values(PAYMENT_METHODS).map((method) => (
                    <div
                      key={method.id}
                      onClick={() => !method.disabled && setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-xl transition-all ${method.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'cursor-pointer'} ${!method.disabled && paymentMethod === method.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : !method.disabled ? 'border-gray-200 hover:border-gray-300' : ''
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{method.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-gray-300'
                          }`}>
                          {paymentMethod === method.id && (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment method specific info */}
                {paymentMethod === 'WHATSAPP' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-green-900 mb-2">How it works:</h4>
                    <ol className="text-sm text-green-800 space-y-1">
                      <li>1. Click "Place Order" to submit your order</li>
                      <li>2. WhatsApp will open automatically with your order details</li>
                      <li>3. Send the pre-filled message to us to verify and process your order</li>
                    </ol>
                  </div>
                )}

                {/* Legacy methods hidden/removed */}

                {orderCreationError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-800">{orderCreationError}</p>
                  </div>
                )}

                {/* Sticky Mobile Footer / Desktop Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 z-50">
                  <div className="flex gap-4 max-w-7xl mx-auto md:w-full">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      disabled={processingOrder}
                      className="flex-1 md:flex-none"
                    >
                      Back
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handleCreateOrder}
                      loading={processingOrder}
                      className="flex-[2] md:flex-1 shadow-lg md:shadow-none relative overflow-hidden group"
                    >
                      {!processingOrder && (
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-xl">🔒</span>
                          <span className="flex flex-col items-start leading-tight">
                            <span className="font-bold">
                              {paymentMethod === 'RAZORPAY' ? 'Pay Securely' : 'Place Order'}
                            </span>
                            <span className="text-xs opacity-90 font-mono">
                              ₹{total.toFixed(2)}
                            </span>
                          </span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mobile Spacer to prevent content from being hidden behind sticky footer */}
                <div className="h-24 md:hidden"></div>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Created!</h2>
                  <p className="text-gray-600">
                    Order ID: <span className="font-mono font-bold">#{createdOrderId?.slice(-8).toUpperCase()}</span>
                  </p>
                </div>

                {/* WhatsApp confirmation */}
                {paymentMethod === 'WHATSAPP' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-green-900 mb-3">Order Placed Successfully!</h3>
                      <p className="text-green-800 text-sm mb-2">
                        Your order has been recorded. To verify and process it, please send the order details on WhatsApp.
                      </p>
                      <p className="text-green-800 text-sm">
                        WhatsApp should have opened automatically. If not, click the button below.
                      </p>
                    </div>

                    <Button
                      fullWidth
                      onClick={() => openWhatsApp()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <span className="flex items-center justify-center gap-2">
                        📱 Open WhatsApp
                      </span>
                    </Button>
                  </div>
                )}

                {/* Legacy confirmation blocks hidden */}

                {/* Direct Razorpay confirmation */}
                {paymentMethod === 'RAZORPAY' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💳</span>
                      <div>
                        <h3 className="font-semibold text-blue-900">Payment in Progress</h3>
                        <p className="text-sm text-blue-800">
                          Complete the payment in the Razorpay window. If it closed, please check your orders.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD confirmation */}
                {paymentMethod === 'COD' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">📦</span>
                        <div>
                          <h3 className="font-semibold text-emerald-900">COD Order Confirmed!</h3>
                          <p className="text-sm text-emerald-800">
                            Your order will be delivered in 3-5 business days. Pay ₹{total.toFixed(2)} on delivery.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      fullWidth
                      onClick={() => openWhatsApp()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <span className="flex items-center justify-center gap-2">
                        📱 View Order on WhatsApp
                      </span>
                    </Button>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/orders')}
                  >
                    View My Orders
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={safeCartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              showItems={true}
            />

            {/* Shipping Address Preview (Step 2 & 3) */}
            {step >= 2 && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Shipping To</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state}</p>
                  <p>{shippingAddress.zipCode}, {shippingAddress.country}</p>
                  <p className="mt-2">📞 {shippingAddress.phone}</p>
                </div>
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-emerald-600 text-sm mt-3 hover:underline"
                  >
                    Edit Address
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Confirmation Modal */}
      <Modal
        isOpen={confirmSentModal}
        onClose={() => setConfirmSentModal(false)}
        size="md"
        preventClose={true}
        showCloseButton={false}
      >
        <div className="text-center py-8 px-4">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-full h-full bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <span className="text-5xl">📲</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Did you send the message?
          </h3>

          <p className="text-gray-600 mb-8 text-lg max-w-sm mx-auto leading-relaxed">
            We've opened WhatsApp with your order details. Please hit <span className="font-semibold text-green-700">Send</span> in WhatsApp to complete your order.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-2 sm:w-auto text-gray-600 hover:text-green-700 hover:border-green-200"
              onClick={() => {
                // Re-open WhatsApp if they missed it
                const waUrl = whatsappURL || createdOrder?.whatsappMessage?.whatsappURL || whatsappRef.current

                // If it's desktop, offer Web fallback logic
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

                if (waUrl) {
                  if (!isMobile) {
                    // Explicitly open Web on fallback logic
                    try {
                      const urlObj = new URL(waUrl)
                      const phone = urlObj.pathname.replace('/', '')
                      const text = urlObj.searchParams.get('text')
                      window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank')
                    } catch {
                      openWhatsApp(waUrl)
                    }
                  } else {
                    openWhatsApp(waUrl)
                  }
                }
              }}
            >
              Didn't open? Retry
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 sm:w-auto min-w-[160px] transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                setConfirmSentModal(false)
                setStep(3)
                clearCart() // CLEAR CART ONLY HERE
                toast.success('Order successfully placed!')
              }}
            >
              Yes, I Sent It
            </Button>
          </div>
        </div>
      </Modal>

      {/* COD Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/orders')
        }}
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">COD Order Placed!</h3>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed. Pay ₹{total.toFixed(2)} when it arrives.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-bold text-gray-900">#{createdOrderId?.slice(-8).toUpperCase()}</p>
          </div>

          <div className="flex gap-4">
            <Button
              fullWidth
              onClick={() => {
                setShowSuccessModal(false)
                navigate('/orders')
              }}
            >
              View Orders
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setShowSuccessModal(false)
                navigate('/')
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}

export default Checkout
