import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { routes, navigation } from '../../routes/routeConfig'
import { logout } from '../../actions/userActions'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import Logo from "../../assets/Logo Png.png"
import { ShoppingBag, UserCircle, ClipboardList, LogOut, LogIn, UserPlus, Heart } from 'lucide-react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { items: cartItems } = useSelector(state => state.cart || { items: [] })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await dispatch(logout())
      toast.success('Logged out successfully')
      navigate(routes.home)
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const navLinks = isAuthenticated
    ? (user?.role === 'admin' ? navigation.admin : navigation.user)
    : navigation.public

  const cartItemCount = cartItems?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link to={routes.home} className="flex items-center space-x-3 group">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105 border border-emerald-100">
              <img src={Logo} alt="Maitreyi Foods" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-emerald-800 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                Maitreyi Foods
              </h1>
              <span className="hidden md:block text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                Fresh & Natural
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors relative group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Wishlist Icon */}
            {isAuthenticated && user?.role !== 'admin' && (
              <Link to="/wishlist" className="relative group p-2 text-gray-400 hover:text-rose-500 transition-colors">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-200 border border-gray-100 group-hover:border-rose-100">
                  <Heart size={20} strokeWidth={2} />
                </div>
              </Link>
            )}

            {/* Cart Icon */}
            {isAuthenticated && user?.role !== 'admin' && (
              <Link to={routes.cart} className="relative group hidden md:block">
                <div id="cart-icon-container" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-200 border border-gray-100 group-hover:border-emerald-100">
                  <ShoppingBag size={20} strokeWidth={2} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-sm ring-2 ring-white">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                  <svg className="hidden lg:block w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>


                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-3 border-b border-gray-50 mb-1 bg-gray-50/50 rounded-t-lg">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={routes.profile}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors font-medium"
                    >
                      <UserCircle size={18} strokeWidth={2} /> My Profile
                    </Link>
                    {user?.role !== 'admin' && (
                      <Link
                        to={routes.orders}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors font-medium"
                      >
                        <ClipboardList size={18} strokeWidth={2} /> My Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <LogOut size={18} strokeWidth={2} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to={routes.login} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
                  Login
                </Link>
                <Link to={routes.register}>
                  <Button size="sm" className="rounded-full px-5">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button - Restored old style */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in bg-white -mx-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center"
                >
                  {item.name}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="pt-4 flex flex-col gap-2">
                  <Link to={routes.login} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" fullWidth>Login</Button>
                  </Link>
                  <Link to={routes.register} onClick={() => setMobileMenuOpen(false)}>
                    <Button fullWidth>Register</Button>
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors text-left flex items-center mt-2"
                >
                  <LogOut size={20} strokeWidth={2} className="inline-block mr-3" /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header