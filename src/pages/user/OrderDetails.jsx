import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { orderDetail } from '../../actions/orderActions'
import Button from '../../components/common/Button'
import Loader from '../../components/feedback/Loader'
import PageWrapper from '../../components/layout/PageWrapper'
import { getImageUrl } from '../../utils/urlHelpers';

// Helper function to format order status
const formatOrderStatus = (status) => {
  const statusMap = {
    'Pending': { label: 'Pending', icon: '⏳', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    'Processing': { label: 'Processing', icon: '📦', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    'Shipped': { label: 'Shipped', icon: '🚚', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    'Delivered': { label: 'Delivered', icon: '✅', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    'Cancelled': { label: 'Cancelled', icon: '❌', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  }
  return statusMap[status] || { label: status || 'Unknown', icon: '❓', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
}

// Helper function to get payment method display
const getPaymentMethodDisplay = (paymentInfo) => {
  if (!paymentInfo) return 'N/A'
  const method = paymentInfo.method
  if (method === 'COD') return 'Cash on Delivery'
  if (method === 'RAZORPAY') return 'Razorpay'
  if (method === 'WHATSAPP_RAZORPAY') return 'WhatsApp + Razorpay'
  return method || 'N/A'
}

// Helper function to get payment status display
const getPaymentStatusDisplay = (paymentInfo) => {
  if (!paymentInfo) return { label: 'Unknown', color: 'text-gray-600' }
  const status = paymentInfo.status
  if (status === 'PAID') return { label: 'Paid', color: 'text-green-600' }
  if (status === 'PENDING') return { label: 'Pending', color: 'text-yellow-600' }
  if (status === 'COD_PENDING') return { label: 'Pay on Delivery', color: 'text-blue-600' }
  if (status === 'FAILED') return { label: 'Failed', color: 'text-red-600' }
  return { label: status || 'Unknown', color: 'text-gray-600' }
}

const OrderDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  // Fix: Access state.order and orderDetail
  const { orderDetail: order = [], loading, error } = useSelector(state => state.order)

  useEffect(() => {
    if (id) {
      // Fix: Correct dispatch call
      dispatch(orderDetail(id))
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <PageWrapper title="Order Details" description="Loading order information...">
        <div className="min-h-screen flex items-center justify-center">
          <Loader message="Loading order details..." />
        </div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper title="Order Details" description="Error loading order">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load order</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link to="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!order || !order._id) {
    return (
      <PageWrapper title="Order Not Found" description="The requested order could not be found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h3>
            <p className="text-gray-600 mb-8">
              The order you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Fix: Use correct field names from backend
  const status = formatOrderStatus(order.orderStatus)
  const subtotal = order.itemsPrice || 0
  const shipping = order.shippingPrice || 0
  const tax = order.taxPrice || 0
  const total = order.totalPrice || 0
  const paymentStatus = getPaymentStatusDisplay(order.paymentInfo)

  // Fix: Backend uses shippingInfo, not shippingAddress
  const shippingInfo = order.shippingInfo || {}


  return (
    <PageWrapper title={`Order #${order._id?.slice(-8).toUpperCase()}`} description="View your order details">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.bgColor} ${status.textColor}`}>
                  {status.icon} {status.label}
                </span>
              </div>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/orders">
                <Button variant="outline">
                  ← Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>

              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={item._id || index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/default-product.jpg' }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product}`}>
                        <h4 className="font-medium text-gray-900 hover:text-emerald-600 truncate">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        ₹{item.price?.toFixed(2)} × {item.quantity}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping & Delivery</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>{shippingInfo.address || 'N/A'}</p>
                    <p>
                      {shippingInfo.city && `${shippingInfo.city}, `}
                      {shippingInfo.state && `${shippingInfo.state} `}
                      {shippingInfo.pinCode || shippingInfo.zipCode || ''}
                    </p>
                    <p>{shippingInfo.country || 'India'}</p>
                    {shippingInfo.phoneNo && <p>📞 {shippingInfo.phoneNo}</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Delivery Status</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="font-medium text-sm">{status.label}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: order.orderStatus === 'Delivered' ? '100%' :
                              order.orderStatus === 'Shipped' ? '75%' :
                                order.orderStatus === 'Processing' ? '50%' : '25%'
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        {order.orderStatus === 'Pending' && '⏳ Your order is being processed.'}
                        {order.orderStatus === 'Processing' && '📦 Your order is being prepared for shipment.'}
                        {order.orderStatus === 'Shipped' && '🚚 Your order has been shipped and is on its way.'}
                        {order.orderStatus === 'Delivered' && '✅ Your order has been delivered.'}
                        {order.orderStatus === 'Cancelled' && '❌ Your order has been cancelled.'}
                      </p>
                    </div>

                    {order.deliveredAt && (
                      <p className="text-sm text-green-600">
                        Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">{getPaymentMethodDisplay(order.paymentInfo)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${paymentStatus.color}`}>{paymentStatus.label}</span>
                </div>


                {order.paymentInfo?.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-xs">{order.paymentInfo.razorpayPaymentId.slice(-10).toUpperCase()}</span>
                  </div>
                )}

                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid On</span>
                    <span className="font-medium">{new Date(order.paidAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>

              <div className="space-y-4">
                {[
                  { label: 'Order Placed', date: order.createdAt, completed: true },
                  { label: 'Processing', date: order.orderStatus !== 'Pending' ? order.updatedAt : null, completed: ['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) },
                  { label: 'Shipped', date: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? order.updatedAt : null, completed: ['Shipped', 'Delivered'].includes(order.orderStatus) },
                  { label: 'Delivered', date: order.deliveredAt, completed: order.orderStatus === 'Delivered' },
                ].map((step, index) => (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}>
                      {step.completed ? (
                        <span className="text-white text-xs">✓</span>
                      ) : (
                        <span className="text-gray-400 text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.date && step.completed && (
                        <p className="text-xs text-gray-500">
                          {new Date(step.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📱</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Need Help?</p>
                  <p className="text-sm text-gray-600">Contact us on WhatsApp</p>
                </div>
              </div>
              <a
                href="https://wa.me/918220857924"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" size="sm" fullWidth>
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default OrderDetails
