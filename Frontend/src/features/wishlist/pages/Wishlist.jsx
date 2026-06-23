import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { useWishlist } from '../hook/useWishlist';

const Wishlist = () => {
    const { wishlist, loading, handleGetWishlist, handleToggleWishlistItem } = useWishlist();

    useEffect(() => {
        handleGetWishlist();
    }, [handleGetWishlist]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6]">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse text-[#B5ADA3]">
                    Loading Wishlist...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbf9f6] font-sans pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 lg:pt-20">
                <h1 className="text-3xl md:text-4xl font-light text-center mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    My Wishlist
                </h1>
                <p className="text-center text-sm text-gray-500 mb-12 uppercase tracking-widest">
                    {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
                </p>

                {wishlist.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-gray-300">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <h2 className="text-xl font-medium text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items that you like in your wishlist.</p>
                        <Link to="/" className="px-8 py-3 bg-[#1b1c1a] text-[#fbf9f6] text-xs uppercase tracking-widest hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {wishlist.map((product) => (
                            <div key={product._id} className="group relative bg-white border border-transparent hover:border-gray-200 transition-colors p-2">
                                <Link to={`/product/${product._id}`} className="block aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                    <img 
                                        src={product.images && product.images.length > 0 ? product.images[0].url : '/snitch_editorial_warm.png'} 
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                                <button 
                                    onClick={() => handleToggleWishlistItem(product._id)}
                                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white text-pink-500 hover:text-red-600 transition-colors shadow-sm"
                                    aria-label="Remove from Wishlist"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                                
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {product.price?.currency || 'INR'} {product.price?.amount?.toLocaleString()}
                                    </p>
                                </Link>
                                
                                <Link 
                                    to={`/product/${product._id}`}
                                    className="mt-4 w-full block text-center py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-800 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
