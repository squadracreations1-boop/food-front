import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct, createReview } from '../../actions/productActions'
import { addCartItem } from '../../actions/cartActions'
import ProductGallery from '../../components/ecommerce/ProductGallery'
import PriceTag from '../../components/ecommerce/PriceTag'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Model'
import Loader from '../../components/feedback/Loader'
import { EmptyProducts } from '../../components/feedback/EmptyState'
import ProductCard from '../../components/ecommerce/ProductCard'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { product, loading: productLoading, error } = useSelector(state => state.product || {})
  const { products = [], loading: productsLoading } = useSelector(state => state.products || {})
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { cartItems = [] } = useSelector(state => state.cart || {})

  const [quantity, setQuantity] = useState(1)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)


  // Load product details
  useEffect(() => {
    if (id) {
      dispatch(getProduct(id))
    }
  }, [id, dispatch])

  // Load related products
  useEffect(() => {
    if (product?.category) {
      // Note: This would use getProducts with category filter
      // For now, we'll filter from existing products
    }
  }, [product])

  const relatedProducts = products
    .filter(p => p.category === product?.category && p._id !== product?._id)
    .slice(0, 4)

  const isInCart = cartItems.some(item => item.product === product?._id)
  const cartItem = cartItems.find(item => item.product === product?._id)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    try {
      // dispatch(addCartItem(product._id, quantity)) → provided externally
      dispatch(addCartItem(product._id, quantity))
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to submit a review')
      return
    }

    if (!reviewData.comment?.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    setSubmittingReview(true)
    try {
      // dispatch(createReview({ ...reviewData, productId: id })) → provided externally
      await dispatch(createReview({
        rating: String(reviewData.rating),
        comment: reviewData.comment.trim(),
        productId: id,
      }))
      toast.success('Review submitted successfully! Thank you for your feedback.')
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: '' })
      // Product will be automatically updated from the action
    } catch (error) {
      toast.error(error.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (productLoading) {
    return (
      <div className="container py-12">
        <Loader fullScreen />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-12">
        <EmptyProducts />
      </div>
    )
  }

  const userReview = product.reviews?.find(review => review.user?._id === user?._id)



  return (
    <div className="container py-8">
      {/* Back Button - Hidden on Mobile */}
      <div className="hidden md:flex mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li>
            <Link to="/" className="text-gray-600 hover:text-emerald-600">
              Home
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li>
            <Link to="/products" className="text-gray-600 hover:text-emerald-600">
              Products
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-gray-600 hover:text-emerald-600"
            >
              {product.category}
            </Link>
          </li>
          <li>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-900 font-medium truncate max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div>
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 uppercase tracking-wider">
                {product.category}
              </span>
              {product.organic && (
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  🌿 Organic Certified
                </span>
              )}
              {product.featured && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="flex text-amber-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(parseFloat(product.ratings) || 0) ? '★' : i < parseFloat(product.ratings) ? '½' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {parseFloat(product.ratings || 0).toFixed(1)} ({product.numOfReviews || 0} reviews)
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className={product.stock > 10 ? "text-emerald-600" : "text-amber-600"}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>


            {/* Price */}

            <div className='flex'>
              <PriceTag
                price={product.price}
                originalPrice={product.originalPrice}
                size="sm"
                showTax
              />
              <span>NetWt :{product.netWt}</span>
            </div>


            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.ingredients}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use:</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.howToUse}
              </p>
            </div>

            {/* Stock Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Availability</p>
                  <p className="text-sm text-gray-600">
                    {product.stock} units available
                  </p>
                </div>
                {product.stock > 0 && (
                  <div className="text-emerald-600 font-medium">
                    {product.stock <= 10 ? 'Only few left!' : 'Ready to ship'}
                  </div>
                )}
              </div>

              {product.stock > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Stock level</span>
                    <span>{product.stock} units</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((product.stock / 100) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                      >
                        -
                      </button>
                      <div className="w-16 text-center text-lg font-semibold">
                        {quantity}
                      </div>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Max: {product.stock} units
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {isInCart ? (
                    <>
                      <Link to="/cart">
                        <Button fullWidth size="lg" variant="primary">
                          🛒 View in Cart ({cartItem?.quantity})
                        </Button>
                      </Link>
                      <Button
                        fullWidth
                        size="lg"
                        variant="outline"
                        onClick={handleAddToCart}
                      >
                        Update Quantity
                      </Button>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  )}

                  <Button
                    fullWidth
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error('Please login to add to wishlist')
                        navigate('/login')
                        return
                      }
                      toast.success('Added to wishlist!')
                    }}
                  >
                    ❤️ Add to Wishlist
                  </Button>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">SKU</p>
                <p className="font-medium">{product._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery</p>
                <p className="font-medium">1-2 business days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Returns</p>
                <p className="font-medium">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <p className="text-gray-600">
              {product.numOfReviews || 0} reviews • {product.rating?.toFixed(1) || '0.0'} average rating
            </p>
          </div>

          {isAuthenticated && !userReview && (
            <Button onClick={() => setShowReviewModal(true)}>
              Write a Review
            </Button>
          )}
        </div>

        {/* Review Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = product.reviews?.filter(r => Math.floor(parseFloat(r.rating)) === star).length || 0
                const percentage = product.numOfReviews ? (count / product.numOfReviews) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex text-amber-400 w-20">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < star ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Add Review CTA */}
          <div className="bg-emerald-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-emerald-900 mb-4">
              Share Your Experience
            </h3>
            <p className="text-emerald-800 mb-6">
              Help other customers make informed decisions by sharing your experience with this product.
            </p>
            {isAuthenticated ? (
              userReview ? (
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="font-medium text-emerald-900">✓ You've already reviewed this product</p>
                  <div className="flex text-amber-400 mt-2 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(parseFloat(userReview.rating)) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-700">
                    Your rating: {userReview.rating} out of 5 stars
                  </p>
                </div>
              ) : (
                <Button onClick={() => setShowReviewModal(true)}>
                  Write Your Review
                </Button>
              )
            ) : (
              <Button onClick={() => navigate('/login')}>
                Login to Review
              </Button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-700 font-semibold text-sm">
                          {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-amber-400 text-lg">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(review.rating) ? '★' : '☆'}</span>
                      ))}
                      <span className="text-gray-600 text-sm ml-2 font-medium">
                        {review.rating} out of 5
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">Be the first to review this product and help others!</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
        size="md"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= reviewData.rating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {reviewData.rating} out of 5 stars
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              loading={submittingReview}
              disabled={submittingReview}
            >
              Submit Review
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProductDetails