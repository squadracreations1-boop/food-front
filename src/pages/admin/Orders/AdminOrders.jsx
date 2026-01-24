import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { adminOrders, updateOrder, deleteOrder } from '../../../actions/orderActions'
import { clearOrderUpdated, clearOrderDeleted } from '../../../slices/orderSlice'
import OrderTable from '../../../components/admin/OrderTable'
import { EmptyOrders } from '../../../components/feedback/EmptyState'
import Loader from '../../../components/feedback/Loader'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Pagination from '../../../components/common/Pagination'
import { useDebounce } from '../../../hooks/useDebounce'
import Modal from '../../../components/common/Model'
import toast from 'react-hot-toast'
import PageWrapper from '../../../components/layout/PageWrapper'
import { LoaderIcon, Truck, CheckCircle2, XCircle, TrendingUp, BarChart3, PackageCheck, Clock, Boxes, RefreshCcw } from 'lucide-react'



const AdminOrders = () => {
  const dispatch = useDispatch()
  const { adminOrders: orders = [], loading, totalPages: backendTotalPages = 1, totalOrders: backendTotalOrders = 0, isOrderUpdated, isOrderDeleted } = useSelector(state => state.order || {})

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [filteredOrders, setFilteredOrders] = useState([])
  const debouncedSearch = useDebounce(searchTerm, 400)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = backendTotalPages

  // Selection for bulk actions
  const [selectedOrders, setSelectedOrders] = useState(new Set())

  // Action state
  const [actionLoading, setActionLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)

  // Load orders on page change
  useEffect(() => {
    dispatch(adminOrders(currentPage, itemsPerPage))
  }, [dispatch, currentPage, itemsPerPage])

  // Handle updates and deletes
  useEffect(() => {
    if (isOrderUpdated) {
      dispatch(adminOrders(currentPage, itemsPerPage));
      dispatch(clearOrderUpdated());
    }

    if (isOrderDeleted) {
      dispatch(adminOrders(currentPage, itemsPerPage));
      dispatch(clearOrderDeleted());
    }
  }, [dispatch, isOrderUpdated, isOrderDeleted, currentPage, itemsPerPage]);

  // Apply filters
  useEffect(() => {
    // Since we're using server-side pagination, we'll apply simple filters on current page
    let result = [...orders]

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(order =>
        (order._id || '').toLowerCase().includes(q) ||
        (order.user?.name || '').toLowerCase().includes(q) ||
        (order.user?.email || '').toLowerCase().includes(q) ||
        (order.shippingInfo?.phone || '').toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.orderStatus === statusFilter)
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)

      result = result.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startDate && orderDate <= endDate
      })
    }

    // Don't re-sort since backend already sorts by date descending
    setFilteredOrders(result)
    setSelectedOrders(new Set()) // Clear selections when filters change
  }, [orders, debouncedSearch, statusFilter, dateRange])

  // Use filtered orders directly since server provides paginated data
  // Client-side filtering happens on the backend data
  const paginatedOrders = filteredOrders.length > 0 ? filteredOrders : orders

  const onToggleSelect = (id) => {
    setSelectedOrders(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  const onToggleSelectAll = () => {
    const pageIds = paginatedOrders.map(o => o._id)
    const allSelected = pageIds.every(id => selectedOrders.has(id))
    setSelectedOrders(prev => {
      const s = new Set(prev)
      if (allSelected) {
        pageIds.forEach(id => s.delete(id))
      } else {
        pageIds.forEach(id => s.add(id))
      }
      return s
    })
  }

  const handleStatusUpdate = async (orderId, status) => {
    setActionLoading(true)
    try {
      await dispatch(updateOrder(orderId, { orderStatus: status }))
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId)
    setShowDeleteModal(true)
  }

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return
    setActionLoading(true)
    try {
      await dispatch(deleteOrder(orderToDelete))
      toast.success('Order deleted')
      setShowDeleteModal(false)
      setOrderToDelete(null)
    } catch (error) {
      toast.error('Failed to delete order')
    } finally {
      setActionLoading(false)
    }
  }

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  if (loading) {
    return (
      <div className="p-6">
        <Loader message="Loading orders..." />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
            <p className="text-gray-600">
              Page {currentPage} of {totalPages} • {paginatedOrders.length} order{paginatedOrders.length !== 1 ? 's' : ''} on this page • {backendTotalOrders} total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(adminOrders(currentPage, itemsPerPage))}
            >
              <RefreshCcw size={16} strokeWidth={1.5} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><TrendingUp size={20} strokeWidth={1.5} color='green' /></span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {backendTotalOrders}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><PackageCheck size={20} strokeWidth={1.5} color='blue' /></span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-amber-600">
                {pendingOrders}
              </div>
              <div className="text-sm text-gray-600">Pending Orders</div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><Clock size={20} strokeWidth={1.5} color='orange' /></span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                ₹{avgOrderValue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Avg. Order Value</div>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><BarChart3 size={20} strokeWidth={1.5} color='purple' /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <Input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                placeholder="End Date"
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(dateRange.start || dateRange.end) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Date: {dateRange.start || 'Start'} to {dateRange.end || 'End'}
                    <button
                      onClick={() => setDateRange({ start: '', end: '' })}
                      className="ml-1 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setDateRange({ start: '', end: '' })
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <OrderTable
            orders={paginatedOrders}
            loading={loading || actionLoading}
            onStatusUpdate={handleStatusUpdate}
            onDeleteOrder={handleDeleteOrder}
            selectedIds={selectedOrders}
            onToggleSelect={onToggleSelect}
            onToggleSelectAll={onToggleSelectAll}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </>
      )}

      {/* Order Summary */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {filteredOrders.length}
              </div>
              <div className="text-sm text-emerald-800">Filtered Orders</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredOrders.filter(o => o.orderStatus === 'Delivered').length}
              </div>
              <div className="text-sm text-blue-800">Completed</div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {filteredOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length}
              </div>
              <div className="text-sm text-amber-800">In Progress</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-purple-800">Filtered Revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setOrderToDelete(null) }}
        title="Delete Order"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this order?</h3>
            <p className="text-gray-600">This action cannot be undone. The order will be removed from records.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="danger" fullWidth onClick={confirmDeleteOrder} disabled={actionLoading}>
              {actionLoading ? 'Deleting...' : 'Delete Order'}
            </Button>
            <Button variant="outline" fullWidth onClick={() => { setShowDeleteModal(false); setOrderToDelete(null) }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Actions */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ⚡ Bulk Actions
              {selectedOrders.size > 0 && (
                <span className="ml-2 text-emerald-600 text-sm font-normal">
                  ({selectedOrders.size} selected)
                </span>
              )}
            </h3>
            {selectedOrders.size > 0 && (
              <button
                onClick={() => setSelectedOrders(new Set())}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedOrders.size > 0 ? (
              <>
                <div className="flex gap-2 col-span-1 md:col-span-2 lg:col-span-1">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs px-2"
                    onClick={async () => {
                      const ids = [...selectedOrders]
                      setActionLoading(true)
                      try {
                        await Promise.all(ids.map(id => dispatch(updateOrder(id, { paymentInfo: { status: 'PAID' } }))))
                        toast.success(`${ids.length} order(s) marked as PAID`)
                        setSelectedOrders(new Set())
                        dispatch(adminOrders())
                      } catch (err) {
                        toast.error('Failed to update orders')
                      } finally {
                        setActionLoading(false)
                      }
                    }}
                    disabled={actionLoading}
                  >
                    <span>💳</span> Paid
                  </Button>
                  <Button
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-xs px-2"
                    onClick={async () => {
                      const ids = [...selectedOrders]
                      setActionLoading(true)
                      try {
                        await Promise.all(ids.map(id => dispatch(updateOrder(id, { paymentInfo: { status: 'PENDING' } }))))
                        toast.success(`${ids.length} order(s) marked as UNPAID`)
                        setSelectedOrders(new Set())
                        dispatch(adminOrders())
                      } catch (err) {
                        toast.error('Failed to update orders')
                      } finally {
                        setActionLoading(false)
                      }
                    }}
                    disabled={actionLoading}
                  >
                    <span>⏳</span> Unpaid
                  </Button>
                </div>

                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={async () => {
                    const ids = [...selectedOrders]
                    setActionLoading(true)
                    try {
                      await Promise.all(ids.map(id => dispatch(updateOrder(id, { orderStatus: 'Processing' }))))
                      toast.success(`${ids.length} order(s) marked as Processing`)
                      setSelectedOrders(new Set())
                      dispatch(adminOrders())
                    } catch (err) {
                      toast.error('Failed to update orders')
                    } finally {
                      setActionLoading(false)
                    }
                  }}
                  disabled={actionLoading}
                ><div className='flex gap-2'>
                    <LoaderIcon size={20} strokeWidth={1.5} /> Mark Processing
                  </div></Button>

                <Button
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={async () => {
                    const ids = [...selectedOrders]
                    setActionLoading(true)
                    try {
                      await Promise.all(ids.map(id => dispatch(updateOrder(id, { orderStatus: 'Shipped' }))))
                      toast.success(`${ids.length} order(s) marked as Shipped`)
                      setSelectedOrders(new Set())
                      dispatch(adminOrders())
                    } catch (err) {
                      toast.error('Failed to update orders')
                    } finally {
                      setActionLoading(false)
                    }
                  }}
                  disabled={actionLoading}
                >
                  <div className='flex gap-2'>
                    <Truck size={20} strokeWidth={1.5} /> Mark Shipped
                  </div>
                </Button>

                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={async () => {
                    const ids = [...selectedOrders]
                    setActionLoading(true)
                    try {
                      await Promise.all(ids.map(id => dispatch(updateOrder(id, { orderStatus: 'Delivered' }))))
                      toast.success(`${ids.length} order(s) marked as Delivered`)
                      setSelectedOrders(new Set())
                      dispatch(adminOrders())
                    } catch (err) {
                      toast.error('Failed to update orders')
                    } finally {
                      setActionLoading(false)
                    }
                  }}
                  disabled={actionLoading}
                >
                  <div className="flex gap-2">
                    <CheckCircle2 size={20} strokeWidth={1.5} /> Mark Delivered
                  </div>
                </Button>

                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={async () => {
                    const ids = [...selectedOrders]
                    setActionLoading(true)
                    try {
                      await Promise.all(ids.map(id => dispatch(updateOrder(id, { orderStatus: 'Cancelled' }))))
                      toast.success(`${ids.length} order(s) cancelled`)
                      setSelectedOrders(new Set())
                      dispatch(adminOrders())
                    } catch (err) {
                      toast.error('Failed to cancel orders')
                    } finally {
                      setActionLoading(false)
                    }
                  }}
                  disabled={actionLoading}
                >
                  <div className="flex gap-2">
                    <XCircle size={20} strokeWidth={1.5} /> Cancel Orders
                  </div>
                </Button>
              </>
            ) : (
              <div className="col-span-full p-4 text-center text-gray-500 bg-white rounded-lg">
                <p>Select orders from the table to perform bulk actions</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between text-sm text-gray-600">
            <div>
              {selectedOrders.size > 0 ? (
                <span className="font-medium">
                  {selectedOrders.size} of {filteredOrders.length} order(s) selected
                </span>
              ) : (
                <span>Select multiple orders using checkboxes to manage them in bulk</span>
              )}
            </div>
            <div>
              Showing {filteredOrders.length} of {orders.length} total orders
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders