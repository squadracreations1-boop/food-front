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
    totalPages: serverTotalPages,
    stats = {}
  } = useSelector(state => state.products || {})

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
  const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'grid' : 'list')

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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader message="Loading products..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
            <p className="text-sm text-gray-500 font-medium">
              {filteredProductsCount !== productsCount ? (
                <span className="text-emerald-600">Showing {filteredProductsCount} matching items of {productsCount} total</span>
              ) : (
                <span>You have <span className="text-emerald-600 font-bold">{productsCount}</span> products in your catalog</span>
              )}
            </p>
          </div>

          <Link to="/admin/product/new">
            <Button className="shadow-lg shadow-emerald-500/20 group">
              <PlusSquare size={18} className="mr-2 group-hover:rotate-90 transition-transform" strokeWidth={2.5} />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: productsCount, color: 'emerald', icon: '📦' },
          { label: 'Featured', value: stats.featuredCount, color: 'blue', icon: '⭐' },
          { label: 'Low Stock', value: stats.lowStockCount, color: 'amber', icon: '⚠️' },
          { label: 'Out of Stock', value: stats.outOfStockCount, color: 'rose', icon: '🚫' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className={`text-xl font-bold text-${stat.color}-600 leading-none`}>{stat.value || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls: Search, Filter, View Mode */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 lg:w-48 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer font-medium text-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="Fruits & Vegetables">Veg Masala</option>
              <option value="Dairy & Eggs">Non-Veg Masala</option>
              <option value="Bakery & Bread">Food ingredients</option>
            </select>

            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
          <EmptyProducts isAdmin={true} />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="relative group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-3">
              <Link to={`/admin/product/${product._id}/edit`} className="block aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 relative">
                <img
                  src={getImageUrl(product.images?.[0]?.image)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.isFeatured && (
                    <span className="bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">FEATURED</span>
                  )}
                  {product.stock <= 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">SOLD OUT</span>
                  )}
                </div>
              </Link>
              <div className="px-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-gray-900 truncate hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm">
                    {product.name}
                  </h3>
                  <p className="font-bold text-emerald-600 text-sm">₹{product.price?.toLocaleString()}</p>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock <= 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    STOCK: {product.stock}
                  </div>
                  <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="p-1.5 bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border border-gray-100"
                    >
                      <PenBox size={14} />
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="p-1.5 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-gray-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financials</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(product.images?.[0]?.image)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate uppercase tracking-tight text-sm">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900">₹{product.price?.toLocaleString()}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-[10px] text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className={`text-sm font-bold ${product.stock <= 10 ? 'text-rose-600' : 'text-gray-900'}`}>{product.stock}</p>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${product.stock <= 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(product.stock * 2, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          product.stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                          {product.stock > 10 ? 'Healthy' : product.stock > 0 ? 'Critical' : 'Sold Out'}
                        </span>
                        {product.isFeatured && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest inline-flex w-fit">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <PenBox size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <Link
                          to={`/product/${product._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <div key={product._id} className="p-4 flex gap-4 bg-white active:bg-gray-50 transition-colors">
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                  <img src={getImageUrl(product.images?.[0]?.image)} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm truncate uppercase tracking-tight">{product.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                    </div>
                    <p className="font-bold text-emerald-600 text-sm">₹{product.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock <= 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                      STOCK: {product.stock}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product._id)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg">
                        <PenBox size={16} />
                      </button>
                      <button onClick={() => confirmDelete(product._id)} className="p-1.5 text-rose-600 bg-rose-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Reusable Confirmation Modal */}
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