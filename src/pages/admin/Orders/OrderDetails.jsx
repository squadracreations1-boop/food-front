import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { adminOrderDetail, adminOrders, updateOrder } from '../../../actions/orderActions'
import { formatOrderStatus } from '../../../utils/formatters'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Modal from '../../../components/common/Model'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../../utils/urlHelpers';
import ConfirmationModal from '../../../components/feedback/ConfirmationModal';

const OrderDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { orderDetail: order = null, loading } = useSelector(state => state.order || {})



  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingInfo, setTrackingInfo] = useState({
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
  })
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })

  // Load specific order using admin endpoint
  useEffect(() => {
    if (id) {
      dispatch(adminOrderDetail(id))
    }
  }, [id, dispatch])

  // Initialize data when order is found
  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus)
      setTrackingInfo({
        carrier: order.trackingCarrier || '',
        trackingNumber: order.trackingNumber || '',
        estimatedDelivery: order.estimatedDelivery || '',
      })
    }
  }, [order])

  const handleStatusUpdate = async () => {
    if (!order) return

    try {
      // dispatch(updateOrder(order._id, { 
      //   status: newStatus,
      //   ...trackingInfo 
      // })) → provided externally
      await dispatch(updateOrder(order._id, {
        orderStatus: newStatus,
        ...trackingInfo,
      }))
      toast.success('Order status updated successfully!')
      setShowStatusModal(false)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Loader message="Loading order details..." />
      </div>
    )
  }

  if (!order) {
    return (
      <PageWrapper
        title="Order Not Found"
        description="The requested order could not be found"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h3>
          <p className="text-gray-600 mb-8">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/orders')}>
            ← Back to Orders
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const status = formatOrderStatus(order.orderStatus)
  const subtotal = order.itemsPrice || 0
  const shipping = order.shippingPrice || 0
  const tax = order.taxPrice || 0
  const total = order.totalPrice || 0

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.bgColor} ${status.textColor}`}>
                {status.icon} {status.label}
              </span>
            </div>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(true)}
            >
              Update Status
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Print Invoice
            </Button>
            <Button onClick={() => navigate('/admin/orders')}>
              ← Back to Orders
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong className="text-gray-900">Name:</strong> {order.user?.name}
                  </p>
                  <p>
                    <strong className="text-gray-900">Email:</strong> {order.user?.email}
                  </p>
                  <p>
                    <strong className="text-gray-900">Phone:</strong> {order.shippingInfo?.phoneNo || 'N/A'}
                  </p>
                  <p>
                    <strong className="text-gray-900">Customer ID:</strong> {order.user?._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                <div className="space-y-2 text-gray-600">
                  <p>{order.shippingInfo?.address}</p>
                  <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}</p>
                  <p>{order.shippingInfo?.country}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to={`/admin/user/${order.user?._id}`}>
                <Button variant="outline" size="sm">
                  View Customer Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>

            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div key={item._id || index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/admin/product/${item.product}`} className="font-medium text-gray-900 hover:text-emerald-600">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          SKU: {item._id?.slice(-8).toUpperCase() || 'N/A'}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ₹{item.price?.toFixed(2)} × {item.quantity}
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Link to={`/admin/product/${item.product}/edit`}>
                        <Button variant="ghost" size="xs">
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
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
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Notes & History</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Internal Note
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  rows="3"
                  placeholder="Add a note about this order..."
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm">Save Note</Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order History</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mr-3">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {order.updatedAt && order.updatedAt !== order.createdAt && (
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Actions & Timeline */}
        <div className="lg:col-span-1 space-y-8">
          {/* Order Status Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>

            <div className="space-y-6">
              {[
                { status: 'Order Placed', date: order.createdAt, active: true },
                { status: 'Payment Confirmed', date: order.paidAt, active: order.paidAt },
                { status: 'Processing', date: order.processingAt, active: order.processingAt },
                { status: 'Shipped', date: order.shippedAt, active: order.shippedAt },
                { status: 'Delivered', date: order.deliveredAt, active: order.deliveredAt },
              ].map((step, index) => (
                <div key={step.status} className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                    ${step.active ? 'bg-emerald-500' : 'bg-gray-200'}
                  `}>
                    {step.active ? (
                      <span className="text-white text-xs">✓</span>
                    ) : (
                      <span className="text-gray-400 text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.status}
                    </p>
                    {step.date && (
                      <p className="text-sm text-gray-500">
                        {new Date(step.date).toLocaleDateString('en-US', {
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

          {/* Payment Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Information</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit Card'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-medium ${order.paidAt ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                  {order.paidAt ? 'Paid' : 'Pending'}
                </span>
              </div>

              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid On</span>
                  <span className="font-medium">
                    {new Date(order.paidAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="text-lg font-bold text-gray-900 text-right">
                  ₹{total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier
                </label>
                <Input
                  type="text"
                  value={trackingInfo.carrier}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                  placeholder="e.g., UPS, FedEx, USPS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <Input
                  type="text"
                  value={trackingInfo.trackingNumber}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery
                </label>
                <Input
                  type="date"
                  value={trackingInfo.estimatedDelivery}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, estimatedDelivery: e.target.value })}
                />
              </div>

              <Button
                fullWidth
                onClick={() => {
                  // Save tracking info
                  toast.success('Tracking information updated')
                }}
              >
                Update Shipping Info
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>

            <div className="space-y-3">
              <Button variant="outline" fullWidth>
                Send Invoice Email
              </Button>
              <Button variant="outline" fullWidth>
                Contact Customer
              </Button>
              <Button variant="outline" fullWidth>
                Create Return
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setConfirmModal({
                  isOpen: true,
                  title: 'Cancel Order',
                  message: 'Are you sure you want to cancel this order? This action cannot be undone.',
                  confirmText: 'Cancel Order',
                  isDangerous: true,
                  onConfirm: async () => {
                    try {
                      await dispatch(updateOrder(order._id, { orderStatus: 'Cancelled' }))
                      toast.success('Order cancelled successfully')
                    } catch (err) {
                      toast.error('Failed to cancel order')
                    }
                  }
                })}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {newStatus === 'Shipped' && (
            <div className="space-y-4">
              <Input
                label="Carrier"
                value={trackingInfo.carrier}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                placeholder="e.g., UPS, FedEx, USPS"
              />

              <Input
                label="Tracking Number"
                value={trackingInfo.trackingNumber}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                placeholder="Enter tracking number"
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button
              fullWidth
              onClick={handleStatusUpdate}
            >
              Update Status
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        isDangerous={confirmModal.isDangerous}
      />
    </div >
  )
}

export default OrderDetails