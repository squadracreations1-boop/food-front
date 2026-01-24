import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import Input from '../common/Input'
import { useCart } from '../../hooks/useCart'
import { getImageUrl } from '../../utils/urlHelpers';


const CartItem = ({ item, onRemove }) => {
  const { increaseQuantity, decreaseQuantity, updateQuantity } = useCart()
  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      increaseQuantity(item.product)
    }
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      decreaseQuantity(item.product)
    }
  }

  const handleQuantityInputChange = (e) => {
    const newVal = e.target.value
    if (newVal === '') return // Allow empty while typing
    const newQuantity = parseInt(newVal)
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item.product, newQuantity)
    }
  }

  const handleBlur = (e) => {
    const val = parseInt(e.target.value)
    if (!val || val < 1) {
      updateQuantity(item.product, 1)
    } else if (val > item.stock) {
      updateQuantity(item.product, item.stock)
    }
  }

  const handleRemove = () => {
    onRemove() // Now it expects productId already passed
  }

  const subtotal = item.price * item.quantity

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200">   {/* Product Image */}
      <Link to={`/product/${item.product}`} className="flex-shrink-0">
        <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between">
          <div className="flex-1">
            <Link to={`/product/${item.product}`}>
              <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                {item.name}
              </h3>
            </Link>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-gray-600">Category:</span>
              <span className="text-sm text-emerald-600">{item.category || 'Organic'}</span>
            </div>

            {/* Stock Info */}
            {item.stock < 10 && (
              <div className="mt-2">
                <span className="text-sm text-amber-600">
                  {item.stock === 0
                    ? 'Out of Stock'
                    : `Only ${item.stock} left in stock`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-2 sm:mt-0">
            <div className="text-lg font-bold text-gray-900">
              ₹{item.price.toFixed(2)}
            </div>
            {item.originalPrice && item.originalPrice > item.price && (
              <div className="text-sm text-gray-500 line-through">
                ₹{item.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Quantity Controls & Actions */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
              >
                -
              </button>

              <Input
                type="number"
                value={item.quantity}
                onChange={handleQuantityInputChange}
                onBlur={handleBlur}
                min="1"
                max={item.stock}
                className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 focus:ring-0"
              />

              <button
                onClick={handleIncrease}
                disabled={item.quantity >= item.stock}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
              >
                +
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Max: {item.stock}
            </div>
          </div>

          {/* Subtotal & Remove */}
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-gray-900">
              ₹{subtotal.toFixed(2)}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem