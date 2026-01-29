import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getProducts } from '../../actions/productActions'
import api from '../../utils/api'
import ProductCard from '../../components/ecommerce/ProductCard'
import Loader from '../../components/feedback/Loader'
import { EmptyProducts } from '../../components/feedback/EmptyState'
import Navbar from '../../components/layout/Navbar'
import PageWrapper from '../../components/layout/PageWrapper'
import HeroImages from '../../components/layout/HeroImages'
import { useAuth } from '../../hooks/useAuth'
import { Leaf, LampDesk, AlertTriangle, BadgeCheck } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch()
  const { products = [], loading } = useSelector(state => state.products || {})
  const { isAuthenticated } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  // Load featured products directly to bypass pagination
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch a large number of products to find featured ones
        // In a real app, you'd have a specific endpoint /products/featured
        const { data } = await api.get('/api/v1/products?resPerPage=100');
        if (data.products) {
          const featured = data.products
            .filter(product => product.isFeatured && product.stock >= 0)
            .slice(0, 10)
          setFeaturedProducts(featured)
        }
      } catch (error) {
        console.error("Failed to fetch featured products", error)
      } finally {
        setLoadingFeatured(false)
      }
    }
const featured = data.products.filter(p => p.isFeatured)

const mustShowId = "PRODUCT_ID"

const forced = featured.find(p => p._id === mustShowId)

let final = featured.slice(0, 9)

if (forced && !final.some(p => p._id === mustShowId)) {
  final.push(forced)
}

setFeaturedProducts(final)
    fetchFeatured()
  }, [])

  const heroProducts = featuredProducts.slice(0, 4)


  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start py-12 lg:py-20">
            <div className="space-y-4 lg:space-y-5">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-3">
                  <Leaf className="w-5 h-5 mr-2" /> 100% Organic Certified
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 lg:mb-3">
                  Naturally Grown.<br />
                  <span className="text-emerald-600">Traditionally Made</span> Masalas
                </h1>
                <p className="text-base lg:text-lg text-gray-600 mb-5">
                  Authentic South Indian spice blends made from farm-fresh ingredients,
                  stone-ground in small batches to preserve aroma, flavor, and purity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Start Shopping
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                  >
                    Join Now
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100/50 mt-2">
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-emerald-600">10K+</div>
                  <div className="text-xs lg:text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-emerald-600">50+</div>
                  <div className="text-xs lg:text-sm text-gray-600">Organic Products</div>
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-xs lg:text-sm text-gray-600">Delivery Support</div>
                </div>
              </div>
            </div>

            {/* Hero Images */}
            <div className="lg:mt-0 mt-8">
              <HeroImages heroProducts={heroProducts} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Navigation */}
      <Navbar />

      {/* Featured Products */}
      <section className="py-16">
        <PageWrapper title="Featured Masalas" description="Our handpicked selection of premium, traditionally crafted organic spice blends.">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >
                View All Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </PageWrapper>
      </section>



      {/* Benefits Section */}
      <section className="mb-8">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Maitreyi Foods
            </h2>
            <p className="text-gray-600">
              Authentic organic masalas crafted with purity, tradition, and care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl"><Leaf className="w-6 h-6" /></span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                100% Certified Organic
              </h3>
              <p className="text-gray-600">
                Made using organically grown spices sourced directly from trusted farms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl"><LampDesk className="w-6 h-6" /></span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Traditionally Prepared
              </h3>
              <p className="text-gray-600">
                Sun-dried and stone-ground using age-old methods to retain natural aroma.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl"><AlertTriangle className="w-6 h-6" /></span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                No Preservatives
              </h3>
              <p className="text-gray-600">
                Free from artificial colors, chemicals, additives, and fillers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl"><BadgeCheck className="w-6 h-6" /></span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Consistent Premium Quality
              </h3>
              <p className="text-gray-600">
                Carefully blended in small batches to deliver the same rich taste every time.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

export default Home
