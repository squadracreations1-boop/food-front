import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import CartItem from '../../components/ecommerce/CartItem'
import OrderSummary from '../../components/ecommerce/OrderSummary'
import { EmptyCart } from '../../components/feedback/EmptyState'
import Loader from '../../components/feedback/Loader'
import Button from '../../components/common/Button'
import PageWrapper from '../../components/layout/PageWrapper'
import ConfirmationModal from '../../components/feedback/ConfirmationModal'
import { useState } from 'react'

const Cart = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const {
    items,
    loading,
    cartTotal,
    cartCount,
    removeFromCart,
    clearCart,
    proceedToCheckout
  } = useCart()

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })

  // Redirect if not authenticated -> REMOVED to allow guest cart access
  /*
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }
  */

  if (loading) {
    return (
      <div className="container py-12">
        <Loader message="Loading your cart..." />
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <PageWrapper title="Your Shopping Cart" description="Your organic goodies await">
        <EmptyCart />
      </PageWrapper>
    )
  }



  // FIXED: Pass productId directly, not product object
  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const handleClearCart = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Shopping Cart',
      message: 'Are you sure you want to remove all items from your cart? This action cannot be undone.',
      confirmText: 'Clear Cart',
      isDangerous: true,
      onConfirm: () => {
        clearCart()
        toast.success('Cart cleared successfully')
      }
    })
  }

  const handleProceedToCheckout = () => {
    proceedToCheckout()
  }

  const calculateShippingCost = (subtotal) => {
    if (subtotal >= 1500) return 120
    if (subtotal >= 1000) return 100
    if (subtotal >= 500) return 90
    if (subtotal >= 100) return 80
    return 0
  }

  const subtotal = cartTotal
  const shipping = calculateShippingCost(subtotal)
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax


  return (
    <PageWrapper title="Your Shopping Cart" description="Review your organic selections">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-gray-600">{cartCount} items in your cart</p>
              </div>
              <Link
                to="/products"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Continue Shopping →
              </Link>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <CartItem
                  key={`${item.product}-${index}`}
                  item={item}
                  onRemove={() => handleRemoveItem(item.product)} // Pass productId directly
                />
              ))}
            </div>

            {/* Cart Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
              >
                ← Continue Shopping
              </Button>
              <Button
                variant="ghost"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              onCheckout={handleProceedToCheckout}
              checkoutLabel={`Checkout (₹${total.toFixed(2)})`}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        isDangerous={confirmModal.isDangerous}
      />
    </PageWrapper>
  )
}

export default Cart