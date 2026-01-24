import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWishlist } from '../../actions/wishlistActions'
import ProductCard from '../../components/ecommerce/ProductCard'
import Loader from '../../components/feedback/Loader'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const Wishlist = () => {
    const dispatch = useDispatch()
    const { items: wishlistItems, loading } = useSelector(state => state.wishlist)

    useEffect(() => {
        dispatch(getWishlist())
    }, [dispatch])

    if (loading) return <Loader />

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-rose-100 rounded-full text-rose-500">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-sm text-gray-500">{wishlistItems?.length || 0} items saved</p>
                    </div>
                </div>

                {(!wishlistItems || wishlistItems.length === 0) ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items you want to buy later!</p>
                        <Link to="/products" className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlistItems.map((item) => {
                            // Handle case where product might be populated object or just ID
                            // The backend controller populates 'products.product'
                            const productData = item.product;
                            if (!productData) return null;

                            return (
                                <div key={productData._id} className="h-full">
                                    <ProductCard product={productData} />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
