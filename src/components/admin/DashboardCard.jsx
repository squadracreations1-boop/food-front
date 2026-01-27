import React from 'react'
import { TrendingUp, BarChart3, Users, PackageCheck, Boxes } from 'lucide-react';

const DashboardCard = React.memo(({
  title,
  value,
  icon,
  trend = null,
  subtitle = '',
  color = 'emerald',
  onClick,
  loading = false
}) => {
  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
  }

  const iconColors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  }

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 p-6
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-emerald-200' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          )}

          {subtitle && !loading && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}

          {trend && !loading && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${trendColors[trend.type]}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500">
                {trend.period === 'month' ? 'from last month' : 'from last week'}
              </span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 rounded-lg ${iconColors[color]} flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>

      {/* Progress bar for some cards */}
      {trend && trend.type === 'up' && !loading && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(trend.value, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
})

// Pre-configured dashboard cards
export const RevenueCard = ({ value, trend, loading }) => (
  <DashboardCard
    title="Total Revenue"
    value={`₹${value?.toLocaleString() || '0'}`}
    icon={<TrendingUp />}
    color="emerald"
    trend={trend}
    subtitle="Last 30 days"
    loading={loading}
  />
)

export const OrdersCard = ({ value, trend, loading }) => (
  <DashboardCard
    title="Total Orders"
    value={value?.toLocaleString() || '0'}
    icon={<PackageCheck />}
    color="blue"
    trend={trend}
    subtitle="Processed orders"
    loading={loading}
  />
)

export const UsersCard = ({ value, trend, loading }) => (
  <DashboardCard
    title="Active Users"
    value={value?.toLocaleString() || '0'}
    icon={<Users />}
    color="purple"
    trend={trend}
    subtitle="Registered customers"
    loading={loading}
  />
)

export const ProductsCard = ({ value, trend, loading }) => (
  <DashboardCard
    title="Products"
    value={value?.toLocaleString() || '0'}
    icon={<Boxes />}
    color="amber"
    trend={trend}
    subtitle="Active listings"
    loading={loading}
  />
)

export default DashboardCard