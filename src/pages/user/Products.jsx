import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../../actions/productActions'
import { categories } from '../../routes/routeConfig'
import ProductCard from '../../components/ecommerce/ProductCard'
import Loader from '../../components/feedback/Loader'
import { EmptyProducts, EmptySearch } from '../../components/feedback/EmptyState'
import Pagination from '../../components/common/Pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import PageWrapper from '../../components/layout/PageWrapper'
import { useDebounce } from '../../hooks/useDebounce'

const Products = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products = [], loading, totalPages = 1, productsCount = 0 } = useSelector(state => state.products || {})
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [rating, setRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState('search')

  const debouncedSearch = useDebounce(searchTerm, 500)

  // Load products on filter changes
  useEffect(() => {
    const filters = {
      keyword: debouncedSearch || undefined,
      category: selectedCategory || undefined,
      price: priceRange,
      rating: rating || undefined,
      currentPage: currentPage,
    }

    dispatch(getProducts
      (filters.keyword,
        filters.price,
        filters.category,
        filters.rating,
        filters.currentPage
      ))

    // Update URL params
    const params = new URLSearchParams()
    if (filters.keyword) params.set('keyword', filters.keyword)
    if (filters.category) params.set('category', filters.category)
    if (filters.currentPage > 1) params.set('page', filters.currentPage)
    setSearchParams(params)
  }, [debouncedSearch, selectedCategory, priceRange, rating, currentPage, dispatch, setSearchParams])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setPriceRange([0, 1000])
    setRating(0)
    setSearchParams({})
    setShowFilters(false)
  }

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange]
    newRange[index] = parseInt(value) || 0
    setPriceRange(newRange)
  }

  const toggleFilterSection = (section) => {
    setExpandedFilter(expandedFilter === section ? null : section)
  }

  return (
    <PageWrapper title="Our Products" description="Browse our premium organic collection">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-semibold"
              >
                Reset
              </Button>
            </div>

            {/* Desktop Search */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Search
              </label>
              <Input
                type="text"
                placeholder="Find products..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="bg-gray-50 border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                leftIcon={
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            {/* Desktop Categories */}
            <div className="mb-8">
              <h4 className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${selectedCategory === ''
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                    className={`block w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${selectedCategory === category
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Price Range */}
            <div className="mb-8">
              <h4 className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => { setPriceRange([priceRange[0], parseInt(e.target.value)]); setCurrentPage(1); }}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 mb-1 block">Min</span>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="w-full text-sm bg-gray-50 border-gray-100 py-1.5 px-2"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 mb-1 block">Max</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="w-full text-sm bg-gray-50 border-gray-100 py-1.5 px-2 text-right"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Rating */}
            <div>
              <h4 className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rating</h4>
              <div className="space-y-1">
                {[4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => { setRating(rating === stars ? 0 : stars); setCurrentPage(1); }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${rating === stars
                      ? 'bg-amber-50 text-gray-900 font-medium ring-1 ring-amber-100'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">{i < stars ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">& up</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-3 px-4 text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="lg:hidden mb-6 bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            {/* Mobile Search */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                Search
              </label>
              <Input
                type="text"
                placeholder="Product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            {/* Mobile Categories Accordion */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => toggleFilterSection('category')}
                className="w-full flex items-center justify-between py-2 font-medium text-gray-900"
              >
                <span className="text-sm font-medium uppercase tracking-wider">Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedFilter === 'category' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
                </svg>
              </button>
              {expandedFilter === 'category' && (
                <div className="mt-2 space-y-2 pl-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setExpandedFilter(null)
                      setCurrentPage(1)
                    }}
                    className={`block w-full text-left px-2 py-2 rounded text-sm transition-colors ${selectedCategory === ''
                      ? 'bg-emerald-100 text-emerald-700 font-medium'
                      : 'text-gray-600'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setExpandedFilter(null)
                        setCurrentPage(1)
                      }}
                      className={`block w-full text-left px-2 py-2 rounded text-sm transition-colors ${selectedCategory === category
                        ? 'bg-emerald-100 text-emerald-700 font-medium'
                        : 'text-gray-600'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Price Accordion */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => toggleFilterSection('price')}
                className="w-full flex items-center justify-between py-2 font-medium text-gray-900"
              >
                <span className="text-sm font-medium uppercase tracking-wider">Price</span>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedFilter === 'price' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
                </svg>
              </button>
              {expandedFilter === 'price' && (
                <div className="mt-3 space-y-3 pl-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-600 font-medium">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Rating Accordion */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => toggleFilterSection('rating')}
                className="w-full flex items-center justify-between py-2 font-medium text-gray-900"
              >
                <span className="text-sm font-medium uppercase tracking-wider">Rating</span>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedFilter === 'rating' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
                </svg>
              </button>
              {expandedFilter === 'rating' && (
                <div className="mt-2 space-y-2 pl-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => {
                        setRating(rating === stars ? 0 : stars)
                        setExpandedFilter(null)
                      }}
                      className={`flex items-center gap-2 w-full px-2 py-2 rounded text-sm transition-colors ${rating === stars
                        ? 'bg-amber-100 text-amber-700 font-medium'
                        : 'text-gray-600'
                        }`}
                    >
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">{i < stars ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Clear Button */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm mt-2"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Organic Products</h2>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Showing ${productsCount} products`}
              </p>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || rating > 0 || priceRange[1] < 1000) && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active Filters:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 font-medium">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {rating > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
                    {rating}+ stars
                    <button
                      onClick={() => setRating(0)}
                      className="hover:text-amber-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {priceRange[1] < 1000 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                    ₹{priceRange[0]}-₹{priceRange[1]}
                    <button
                      onClick={() => setPriceRange([0, 1000])}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="py-12">
              {searchTerm || selectedCategory || rating > 0 || priceRange[1] < 1000 ? (
                <EmptySearch searchTerm={searchTerm} />
              ) : (
                <EmptyProducts />
              )}
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageRange={2}
                    showFirstLast={true}
                    showPrevNext={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

export default Products