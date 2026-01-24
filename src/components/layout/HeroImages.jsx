import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/urlHelpers';
import { ShoppingBag, Star } from 'lucide-react';

const HeroImages = ({ heroProducts = [] }) => {
    return (
        <div className="relative w-full max-w-2xl mx-auto lg:ml-auto perspective-1000">

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gradient-to-tr from-emerald-100/40 via-amber-50/40 to-white/0 blur-[100px] rounded-full -z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl -z-10 animate-pulse-slow pointer-events-none" />

            <div className="grid grid-cols-2 gap-4 sm:gap-6 content-center">
                {heroProducts.map((product, index) => {
                    // Staggered layout logic
                    const isOffset = index === 1 || index === 3;

                    return (
                        <div
                            key={product._id || index}
                            className={`relative z-10 group ${isOffset ? 'mt-8 sm:mt-12' : ''
                                }`}
                        >
                            <Link
                                to={`/product/${product._id}`}
                                className="block relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-xl transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] ring-1 ring-black/5"
                            >
                                {/* Premium Background */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] to-white opacity-100" />

                                {/* Subtle Grid Pattern Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

                                {/* Floating Badge (Price) */}
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm transform transition-transform group-hover:scale-105">
                                        <span className="text-xs font-bold text-gray-900">₹{product.price}</span>
                                    </div>
                                </div>

                                {/* Review Badge (Fake for UI) */}
                                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 delay-75">
                                    <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                </div>

                                {/* Image Container with Parallax-like effect */}
                                <div className="absolute inset-0 p-6 flex items-center justify-center overflow-hidden">
                                    <div className="relative w-full h-full">
                                        {/* Blob behind image */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors duration-500" />

                                        <img
                                            src={getImageUrl(product.images?.[0]?.image)}
                                            alt={product.name}
                                            className="relative w-full h-full object-contain drop-shadow-lg transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 mix-blend-multiply"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* Bottom Actions Overlay */}
                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white/95 via-white/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 flex items-center justify-between">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <p className="text-sm font-bold text-gray-900 truncate font-heading">{product.name}</p>
                                        <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Organic</p>
                                    </div>
                                    <div className="p-2 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroImages;
