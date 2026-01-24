import React from 'react'
import Button from '../common/Button'
import { getImageUrl } from '../../utils/urlHelpers';

const OrderSummary = ({
  items = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  onCheckout,
  isLoading = false,
  checkoutLabel = "Proceed to Checkout",
  showItems = true
}) => {
  const total = subtotal + shipping + tax - discount

  const calculateTax = () => {
    if (tax > 0) return tax
    return subtotal * 0.08 // Default 8% tax
  }

  const calculatedTax = calculateTax()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

      {/* Order Items */}
      {showItems && items.length > 0 && (
        <div className="mb-6">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {items.map((item, index) => (
              <div key={`${item.product}-${index}`} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              <span className="text-emerald-600">Discount</span>
            </span>
            <span className="font-medium text-emerald-600">₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Tax</span>
          <span className="font-medium">₹{calculatedTax.toFixed(2)}</span>
        </div>

        {/* Shipping Notice */}
        {shipping === 0 && subtotal > 0 && (
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-700 text-center">
              🎉 Free shipping on orders over ₹50
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">₹{total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Including ₹{calculatedTax.toFixed(2)} in taxes</p>
        </div>
      </div>

      {/* Checkout Button */}
      {onCheckout && (
        <Button
          onClick={onCheckout}
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={items.length === 0}
        >
          {checkoutLabel}
        </Button>
      )}

      {/* Payment Methods */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 text-center mb-2">Secure Payment</p>
        <div className="flex justify-center gap-4">
          <span className="text-xl">💳</span>
          <span className="text-xl">🏦</span>
          <span className="text-xl">📱</span>
          <span className="text-xl">💎</span>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          256-bit SSL encryption
        </p>
      </div>

      {/* Return Policy */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-lg">🔄</span>
          <div>
            <p className="text-xs font-medium text-gray-900">No returns available</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary