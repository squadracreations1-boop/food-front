import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../routes/routeConfig'

function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const userLinks = [
    { name: 'Dashboard', path: routes.profile, icon: '📊' },
    { name: 'My Orders', path: routes.orders, icon: '📦' },
    { name: 'My Addresses', path: `${routes.profile}?tab=address`, icon: '📍' },
    { name: 'Wishlist', path: `${routes.profile}?tab=wishlist`, icon: '❤️' },
    { name: 'Security', path: `${routes.profile}?tab=security`, icon: '🛡️' },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static top-0 left-0 z-30
        w-64 h-screen bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">My Account</h2>
          <p className="text-gray-600 text-sm mt-1">Manage your profile & orders</p>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {userLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${(link.path.includes('?')
                      ? (location.pathname + location.search) === link.path
                      : location.pathname === link.path && !location.search
                    )
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-emerald-800 font-medium">Need Help?</p>
            <p className="text-emerald-600 text-sm mt-1">Contact our support team</p>
            <a
              href="mailto:support@organicstore.com"
              className="inline-block mt-2 text-emerald-500 hover:text-emerald-600 font-medium"
            >
              Get Help →
            </a>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar