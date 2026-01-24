import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateOrder, deleteOrder } from '../../actions/orderActions'
import Button from '../common/Button'
import { orderStatus } from '../../routes/routeConfig'
import toast from 'react-hot-toast'
import { LoaderIcon, Truck, CheckCircle2, XCircle, TrendingUp, BarChart3, PackageCheck, Clock, Boxes, RefreshCcw, Eye, Trash2, Printer } from 'lucide-react'
import ConfirmationModal from '../feedback/ConfirmationModal'

const OrderTable = ({ orders = [], loading = false, onStatusUpdate, onDeleteOrder, selectedIds = new Set(), onToggleSelect, onToggleSelectAll }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmModal, setConfirmModal] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  });

  const handleRowKeyDown = (e, order) => {
    const row = e.currentTarget
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate(`/admin/order/${order._id}`)
      return
    }
    if (e.key === 'Delete') {
      e.preventDefault()
      if (onDeleteOrder) onDeleteOrder(order._id)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = row.nextElementSibling
      if (next) next.focus()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = row.previousElementSibling
      if (prev) prev.focus()
      return
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (onStatusUpdate) return onStatusUpdate(orderId, newStatus)
    try {
      await dispatch(updateOrder(orderId, { orderStatus: newStatus }))
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (onDeleteOrder) return onDeleteOrder(orderId)
    setConfirmModal({
      isOpen: true,
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.',
      confirmText: 'Delete Order',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await dispatch(deleteOrder(orderId))
          toast.success('Order deleted successfully')
        } catch (error) {
          toast.error('Failed to delete order')
        }
      }
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Delivered': return 'bg-emerald-100 text-emerald-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock />
      case 'Processing': return <LoaderIcon />
      case 'Shipped': return <Truck />
      case 'Delivered': return <CheckCircle2 />
      case 'Cancelled': return <XCircle />
      default: return <Boxes />
    }
  }

  const handlePrintAddress = (order) => {
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Address - Order #${order._id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .address-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; max-width: 400px; margin: 0 auto; }
              h2 { margin-top: 0; color: #333; }
              p { margin: 5px 0; color: #555; }
              .label { font-weight: bold; color: #333; }
            </style>
          </head>
          <body>
            <div class="address-card">
              <h2>Shipping Address</h2>
              <p><span class="label">Name:</span> ${order.user?.name || 'N/A'}</p>
              <p><span class="label">Address:</span> ${order.shippingInfo?.address || 'N/A'}</p>
              <p><span class="label">City:</span> ${order.shippingInfo?.city || 'N/A'}</p>
              <p><span class="label">State/Zip:</span> ${order.shippingInfo?.state || 'N/A'} - ${order.shippingInfo?.zipCode || 'N/A'}</p>
              <p><span class="label">Country:</span> ${order.shippingInfo?.country || 'N/A'}</p>
              <p><span class="label">Phone:</span> ${order.shippingInfo?.phoneNo || 'N/A'}</p>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-emerald-100 text-emerald-800'
      case 'COD_PENDING': return 'bg-amber-100 text-amber-800'
      case 'COD_COLLECTED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PENDING': return <Clock />
      case 'PAID': return <CheckCircle2 />
      case 'COD_PENDING': return <LoaderIcon />
      case 'COD_COLLECTED': return <PackageCheck />
      case 'FAILED': return <XCircle />
      default: return <RefreshCcw />
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Orders will appear here once customers make purchases.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="sr-only">Keyboard: use Arrow Up/Down to move rows, Enter to open, Delete to remove.</div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Orders table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all orders"
                  checked={orders.length > 0 && [...orders].every(o => selectedIds.has(o._id))}
                  onChange={() => onToggleSelectAll && onToggleSelectAll()}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>

              <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors"
                role="row"
                tabIndex={0}
                onKeyDown={(e) => handleRowKeyDown(e, order)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select order ${order._id}`}
                    checked={selectedIds.has(order._id)}
                    onChange={() => onToggleSelect && onToggleSelect(order._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/order/${order._id}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.user?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.user?.email || 'No email'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.shippingInfo?.phone || ''}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{order.totalPrice?.toFixed(2) || '0.00'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer hover:border-emerald-400 transition"
                      title="Update order status"
                    >
                      {Object.values(orderStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Link
                      to={`/admin/order/${order._id}`}
                      title="View order details"
                    >
                      <Button variant="ghost" size="xs">
                        <Eye size={16} strokeWidth={1.5} color='blue' /> View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handlePrintAddress(order)}
                      title="Print Address"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Printer size={16} strokeWidth={1.5} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete this order"
                    >
                      <Trash2 size={16} strokeWidth={1.5} color='red' /> Delete
                    </Button>
                  </div>
                </td>
                <td className="px-0 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)} {order.orderStatus}
                  </span>
                </td>
                <td className="px-0 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${getPaymentStatusColor(order.paymentInfo?.status)}`}>
                      {getPaymentStatusIcon(order.paymentInfo?.status)} {order.paymentInfo?.status || 'N/A'}
                    </span>
                    {order.paymentInfo?.status !== 'PAID' ? (
                      <button
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Mark Payment as PAID',
                            message: `Are you sure you want to mark order #${order._id.slice(-8).toUpperCase()} as PAID?`,
                            confirmText: 'Mark Paid',
                            onConfirm: async () => {
                              try {
                                await dispatch(updateOrder(order._id, { paymentInfo: { status: 'PAID' } }));
                                toast.success('Payment marked as PAID');
                              } catch (e) {
                                toast.error('Failed to update payment');
                              }
                            }
                          });
                        }}
                        className="text-[10px] text-emerald-600 underline hover:text-emerald-800 cursor-pointer ml-1"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Mark Payment as UNPAID',
                            message: `Are you sure you want to mark order #${order._id.slice(-8).toUpperCase()} as UNPAID (Pending)?`,
                            confirmText: 'Mark Unpaid',
                            isDangerous: true,
                            onConfirm: async () => {
                              try {
                                await dispatch(updateOrder(order._id, { paymentInfo: { status: 'PENDING' } }));
                                toast.success('Payment marked as UNPAID');
                              } catch (e) {
                                toast.error('Failed to update payment');
                              }
                            }
                          });
                        }}
                        className="text-[10px] text-amber-600 underline hover:text-amber-800 cursor-pointer ml-1"
                      >
                        Mark Unpaid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{orders.length}</span> orders
          </div>
          <div className="text-sm font-medium text-gray-900">
            Total Revenue: $
            {
              orders
                .filter(order =>
                  order.orderStatus?.toLowerCase() === "delivered" &&
                  order.paymentInfo?.status?.toLowerCase() === "paid"
                )
                .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)
                .toFixed(2)
            }

          </div>
        </div>
      </div>

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

export default OrderTable