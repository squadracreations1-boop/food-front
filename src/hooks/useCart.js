import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addCartItem,
  removeCartItemAction,
  increaseCartItemQtyAction,
  decreaseCartItemQtyAction,
  updateCartItemQty,
  clearCartAction,
  getCart,
  syncGuestCart
} from '../actions/cartActions';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(state => state.auth);
  const { items, loading = false, error, dbSynced } = useSelector(
    state => state.cart || {}
  );

  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (isAuthenticated && !dbSynced && !loading) {
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (localCart.length > 0) {
        // Sync local items to DB, then fetch fresh cart
        dispatch(syncGuestCart(localCart));
      } else {
        // Just fetch DB cart
        dispatch(getCart());
      }
    }
  }, [isAuthenticated, dbSynced, loading, dispatch]);


  const addToCart = async (productId, quantity = 1) => {
    try {
      await dispatch(addCartItem(productId, quantity));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await dispatch(removeCartItemAction(productId));
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
      throw error;
    }
  };



  const increaseQuantity = async (productId) => {
    try {
      await dispatch(increaseCartItemQtyAction(productId));
    } catch (error) {
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      await dispatch(decreaseCartItemQtyAction(productId));
    } catch (error) {
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await dispatch(updateCartItemQty(productId, quantity));
    } catch (error) {
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await dispatch(clearCartAction());
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const getCartTotal = () => {
    return safeItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return safeItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItem = (productId) => {
    return safeItems.find(item => item.product === productId);
  };

  const proceedToCheckout = () => {
    if (safeItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    navigate('/checkout');
  };

  return {
    items: safeItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    proceedToCheckout,
    cartTotal: getCartTotal(),
    cartCount: getCartCount(),
    getCartItem,
    isEmpty: safeItems.length === 0,
    hasItems: safeItems.length > 0,
  };
};