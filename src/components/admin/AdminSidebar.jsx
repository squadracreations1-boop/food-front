import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { routes } from '../../routes/routeConfig'
import { logout } from '../../actions/userActions'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const AdminSidebar = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout(dispatch)
      toast.success('Logged out successfully')
      navigate(routes.home)
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose()
    }
  }

  const menuItems = [
    {
      title: 'Dashboard',
      path: routes.admin.dashboard,
      icon: '📊',
      badge: null,
    },
    {
      title: 'Products',
      path: routes.admin.products,
      icon: '📦',
      badge: null,
      subItems: [
        { title: 'All Products', path: routes.admin.products },
        { title: 'Add New', path: routes.admin.addProduct },
      ]
    },
    {
      title: 'Orders',
      path: routes.admin.orders,
      icon: '🚚',
      badge: '12',
    },
    {
      title: 'Users',
      path: routes.admin.users,
      icon: '👥',
      badge: null,
    },
    {
      title: 'Store Front',
      path: routes.home,
      icon: '🏪',
      badge: null,
    },
  ]

  return (
    <aside className={`
      ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      w-64 bg-white text-gray-900 border-r border-gray-100
      h-full transition-all duration-300 flex flex-col shadow-xl lg:shadow-none
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:flex-col' : ''}`}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-lg">⚡</span>
            </div>
            {(!isCollapsed || window.innerWidth < 1024) && (
              <div>
                <h2 className="font-bold text-lg tracking-tight text-gray-900">Maitreyi</h2>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Admin Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 text-gray-400 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>

          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* User Info */}
      {(!isCollapsed || window.innerWidth < 1024) && user && (
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-lg">
                {user.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate font-medium">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-emerald-500 text-white rounded font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                onClick={handleLinkClick}
                end={item.path === routes.admin.dashboard}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                  }
                  ${isCollapsed ? 'lg:justify-center' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {(!isCollapsed || window.innerWidth < 1024) && (
                  <>
                    <span className="flex-1 font-bold text-sm tracking-tight">{item.title}</span>
                    {item.badge && (
                      <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>

              {/* Sub-items */}
              {(!isCollapsed || window.innerWidth < 1024) && item.subItems && (
                <div className="ml-4 mt-2 border-l-2 border-gray-50 pl-4 space-y-1">
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.title}
                      to={subItem.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) => `
                        block px-4 py-2 text-xs rounded-lg transition-all duration-200 font-bold uppercase tracking-widest
                        ${isActive
                          ? 'text-emerald-600 bg-emerald-50/50'
                          : 'text-gray-400 hover:text-emerald-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        {(!isCollapsed || window.innerWidth < 1024) && (
          <Button
            onClick={handleLogout}
            variant="danger"
            fullWidth
            size="sm"
            className="shadow-lg shadow-red-500/10 font-bold uppercase tracking-widest text-[10px] py-3"
          >
            🚪 Sign Out
          </Button>
        )}

        {isCollapsed && window.innerWidth >= 1024 && (
          <button
            onClick={handleLogout}
            className="w-full p-4 hover:bg-rose-50 text-rose-500 rounded-xl transition-all flex items-center justify-center shadow-inner"
            title="Logout"
          >
            🚪
          </button>
        )}
      </div>
    </aside>
  )
}

export default AdminSidebar