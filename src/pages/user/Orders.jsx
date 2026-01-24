import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { userOrders } from '../../actions/orderActions'
import { EmptyOrders } from '../../components/feedback/EmptyState'
import Loader from '../../components/feedback/Loader'
import { getImageUrl } from '../../utils/urlHelpers'
import Button from '../../components/common/Button'
import PageWrapper from '../../components/layout/PageWrapper'

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
  if (method === 'RAZORPAY') return 'Paid Online'
  if (method === 'WHATSAPP_RAZORPAY') return 'Paid via WhatsApp'
  return method || 'N/A'
}

const Orders = () => {
  const dispatch = useDispatch()
  // Fix: Access state.order (not state.orders) and userOrders array
  const { userOrders: orders = [], loading, error } = useSelector(state => state.order)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(userOrders())
    }
  }, [dispatch, user])

  if (loading) {
    return (
      <PageWrapper title="My Orders" description="Your order history">
        <div className="min-h-screen flex items-center justify-center">
          <Loader message="Loading your orders..." />
        </div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper title="My Orders" description="Your order history">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load orders</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(userOrders())}>Try Again</Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="My Orders" description="Track and manage your purchases">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Orders Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>

          <Link to="/products">
            <Button variant="primary">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              // Fix: Use orderStatus instead of status
              const status = formatOrderStatus(order.orderStatus)
              const itemCount = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0

              return (
                <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id?.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.textColor}`}>
                            {status.icon} {status.label}
                          </span>
                          {/* Payment Status Badge */}
                          {order.paymentInfo?.status === 'PAID' && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              💳 Paid
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ₹{order.totalPrice?.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.orderItems?.slice(0, 2).map((item, index) => (
                        <div key={item._id || item.product || index} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-product.jpg'
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} • ₹{item.price?.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}

                      {order.orderItems && order.orderItems.length > 2 && (
                        <div className="text-center pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            +{order.orderItems.length - 2} more item{order.orderItems.length - 2 !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {getPaymentMethodDisplay(order.paymentInfo)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.deliveredAt
                            ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}`
                            : 'Expected delivery: 3-5 business days'
                          }
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Link to={`/order/${order._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>

                        {order.orderStatus === 'Delivered' && (
                          <Link to="/products">
                            <Button variant="primary" size="sm">
                              Buy Again
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {orders.filter(o => o.orderStatus === 'Delivered').length}
              </div>
              <div className="text-emerald-800 font-medium">Delivered Orders</div>
            </div>

            <div className="bg-amber-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length}
              </div>
              <div className="text-amber-800 font-medium">Active Orders</div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
              </div>
              <div className="text-blue-800 font-medium">Total Spent</div>
            </div>
          </div>
        )}

        {/* Need Help Section */}
        {orders.length > 0 && (
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">📱</span>
                  </div>
                  <h4 className="font-medium text-gray-900">WhatsApp Support</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Chat with us on WhatsApp for quick help
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">🚚</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Track Your Order</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Get real-time updates on your delivery
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">🔄</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Easy Returns</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Hassle-free returns within 7 days
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default Orders
