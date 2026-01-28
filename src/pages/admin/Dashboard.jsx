import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
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
  const navigate = useNavigate()
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader message="Loading dashboard data..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">System Control</h1>
            <p className="text-gray-500 mt-1 md:text-lg">
              Welcome back, <span className="text-emerald-600 font-bold">{user?.name}</span>. Here's what's happening today.
            </p>

            <form
              className="mt-6 max-w-xl relative group"
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.target.search.value;
                if (q) navigate(`/admin/products?search=${encodeURIComponent(q)}`);
              }}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 group-focus-within:text-emerald-500 transition-colors">🔍</span>
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search inventory..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 border border-gray-200 rounded-lg bg-white">Enter</kbd>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 animate-pulse-slow">
                ⚡
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest leading-none mb-1">Infrastructure</p>
                <p className="text-sm font-bold text-emerald-800 leading-none">Healthy & Active</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full -mr-48 -mt-48 opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100 rounded-full -ml-32 -mb-32 opacity-20 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <RevenueCard
          value={stats.revenue}
          trend={{ type: 'up', value: 12.4, period: 'month' }}
          loading={loading}
        />
        <OrdersCard
          value={stats.orders}
          trend={{ type: 'up', value: 8.2, period: 'month' }}
          loading={loading}
        />
        <UsersCard
          value={stats.users}
          trend={{ type: 'up', value: 15.6, period: 'month' }}
          loading={loading}
        />
        <ProductsCard
          value={stats.products}
          trend={{ type: 'neutral', value: 0, period: 'month' }}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-sm">🛒</span>
              Recent Orders
            </h3>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className='group text-emerald-600 hover:text-emerald-700 font-bold'>
                View All <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {recentOrders.length > 0 ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 font-inter">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => {
                        const statusStyles = {
                          'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                          'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
                          'Processing': 'bg-blue-50 text-blue-700 border-blue-100',
                          'default': 'bg-gray-50 text-gray-700 border-gray-100'
                        }
                        const statusClass = statusStyles[order.orderStatus] || statusStyles.default

                        return (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/admin/order/${order._id}`} className="text-emerald-600 font-bold hover:underline text-sm">
                                #{order._id?.slice(-8).toUpperCase()}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px] uppercase border border-emerald-100">
                                  {order.user?.name?.charAt(0) || 'C'}
                                </div>
                                <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                                  {order.user?.name || 'Customer'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              ₹{order.totalPrice?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${statusClass}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <Link key={order._id} to={`/admin/order/${order._id}`} className="block p-4 active:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-600">#{order._id?.slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{order.user?.name || 'Customer'}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{order.orderStatus}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
                <p className="text-gray-500 font-medium font-bold uppercase tracking-widest text-[10px]">No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Masalas Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-sm">🌶️</span>
              <span className="bg-white px-2 py-0.5 rounded-md">Featured Masalas</span>
            </h3>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm" className='text-emerald-600 hover:text-emerald-700 font-bold'>
                View All
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
            {topProducts.length > 0 ? (
              <div className="space-y-1">
                {topProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/admin/product/${product._id}/edit`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 group-hover:border-emerald-200 transition-colors">
                      <img
                        src={getImageUrl(product.images?.[0]?.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${product.stock < 10 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                          STOCK: {product.stock}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">• {product.numOfReviews || 0} reviews</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">₹{product.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📊</div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No products listed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operation Center */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h3 className="text-xl font-bold text-gray-900">Operation Center</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { to: "/admin/product/new", icon: <PlusSquare size={24} />, label: "Catalog", sub: "Add Product", color: "emerald" },
            { to: "/admin/orders", icon: <ClipboardList size={24} />, label: "Fullfillment", sub: "Manage Orders", color: "blue" },
            { to: "/admin/users", icon: <Users size={24} />, label: "Customers", sub: "Manage Users", color: "purple" },
            { to: "/", icon: <Store size={24} />, label: "Live Store", sub: "Frontend", color: "amber" }
          ].map((action, i) => (
            <Link key={i} to={action.to} className="group">
              <div className={`bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm group-hover:shadow-md group-hover:border-${action.color}-200 transition-all duration-300 transform group-hover:-translate-y-1`}>
                <div className={`w-14 h-14 mx-auto mb-4 bg-${action.color}-50 text-${action.color}-600 rounded-xl flex items-center justify-center group-hover:bg-${action.color}-500 group-hover:text-white transition-colors shadow-inner`}>
                  {action.icon}
                </div>
                <h4 className="font-bold text-gray-900 text-sm md:text-base uppercase tracking-tight">{action.label}</h4>
                <p className={`text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest group-hover:text-${action.color}-600 transition-colors`}>{action.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard