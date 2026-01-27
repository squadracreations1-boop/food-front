import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAdminProducts } from '../../actions/productActions'
import { adminOrders } from '../../actions/orderActions'
import { getUsers } from '../../actions/userActions'
import { RevenueCard, OrdersCard, UsersCard, ProductsCard, } from '../../components/admin/DashboardCard'
import Loader from '../../components/feedback/Loader'
import Button from '../../components/common/Button'
import { ArrowRight, PlusSquare, Store, ClipboardList, Users } from 'lucide-react'
import { getImageUrl } from '../../utils/urlHelpers';

import { useMemo } from 'react'


const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { products = [], loading: productsLoading, productsCount } = useSelector(state => state.products)
  const { adminOrders: orders = [], loading: ordersLoading } = useSelector(state => state.order)
  const { users = [], loading: usersLoading } = useSelector(state => state.user)



  // Load data
  useEffect(() => {
    dispatch(getAdminProducts())
    dispatch(adminOrders())
    dispatch(getUsers())

  }, [dispatch])

  const revenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  }, [orders])

  const stats = useMemo(() => ({
    revenue,
    orders: orders.length,
    products: productsCount || 0,
    users: users.length,
  }), [revenue, orders.length, productsCount, users.length])

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5)
  }, [orders])

  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5)
  }, [products])


  const loading = productsLoading || ordersLoading || usersLoading

  if (loading) {
    return (
      <div className="p-8">
        <Loader message="Loading dashboard data..." />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 rounded-full">
              Last updated: Today
            </span>

          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <RevenueCard
          value={stats.revenue}
          trend={{ type: 'up', value: 12, period: 'month' }}
          loading={loading}
        />
        <OrdersCard
          value={stats.orders}
          trend={{ type: 'up', value: 8, period: 'month' }}
          loading={loading}
        />
        <UsersCard
          value={stats.users}
          trend={{ type: 'up', value: 15, period: 'month' }}
          loading={loading}
        />
        <ProductsCard
          value={stats.products}
          trend={{ type: 'up', value: 5, period: 'month' }}
          loading={loading}
        />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm" className='gap-1 hover:text-emerald-600'>
                  View All<ArrowRight size={18} strokeWidth={2} />
                </Button>
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => {
                      const statusColor = order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                      return (
                        <tr key={order._id}>
                          <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                            <Link to={`/admin/order/${order._id}`}>
                              #{order._id?.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.user?.name || 'Customer'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            ₹{order.totalPrice?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-gray-600">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 hover">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <Link to="/admin/products">
                <Button variant="ghost" size="sm" className='gap-1 hover:text-emerald-600'>
                  View All <ArrowRight size={18} strokeWidth={2} />
                </Button>
              </Link>
            </div>

            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden">
                      <img
                        src={getImageUrl(product.images?.[0]?.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <h4 className="text-sm font-medium text-gray-900 hover:text-emerald-600">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{product.price?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.numOfReviews || 0} reviews
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-600">No products yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/product/new">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"><PlusSquare size={20} strokeWidth={1.5} /></span>
              </div>
              <h4 className="font-medium text-gray-900">Add Product</h4>
              <p className="text-sm text-gray-600">Create new listing</p>
            </div>
          </Link>

          <Link to="/admin/orders">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"><ClipboardList size={20} strokeWidth={1.5} /></span>
              </div>
              <h4 className="font-medium text-gray-900">Manage Orders</h4>
              <p className="text-sm text-gray-600">Process & track</p>
            </div>
          </Link>

          <Link to="/admin/users">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"><Users size={20} strokeWidth={1.5} /></span>
              </div>
              <h4 className="font-medium text-gray-900">Users</h4>
              <p className="text-sm text-gray-600">Manage customers</p>
            </div>
          </Link>

          <Link to="/">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"><Store size={20} strokeWidth={1.5} /></span>
              </div>
              <h4 className="font-medium text-gray-900">Store Front</h4>
              <p className="text-sm text-gray-600">View store</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Store Performance */}
      {/* <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Store Performance</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {((stats.revenue / 10000) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Revenue Target</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min((stats.revenue / 10000) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {orders.length > 0 
                ? ((orders.filter(o => o.status === 'Delivered').length / orders.length) * 100).toFixed(0)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-600">Order Completion</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ 
                  width: `${orders.length > 0 
                    ? (orders.filter(o => o.status === 'Delivered').length / orders.length) * 100 
                    : 0
                  }%` 
                }}
              />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {users.length > 0 
                ? Math.round(stats.orders / users.length * 10) / 10
                : 0
              }
            </div>
            <div className="text-sm text-gray-600">Avg. Orders per Customer</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ 
                  width: `${users.length > 0 
                    ? Math.min((stats.orders / users.length) * 10, 100)
                    : 0
                  }%` 
                }}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard