import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminProducts, deleteProduct, updateProduct } from '../../../actions/productActions'
import { clearProductDeleted, clearProductUpdated } from '../../../slices/productSlice'
import { EmptyProducts } from '../../../components/feedback/EmptyState'
import Loader from '../../../components/feedback/Loader'
import Button from '../../../components/common/Button'
import ConfirmationModal from '../../../components/feedback/ConfirmationModal'
import Input from '../../../components/common/Input'
import ProductCard from '../../../components/ecommerce/ProductCard'
import Pagination from '../../../components/common/Pagination'
import { useDebounce } from '../../../hooks/useDebounce'
import { Search, PlusSquare, LayoutGrid, List, PenBox, Trash2, Eye, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../../utils/urlHelpers';

const AdminProducts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    products = [],
    loading,
    productsCount,
    filteredProductsCount,
    resPerPage,
    totalPages: serverTotalPages,
    stats = {}
  } = useSelector(state => state.products || {})
  const { isProductDeleted, isProductUpdated } = useSelector(state => state.product || {})

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebounce(searchTerm, 500)

  // Fetch products from server whenever dependencies change
  useEffect(() => {
    dispatch(getAdminProducts(currentPage, debouncedSearch, categoryFilter))
  }, [dispatch, currentPage, debouncedSearch, categoryFilter])

  // Reset to first page when filtering changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, categoryFilter])

  // Use server-side data directly
  const filteredProducts = products;
  const totalPages = serverTotalPages || 1;

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })
  const [viewMode, setViewMode] = useState('list') // 'grid' or 'list'

  // Selection & bulk actions
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [bulkAction, setBulkAction] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)

  const onToggleSelect = (id) => {
    setSelectedProducts(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  const onToggleSelectAll = () => {
    const pageIds = filteredProducts.map(p => p._id)
    const allSelected = pageIds.every(id => selectedProducts.has(id))
    setSelectedProducts(prev => {
      const s = new Set(prev)
      if (allSelected) pageIds.forEach(id => s.delete(id))
      else pageIds.forEach(id => s.add(id))
      return s
    })
  }

  const paginatedProducts = filteredProducts;

  const confirmDelete = (productId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone and will remove it from all carts and order histories.',
      confirmText: 'Delete Product',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await dispatch(deleteProduct(productId))
          toast.success('Product deleted successfully')
          // Refresh data after delete
          dispatch(getAdminProducts(currentPage, debouncedSearch, categoryFilter))
        } catch (error) {
          toast.error('Failed to delete product')
        }
      }
    })
  }

  const handleEdit = (productId) => {
    navigate(`/admin/product/${productId}/edit`)
  }

  if (loading && products.length === 0) {
    return (
      <div className="p-6">
        <Loader message="Loading products..." />
      </div>
    )
  }



  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-600 text-sm">
              {filteredProductsCount !== productsCount ? (
                <span>Showing {filteredProductsCount} matching products of {productsCount} total</span>
              ) : (
                <span>Manage and monitor your entire inventory</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin/product/new">
              <Button>
                <span className="mr-2"><PlusSquare size={20} strokeWidth={2} /></span>
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <Search size={20} strokeWidth={1.5} />
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Fruits & Vegetables">Veg Masala</option>
              <option value="Dairy & Eggs">Non-Veg Masala</option>
              <option value="Bakery & Bread">Food ingredients</option>
            </select>

            <div className="flex border border-gray-300  rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-gray-100 hover:text-emerald-400' : 'bg-white hover:text-emerald-400'}`}
              >
                <LayoutGrid size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-gray-100 hover:text-emerald-400' : 'bg-white hover:text-emerald-400'}`}
              >
                <List size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-600">
            {productsCount || 0}
          </div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.featuredCount || 0}
          </div>
          <div className="text-sm text-gray-600">Featured</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-amber-600">
            {stats.lowStockCount || 0}
          </div>
          <div className="text-sm text-gray-600">Low Stock </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600">
            {stats.outOfStockCount || 0}
          </div>
          <div className="text-sm text-gray-600">Out of Stock</div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <EmptyProducts isAdmin={true} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="relative group"
              role="button"
              tabIndex={0}
              aria-label={`Edit ${product.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/admin/product/${product._id}/edit`)
              }}
              onClick={() => navigate(`/admin/product/${product._id}/edit`)}
            >
              <ProductCard product={product} showAddToCart={false} />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(ev) => { ev.stopPropagation(); handleEdit(product._id) }}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    title="Edit"
                  >
                    <span className="text-lg"><PenBox size={18} strokeWidth={1.5} /></span>
                  </button>
                  <button
                    onClick={(ev) => { ev.stopPropagation(); confirmDelete(product._id) }}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <span className="text-lg text-red-600"><Trash2 size={18} strokeWidth={1.5} /></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50"
                    role="row"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navigate(`/product/${product._id}`)
                      if (e.key === 'Delete') confirmDelete(product._id)
                      if (e.key === 'ArrowDown') { const next = e.currentTarget.nextElementSibling; if (next) next.focus() }
                      if (e.key === 'ArrowUp') { const prev = e.currentTarget.previousElementSibling; if (prev) prev.focus() }
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden">
                          <img
                            src={getImageUrl(product.images?.[0]?.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link to={`/product/${product._id}`} className="font-medium text-gray-900 hover:text-emerald-600">
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">₹{product.price?.toFixed(2)}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.stock}</div>
                      <div className="text-xs text-gray-500">
                        {product.stock <= 10 ? 'Low stock' : 'In stock'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive === false ? 'bg-gray-100 text-gray-800' :
                        product.stock > 10 ? 'bg-emerald-100 text-emerald-800' :
                          product.stock > 0 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {product.isActive === false ? 'Deactivated' :
                          product.stock > 10 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                      {product.isFeatured && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PenBox size={18} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                        <Link
                          to={`/product/${product._id}`}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} strokeWidth={1.5} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Bulk Actions */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option value="">Bulk Actions</option>
                <option value="featured">Set as Featured</option>
                <option value="unfeatured">Remove Featured</option>
                <option value="delete">Delete Selected</option>
                <option value="export">Export Selected</option>
              </select>
              <Button size="sm" variant="outline" disabled={bulkLoading} onClick={async () => {
                if (!bulkAction) { toast.error('Select an action'); return }
                const ids = [...selectedProducts]
                if (ids.length === 0) { toast.error('No products selected'); return }
                if (bulkAction === 'export') { toast('Export not implemented'); return }
                setBulkLoading(true)
                try {
                  if (bulkAction === 'delete') {
                    await Promise.all(ids.map(id => dispatch(deleteProduct(id))))
                  } else if (bulkAction === 'featured' || bulkAction === 'unfeatured') {
                    const isFeatured = bulkAction === 'featured'
                    await Promise.all(ids.map(id => {
                      const product = products.find(p => p._id === id)
                      if (!product) return Promise.resolve()
                      const updatedProduct = { ...product, isFeatured: isFeatured }
                      return dispatch(updateProduct(id, updatedProduct))
                    }))
                  }
                  toast.success('Bulk action completed')
                  setSelectedProducts(new Set())
                  dispatch(getAdminProducts())
                } catch (err) {
                  console.error('Bulk action error:', err)
                  toast.error('Failed to apply bulk action')
                } finally {
                  setBulkLoading(false)
                }
              }}>
                Apply
              </Button>
            </div>
            {/* <p className="text-sm text-gray-600 ">
              {selectedProducts.size > 0 && <span>{selectedProducts.size} selected</span>}
              <span>{filteredProducts.length} of {products.length} products shown</span>
            </p> */}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal */}
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
    </div>
  )
}

export default AdminProducts