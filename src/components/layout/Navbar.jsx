import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categories } from '../../routes/routeConfig'


function Navbar() {
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('')

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-12">
          {/* Category Navigation */}
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
            <Link
              to="/products"
              className={`whitespace-nowrap px-3 py-2 font-medium transition-colors ${
                !activeCategory 
                  ? 'text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
              onClick={() => setActiveCategory('')}
            >
              All Products
            </Link>
            
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className={`whitespace-nowrap px-3 py-2 font-medium transition-colors ${
                  activeCategory === category
                    ? 'text-emerald-600 border-b-2 border-emerald-500'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Special Offers */}
          <div className="hidden lg:flex items-center space-x-2 text-amber-600">
            <span className="animate-pulse">🔥</span>
            <span className="font-semibold">FREE Delivery on Combo orders</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar