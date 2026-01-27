import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addCartItem } from '../../actions/cartActions'
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistActions'
import toast from 'react-hot-toast'
import { ShoppingBag, Heart, Star, Eye, Truck, Leaf } from 'lucide-react'
import { getImageUrl } from '../../utils/urlHelpers';


const ProductCard = memo(({ product, showAddToCart = true, className = '', imageAspectRatio = 'aspect-[4/5]' }) => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const { isAuthenticated } = useSelector(state => state.auth)

  const isWishlisted = wishlistItems?.some(item =>
    (item.product?._id || item.product) === product._id
  );

  // Premium styling for featured products
  const isPremium = product.isFeatured;

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      // Trigger Animation
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      const imageUrl = product.images?.[0]?.image
        ? getImageUrl(product.images[0].image)
        : null;

      if (imageUrl) {
        const event = new CustomEvent('addToCartAnimate', {
          detail: { startX, startY, imageUrl }
        });
        window.dispatchEvent(event);
      }

      dispatch(addCartItem(product._id, 1))
      toast.success(`${product.name} added!`)
    } catch (error) {
      toast.error('Failed to add')
    }
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0


  return (
    <div className={`group relative bg-white flex flex-col items-start h-full rounded-2xl border ${isPremium ? 'border-amber-200 shadow-amber-100/50' : 'border-gray-100'} shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${className}`}>

      {/* Image Container */}
      <div className={`relative w-full ${imageAspectRatio} overflow-hidden bg-white`}>
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          {product.images?.[0]?.image ? (
            <img
              src={getImageUrl(product.images[0].image)}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </Link>

        {/* Badges - Floating Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 items-start">
          {product.stock === 0 ? (
            <span className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          ) : (
            <>
              {discountPercentage >= 5 && (
                <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  -{discountPercentage}%
                </span>
              )}
              {isPremium && (
                <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Free Shipping
                </span>
              )}
            </>
          )}
        </div>

        {/* Floating Actions - Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95
              ${isWishlisted
                ? 'bg-rose-50 text-rose-500 border border-rose-100'
                : 'bg-white/90 backdrop-blur-sm text-gray-400 border border-gray-100 hover:bg-white hover:text-rose-500'}`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick View Overlay (Bottom of image) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
          <Link
            to={`/product/${product._id}`}
            className="flex items-center justify-center w-full h-10 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:bg-emerald-600 hover:text-white transition-colors border border-gray-100"
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 w-full flex flex-col flex-grow">

        {/* Category & Tags */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 truncate">
            {product.category || 'Collection'}
          </div>
          {product.isOrganic && (
            <div className="flex items-center text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              <Leaf className="w-3 h-3 mr-1" /> Organic
            </div>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/product/${product._id}`}
          className="text-sm font-bold text-gray-900 leading-snug mb-1 hover:text-emerald-700 transition-colors line-clamp-2 min-h-[2.5em]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Net Weight */}
        {product.netWt && (
          <div className="text-xs text-gray-900 mb-2">
            {product.netWt}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-amber-400 text-lg">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(parseFloat(product.ratings) || 0) ? '★' : i < parseFloat(product.ratings) ? '½' : '☆'}
              </span>
            ))}
          </div>
          {product.ratings > 0 && (
            <span className="text-xs font-bold text-gray-500 pt-0.5">{product.ratings} <span className="font-normal text-gray-400">({product.numOfReviews})</span></span>
          )}
        </div>

        {/* New Details: Stock Status */}
        <div className="mb-4 flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <span className={`${product.stock > 0 ? 'text-emerald-700 font-medium' : 'text-red-600 font-medium'}`}>
            {product.stock > 0 ? 'In Stock & Ready to Ship' : 'Currently Unavailable'}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-dashed border-gray-100 flex items-center justify-between w-full">
          {/* Price */}
          <div className="flex flex-col leading-none">
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through mb-1 font-medium">₹{product.originalPrice}</span>
            )}
            <span className={`text-xl font-bold ${product.originalPrice > product.price ? 'text-gray-900' : 'text-gray-900'}`}>
              ₹{Math.floor(product.price)}
            </span>
          </div>

          {/* Add to Cart Button (Modified) */}
          {showAddToCart && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white border border-transparent transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:scale-105 active:scale-95"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Add</span>
            </button>
          )}
        </div>

      </div>
    </div>
  )
})

export default ProductCard