import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createNewProduct, updateProduct, } from '../../actions/productActions'
import { categories } from '../../routes/routeConfig'
import Button from '../common/Button'
import Input from '../common/Input'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/urlHelpers';

const ProductForm = ({ product = null, mode = 'create' }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    ingredients: '',
    netWt: '',
    howToUse: '',
    seller: '',
    isOrganic: false,
    isFeatured: false,
    images: [],
  })

  const [images, setImages] = useState([]) // Stores both existing image paths and new File objects
  const [imagePreviews, setImagePreviews] = useState([])
  const [urlInput, setUrlInput] = useState('')

  const handleAddUrl = () => {
    const trimmedUrl = urlInput.trim()
    if (!trimmedUrl) return

    // Basic URL validation
    try {
      new URL(trimmedUrl)
    } catch (_) {
      toast.error('Please enter a valid URL')
      return
    }

    setImages(prev => [...prev, trimmedUrl])
    setImagePreviews(prev => [...prev, trimmedUrl])
    setUrlInput('')
  }

  // Initialize form with product data if editing
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || '',
        stock: product.stock || '',
        ingredients: product.ingredients || '',
        netWt: product.netWt || '',
        howToUse: product.howToUse || '',
        seller: product.seller || '',
        isOrganic: product.isOrganic || false,
        isFeatured: product.isFeatured || false,
        images: product.images || [],
      })

      if (product.images?.length > 0) {
        setImages(product.images.map(img => img.image))
        setImagePreviews(product.images.map(img => getImageUrl(img.image)))
      }
    }
  }, [product, mode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])

    // Store files
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    // Required fields validation
    if (!formData.name?.trim()) {
      toast.error('Product name is required')
      return false
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required')
      return false
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0')
      return false
    }
    if (!formData.category) {
      toast.error('Category is required')
      return false
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Stock quantity must be valid')
      return false
    }
    if (!formData.ingredients?.trim()) {
      toast.error('Ingredients information is required')
      return false
    }
    if (!formData.netWt?.trim()) {
      toast.error('Net weight is required')
      return false
    }
    if (!formData.howToUse?.trim()) {
      toast.error('How to use information is required')
      return false
    }
    if (!formData.seller?.trim()) {
      toast.error('Seller information is required')
      return false
    }

    // Images validation (at least 1 image for new products)
    if (mode === 'create' && images.length === 0) {
      toast.error('At least one product image is required')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const productData = new FormData()

      // Append form data
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          productData.append(key, formData[key])
        }
      })

      // Append images
      let hasExisting = false;
      images.forEach(image => {
        if (image instanceof File) {
          // New file upload
          productData.append('images', image)
        } else if (typeof image === 'string') {
          const trimmedImage = image.trim();
          // Check if it's an existing server image or a new URL
          if (trimmedImage.startsWith('/uploads') || trimmedImage.startsWith('http')) {
            if (trimmedImage.startsWith('http')) {
              // It's a new external URL (or existing external one)
              productData.append('imageUrls', trimmedImage)
            } else {
              // It's a server-hosted existing image
              productData.append('existingImages', trimmedImage)
              hasExisting = true;
            }
          }
        }
      })

      // If we are editing and have no existing images left, 
      // explicitly tell backend to clear the old list before adding new ones
      if (mode === 'edit' && !hasExisting) {
        productData.append('imagesCleared', 'true')
      }

      if (mode === 'create') {
        await dispatch(createNewProduct(productData))
        toast.success('Product created successfully!')
        navigate('/admin/products')
      } else if (mode === 'edit' && product) {
        await dispatch(updateProduct(product._id, productData))
        toast.success('Product updated successfully!')
        navigate('/admin/products')
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || 'Failed to save product'
      toast.error(errorMsg)
      console.error('Product save error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {mode === 'create' ? 'Add New Product' : 'Edit Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Organic Apples"
          />

          <Input
            label="Original Price (MRP) ₹"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.originalPrice}
            onChange={handleChange}
            placeholder="12.99"
          />

          <Input
            label="Selling Price (₹)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="9.99"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Stock Quantity"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
            placeholder="100"
          />
        </div>

        {/* Seller Information */}
        <Input
          label="Seller Name"
          name="seller"
          value={formData.seller}
          onChange={handleChange}
          required
          placeholder="e.g., Fresh Farms"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            placeholder="Describe your product..."
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            placeholder="e.g., Organic apples, no pesticides..."
            required
          />
        </div>

        {/* Net Weight & How to Use */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Net Weight"
            name="netWt"
            value={formData.netWt}
            onChange={handleChange}
            required
            placeholder="e.g., 500g, 1kg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How to Use
            </label>
            <textarea
              name="howToUse"
              value={formData.howToUse}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              placeholder="Storage instructions, usage tips..."
              required
            />
          </div>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images
          </label>

          {/* URL Input */}
          <div className="flex gap-2 mb-4">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1"
            />
            <Button type="button" onClick={handleAddUrl} variant="outline">
              Add URL
            </Button>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
            <input
              type="file"
              id="product-images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="product-images" className="cursor-pointer block">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-600 mb-1">
                Drag & drop images or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Upload up to 5 images (JPEG, PNG, WebP)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 pointer-events-none"
              >
                Choose Files
              </Button>
            </label>
            <p className="text-xs text-center text-gray-400 mt-2">
              (Files are processed securely)
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isOrganic"
                checked={formData.isOrganic}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
              />
              <div>
                <span className="font-medium text-gray-900">Organic Product</span>
                <p className="text-sm text-gray-500">Certified organic product</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
              />
              <div>
                <span className="font-medium text-gray-900">Featured Product</span>
                <p className="text-sm text-gray-500">Show on homepage</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {mode === 'create' ? 'Create Product' : 'Update Product'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm