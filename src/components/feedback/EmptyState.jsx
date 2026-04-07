import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'

export const EmptyState = ({
  title = "Nothing here yet",
  message = "It looks like there's nothing to display here.",
  icon = "📭",
  actionLabel,
  actionLink,
  onAction,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  }

  const ActionButton = () => {
    if (actionLink) {
      return (
        <Link to={actionLink}>
          <Button variant="primary">
            {actionLabel}
          </Button>
        </Link>
      )
    }
    
    if (onAction && actionLabel) {
      return (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )
    }
    
    return null
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizes[size]} ${className}`}>
      <div className="text-6xl mb-6 opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      <ActionButton />
    </div>
  )
}

// Pre-configured empty states
export const EmptyCart = () => (
  <EmptyState
    title="Your cart is empty"
    message="Add some organic goodies to your cart and they'll appear here."
    icon="🛒"
    actionLabel="Start Shopping"
    actionLink="/products"
  />
)

export const EmptyOrders = () => (
  <EmptyState
    title="No orders yet"
    message="Your order history will appear here once you make your first purchase."
    icon="📦"
    actionLabel="Browse Products"
    actionLink="/products"
  />
)

export const EmptyWishlist = () => (
  <EmptyState
    title="No favorites yet"
    message="Save your favorite organic products to see them here."
    icon="❤️"
    actionLabel="Explore Products"
    actionLink="/products"
  />
)

export const EmptyProducts = ({ isAdmin = false }) => (
  <EmptyState
    title={isAdmin ? "No products found" : "No products available"}
    message={
      isAdmin 
        ? "Get started by adding your first organic product to the store."
        : "Check back soon for new organic arrivals!"
    }
    icon="🌿"
    actionLabel={isAdmin ? "Add Product" : "Browse Categories"}
    actionLink={isAdmin ? "/admin/product/new" : "/"}
  />
)

export const EmptySearch = ({ searchTerm }) => (
  <EmptyState
    title="No results found"
    message={`We couldn't find any products matching "${searchTerm}". Try searching for something else.`}
    icon="🔍"
    actionLabel="View All Products"
    actionLink="/products"
  />
)

// export default EmptyState