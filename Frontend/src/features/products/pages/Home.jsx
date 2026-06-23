import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { Link, useNavigate, useSearchParams } from 'react-router';
import Footer from '../../Shared/Components/Footer';
import PromoBanner from '../../Shared/Components/PromoBanner';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchQuery = searchParams.get('q') ?? '';
    const sortParam = searchParams.get('sort') ?? '';
    const minPriceParam = searchParams.get('minPrice') ?? '';
    const maxPriceParam = searchParams.get('maxPrice') ?? '';
    const categoryParam = searchParams.get('category') ?? '';

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const paramsObj = Object.fromEntries(searchParams.entries());
        handleGetAllProducts(paramsObj);
    }, [searchParams]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
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
                                        updateFilter('q', e.target.value.trim());
                                    }
                                }}
                                className="w-full bg-[#f5f3f0] border border-transparent focus:border-[#C9A96E] rounded-full py-3 px-6 text-sm placeholder:text-[#B5ADA3] outline-none transition-colors"
                                style={{ color: '#1b1c1a' }}
                            />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5ADA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {!searchQuery && <PromoBanner />}

                    {/* ── Filter Toolbar (Mobile) & Sorting ── */}
                    <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-8 mt-4">
                        <button 
                            className="lg:hidden flex items-center gap-2 text-sm uppercase tracking-widest font-medium"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            Filters
                        </button>
                        
                        <div className="hidden lg:block text-sm text-gray-500">
                            Showing {products.length} Products
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="uppercase tracking-widest text-[10px] text-gray-500 font-bold hidden sm:inline">Sort By:</span>
                            <select 
                                value={sortParam}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                                className="bg-transparent border-none outline-none font-medium cursor-pointer"
                            >
                                <option value="">Recommended</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 pb-32 relative">
                        {/* ── Sidebar Filters ── */}
                        <div className={`w-full lg:w-[250px] flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                            <div className="sticky top-24 bg-white p-6 border border-gray-200 rounded-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-sm uppercase tracking-widest font-bold">Filters</h2>
                                    {(searchQuery || categoryParam || minPriceParam || maxPriceParam) && (
                                        <button onClick={clearFilters} className="text-[10px] text-[#C9A96E] hover:underline uppercase tracking-wider">Clear All</button>
                                    )}
                                </div>

                                {/* Category Filter */}
                                <div className="mb-8">
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Category</h3>
                                    <div className="flex flex-col gap-2">
                                        {['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets'].map(cat => (
                                            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input 
                                                    type="radio" 
                                                    name="category"
                                                    value={cat}
                                                    checked={categoryParam.toLowerCase() === cat.toLowerCase()}
                                                    onChange={() => updateFilter('category', cat.toLowerCase())}
                                                    className="accent-[#1b1c1a] w-4 h-4 cursor-pointer"
                                                />
                                                <span className="text-gray-700 hover:text-black">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-8">
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Price Range</h3>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="radio" name="price" checked={!minPriceParam && !maxPriceParam} onChange={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }} className="accent-[#1b1c1a] w-4 h-4" /> All
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="radio" name="price" checked={maxPriceParam === '1000'} onChange={() => { updateFilter('minPrice', '0'); updateFilter('maxPrice', '1000'); }} className="accent-[#1b1c1a] w-4 h-4" /> Under ₹1,000
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="radio" name="price" checked={minPriceParam === '1000' && maxPriceParam === '2000'} onChange={() => { updateFilter('minPrice', '1000'); updateFilter('maxPrice', '2000'); }} className="accent-[#1b1c1a] w-4 h-4" /> ₹1,000 - ₹2,000
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="radio" name="price" checked={minPriceParam === '2000'} onChange={() => { updateFilter('minPrice', '2000'); updateFilter('maxPrice', ''); }} className="accent-[#1b1c1a] w-4 h-4" /> Over ₹2,000
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ── Product Grid ── */}
                        <div className="flex-1">
                            {products && products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                    {products.map(product => {
                                        const imageUrl = product.images && product.images.length > 0
                                            ? product.images[ 0 ].url
                                            : '/snitch_editorial_warm.png'; 

                                        return (
                                            <div
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                key={product._id} className="group cursor-pointer flex flex-col relative bg-white border border-transparent hover:border-gray-200 transition-colors p-2">
                                                
                                                <div className="aspect-[3/4] overflow-hidden mb-4 bg-gray-100">
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>

                                                <div className="flex flex-col mt-3">
                                                    <h3 className="text-[13px] font-medium text-gray-800 line-clamp-1">
                                                        {product.title}
                                                    </h3>
                                                    <div className="mt-1">
                                                        <span className="text-sm font-bold text-gray-900 tracking-wide">
                                                            {product.price?.currency === 'INR' ? '₹' : product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-24 text-center border border-dashed border-gray-300 w-full">
                                    <h2 className="text-xl mb-2 font-medium text-gray-700">No pieces found</h2>
                                    <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                                    <button onClick={clearFilters} className="px-6 py-2 bg-black text-white text-xs uppercase tracking-widest">Clear Filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default Home;