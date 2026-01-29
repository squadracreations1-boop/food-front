import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import ProductCard from '../../components/ecommerce/ProductCard'
import { EmptyProducts } from '../../components/feedback/EmptyState'
import Navbar from '../../components/layout/Navbar'
import PageWrapper from '../../components/layout/PageWrapper'
import HeroImages from '../../components/layout/HeroImages'
import { useAuth } from '../../hooks/useAuth'
import { Leaf, LampDesk, AlertTriangle, BadgeCheck } from 'lucide-react'

const Home = () => {
  const dispatch = useDispatch()
  const { products = [], loading } = useSelector(state => state.products || {})
  const { isAuthenticated } = useAuth()

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/api/v1/products?resPerPage=100')

<<<<<<< HEAD
        if (isMounted && data?.products?.length) {
          // Backend now sorts by updatedAt desc by default
          // We just take the first 10 products
          const latestProducts = data.products
            .filter(p => p.stock > 0)
            .slice(0, 10)

          setFeaturedProducts(latestProducts)
=======
        if (data?.products?.length) {
          // Filter featured & in-stock products
          let featured = data.products.filter(
            p => p.isFeatured === true && p.stock > 0
          )

          // OPTIONAL: force one product to appear
          const mustShowId = 'PRODUCT_ID' // replace or remove
          const forced = featured.find(p => p._id === mustShowId)

          let finalList = featured.slice(0, 9)

          if (forced && !finalList.some(p => p._id === mustShowId)) {
            finalList.push(forced)
          }

          setFeaturedProducts(finalList)
>>>>>>> 87def882703683ba194eb979a939a6004b5105ef
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        if (isMounted) setLoadingFeatured(false)
      }
    }

    fetchFeatured()

    return () => {
      isMounted = false
    }
  }, [])

  const heroProducts = featuredProducts.slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start py-12 lg:py-20">
            <div className="space-y-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                <Leaf className="w-5 h-5 mr-2" /> 100% Organic Certified
              </span>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                Naturally Grown.<br />
                <span className="text-emerald-600">Traditionally Made</span> Masalas
              </h1>

              <p className="text-lg text-gray-600">
                Authentic South Indian spice blends made from farm-fresh ingredients,
                stone-ground in small batches to preserve aroma and purity.
              </p>

              <div className="flex gap-3">
                <Link
                  to="/products"
                  className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Start Shopping
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  >
                    Join Now
                  </Link>
                )}
              </div>
            </div>

            <HeroImages heroProducts={heroProducts} />
          </div>
        </div>
      </section>

      <Navbar />

      {/* Featured Products */}
      <section className="py-16">
<<<<<<< HEAD
        <PageWrapper title="Our Products" description="Explore our complete collection of traditionally crafted organic spice blends.">
          {loadingFeatured ? (
=======
        <PageWrapper
          title="Featured Masalas"
          description="Handpicked premium organic spice blends"
        >
          {loadingFeatured ? (
            <div className="text-center py-10">Loading featured products…</div>
          ) : featuredProducts.length ? (
>>>>>>> 87def882703683ba194eb979a939a6004b5105ef
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredProducts.map(product => (
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
                className="px-6 py-3 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              >
                View All Products →
              </Link>
            </div>
          )}
        </PageWrapper>
      </section>

<<<<<<< HEAD
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
=======
      {/* Benefits */}
      <section className="mb-12">
        <div className="container grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <Benefit icon={Leaf} title="100% Certified Organic" />
          <Benefit icon={LampDesk} title="Traditional Preparation" />
          <Benefit icon={AlertTriangle} title="No Preservatives" />
          <Benefit icon={BadgeCheck} title="Premium Quality" />
>>>>>>> 87def882703683ba194eb979a939a6004b5105ef
        </div>
      </section>
    </div>
  )
}

const Benefit = ({ icon: Icon, title }) => (
  <div>
    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-semibold text-gray-900">{title}</h3>
  </div>
)

export default Home
