import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { routes } from '../../routes/routeConfig'
import { logout } from '../../actions/userActions'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // dispatch(logout()) → provided externally
      await logout(dispatch)
      toast.success('Logged out successfully')
      navigate(routes.home)
    } catch (error) {
      toast.error('Failed to logout')
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
      ${isCollapsed ? 'w-20' : 'w-64'}
      bg-gradient-to-b from-gray-900 to-gray-800 text-white
      min-h-screen transition-all duration-300 flex flex-col
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : 'gap-3'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold">OrganicStore</h2>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-lg">
                {user.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-600 text-white rounded">
                Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-emerald-500 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
              
              {/* Sub-items */}
              {!isCollapsed && item.subItems && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.title}
                      to={subItem.path}
                      className={({ isActive }) => `
                        block px-4 py-2 text-sm rounded transition-colors
                        ${isActive 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
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
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <Button
            onClick={handleLogout}
            variant="danger"
            fullWidth
            size="sm"
          >
            🚪 Logout
          </Button>
        )}
        
        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full p-3 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
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