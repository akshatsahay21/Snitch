import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { Link, useNavigate, useSearchParams } from 'react-router';
import Footer from '../../Shared/Components/Footer';
import PromoBanner from '../../Shared/Components/PromoBanner';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const user = useSelector(state => state.auth.user);
    const { handleGetAllProducts } = useProduct();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') ?? '';

    const navigate = useNavigate();

    useEffect(() => {
        handleGetAllProducts(searchQuery);
    }, [searchQuery]);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
               

                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
                    {/* ── Hero / Header ── */}
                    <div className="pt-10 pb-10 text-center flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.24em] font-medium mb-6" style={{ color: '#C9A96E' }}>
                            {searchQuery ? 'Search Results' : 'The Collection'}
                        </span>
                        <h1
                            className="text-4xl lg:text-5xl font-light leading-tight mb-6"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            {searchQuery ? `"${searchQuery}"` : 'Curated Archive'}
                        </h1>
                        {!searchQuery && (
                            <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                Discover our latest curation of premium minimalist pieces, meticulously designed for effortless elegance and enduring quality.
                            </p>
                        )}
                        {searchQuery && (
                            <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>
                                {products.length} {products.length === 1 ? 'result' : 'results'} found
                            </p>
                        )}

                        {/* ── Search Bar ── */}
                        <div className="mt-8 w-full max-w-md mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                defaultValue={searchQuery}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (e.target.value.trim()) {
                                            navigate(`/?q=${encodeURIComponent(e.target.value.trim())}`);
                                        } else {
                                            navigate('/');
                                        }
                                    }
                                }}
                                className="w-full bg-[#f5f3f0] border-none rounded-full py-3 px-6 text-sm placeholder:text-[#B5ADA3] focus:ring-1 focus:ring-[#C9A96E] outline-none"
                                style={{ color: '#1b1c1a' }}
                            />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5ADA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Promo Banner ── */}
                    {!searchQuery && <PromoBanner />}

                    {/* ── Product Grid ── */}
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pb-32">
                            {products.map(product => {
                                const imageUrl = product.images && product.images.length > 0
                                    ? product.images[ 0 ].url
                                    : '/snitch_editorial_warm.png'; // Fallback

                                return (
                                    <div
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        key={product._id} className="group cursor-pointer flex flex-col">
                                        {/* Image Container */}
                                        <div className="aspect-[4/5] overflow-hidden mb-6" style={{ backgroundColor: '#f5f3f0' }}>
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col gap-2">
                                            <h3
                                                className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
                                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                            >
                                                {product.title}
                                            </h3>

                                            <p
                                                className="text-[12px] line-clamp-2 leading-relaxed"
                                                style={{ color: '#7A6E63' }}
                                            >
                                                {product.description}
                                            </p>

                                            <div className="mt-2">
                                                <span
                                                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                                    style={{ color: '#1b1c1a' }}
                                                >
                                                    {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center">
                            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                No pieces available.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                We are currently preparing our next collection. Please check back later.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <Footer />
            </div>
        </>
    );
};

export default Home;