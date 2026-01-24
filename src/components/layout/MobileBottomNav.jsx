import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, ShoppingBag, User, LayoutGrid } from 'lucide-react'
import { routes } from '../../routes/routeConfig'

const MobileBottomNav = () => {
    const location = useLocation()
    const { items: cartItems } = useSelector(state => state.cart || { items: [] })
    const { isAuthenticated } = useSelector(state => state.auth)

    // Hide on checkout pages to avoid conflict with sticky checkout footer
    if (location.pathname.includes('/checkout') || location.pathname.includes('/shipping')) {
        return null
    }

    const cartTotal = cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
    const isCartPage = location.pathname === routes.cart
    const hasItems = cartItems?.length > 0
    const cartItemCount = cartItems?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0

    const navItems = [
        {
            name: 'Home',
            path: routes.home,
            icon: Home
        },
        {
            name: 'Products',
            path: routes.products,
            icon: LayoutGrid
        },
        {
            name: 'Cart',
            path: routes.cart,
            icon: ShoppingBag,
            badge: cartItemCount
        },
        {
            name: 'Account',
            path: isAuthenticated ? routes.profile : routes.login,
            icon: User
        }
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
            {/* Checkout Summary Bar - Visible when cart has items */}
            {hasItems && (
                <div className="bg-white border-t border-gray-200 p-4 shadow-lg animate-slide-up">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">₹{cartTotal.toFixed(2)}</p>
                        </div>
                        <Link
                            to="/checkout"
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors shadow-sm flex-1 text-center"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <div className="bg-white border-t border-gray-200">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <div className="relative" id={item.name === 'Cart' ? 'mobile-cart-icon-container' : undefined}>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.badge > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MobileBottomNav
