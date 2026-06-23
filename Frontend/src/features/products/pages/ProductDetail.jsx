import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';
import { useWishlist } from '../../wishlist/hook/useWishlist';

const ProductDetail = () => {
    const { productId } = useParams();
    const [ product, setProduct ] = useState(null);
    const [ selectedImage, setSelectedImage ] = useState(0);
    const [ selectedAttributes, setSelectedAttributes ] = useState({});
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();
    const { wishlist, handleGetWishlist, handleToggleWishlistItem } = useWishlist();




    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            // Handle both cases depending on how API is structured
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProductDetails();
        handleGetWishlist();
    }, [ productId, handleGetWishlist ]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;

        // If no attributes selected yet, don't default to a variant
        if (Object.keys(selectedAttributes).length === 0) {
            const emptyVariant = product.variants.find(v => !v.attributes || Object.keys(v.attributes).length === 0);
            return emptyVariant || null;
        }

        // Try to find an exact attribute match first
        const match = product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            const isMatch = vKeys.every(k => v.attributes[ k ] === selectedAttributes[ k ]);
            return vKeys.length === sKeys.length && isMatch;
        });
        
        return match || null;
    }, [ product, selectedAttributes ]);


    console.log({ product, activeVariant })

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([ key, value ]) => {
                    if (!attrs[ key ]) attrs[ key ] = new Set();
                    attrs[ key ].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => {
            attrs[ key ] = Array.from(attrs[ key ]);
        });
        return attrs;
    }, [ product ]);

    useEffect(() => {
        setSelectedImage(0);
    }, [ activeVariant ]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [ attrName ]: value };

        // Find if an exact match exists for this combination
        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[ k ] === vAttrs[ k ]) &&
                Object.keys(vAttrs).every(k => newAttrs[ k ] === vAttrs[ k ]);
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            // Find any variant that has this newly selected attribute to fallback nicely
            const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[ attrName ] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    console.log(product)

    // Only show variant images when the user has actively selected a variant via attribute buttons
    const hasAttributes = Object.keys(availableAttributes).length > 0;
    const displayImages = (hasAttributes && activeVariant?.images && activeVariant.images.length > 0)
        ? activeVariant.images
        : (product.images && product.images.length > 0 ? product.images : [ { url: '/snitch_editorial_warm.png' } ]);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    const isInWishlist = wishlist.some(item => typeof item === 'object' ? item._id === product._id : item === product._id);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >

                <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-4">
                        {/* ── LEFT: Image Grid (Myntra style: 2 columns) ── */}
                        <div className="w-full lg:w-[60%] grid grid-cols-2 gap-2 md:gap-4">
                            {displayImages.map((img, idx) => (
                                <div key={idx} className="aspect-[3/4] overflow-hidden bg-gray-100 hover:scale-[1.01] transition-transform">
                                    <img src={img.url} alt={product.title} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* ── RIGHT: Product Details ── */}
                        <div className="w-full lg:w-[40%] lg:sticky lg:top-24 flex flex-col pt-2 pb-24 font-sans">
                            {/* Brand */}
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide">SNITCH</h2>
                            {/* Title */}
                            <h1 className="text-lg md:text-xl text-gray-500 font-light mt-1 mb-3">{product.title}</h1>
                            
                            {/* Ratings Mockup */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 cursor-pointer hover:border-gray-400">
                                    <span className="text-sm font-bold text-gray-800">4.5</span>
                                    <span className="text-teal-600 text-sm">★</span>
                                    <span className="text-gray-300 mx-1">|</span>
                                    <span className="text-sm text-gray-600">8.2k Ratings</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-gray-200 mb-4" />

                            {/* Price */}
                            <div className="mb-1">
                                <span className="text-2xl font-bold text-gray-900">
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">MRP {displayPrice?.currency} {Math.floor(displayPrice?.amount * 1.3).toLocaleString()}</span>
                                <span className="text-sm font-bold text-orange-500 ml-2">(30% OFF)</span>
                            </div>
                            <p className="text-xs text-teal-600 font-bold mb-4">inclusive of all taxes</p>

                            {/* Options/Variants */}
                            {Object.entries(availableAttributes).map(([ attrName, values ]) => {
                                const isColor = attrName.toLowerCase() === 'color';
                                return (
                                    <div key={attrName} className="mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                                {isColor ? 'MORE COLOR' : `SELECT ${attrName}`}
                                            </h3>
                                            {!isColor && <button className="text-xs font-bold text-[#FF3E6C] uppercase tracking-wider">SIZE CHART {'>'}</button>}
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {values.map(val => {
                                                const isSelected = selectedAttributes[ attrName ] === val;
                                                if (isColor) {
                                                    // Color thumbnail style
                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleAttributeChange(attrName, val)}
                                                            className={`relative w-14 h-16 border-2 transition-all ${isSelected ? 'border-gray-900 scale-105' : 'border-transparent hover:border-gray-300'}`}
                                                        >
                                                            <div className="w-full h-full bg-gray-200 overflow-hidden">
                                                                <img src={displayImages[0]?.url} alt={val} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="absolute inset-x-0 bottom-0 bg-white/90 text-[8px] font-bold text-center uppercase truncate px-1 border-t border-gray-100">
                                                                {val}
                                                            </div>
                                                        </button>
                                                    );
                                                } else {
                                                    // Size circle style
                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleAttributeChange(attrName, val)}
                                                            className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${isSelected ? 'border-[#FF3E6C] text-[#FF3E6C]' : 'border-gray-300 text-gray-800 hover:border-gray-900'}`}
                                                        >
                                                            {val}
                                                        </button>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Stock Information */}
                            {activeVariant && activeVariant.stock !== undefined && (
                                <div className="mb-6 bg-pink-50 border border-pink-100 rounded-md p-3 flex items-start gap-3">
                                    <svg className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div>
                                        {activeVariant.stock > 0 ? (
                                            <p className="text-sm text-gray-800"><span className="font-bold">Only {activeVariant.stock} left in stock</span> for the selected variant!</p>
                                        ) : (
                                            <p className="text-sm text-red-600 font-bold">Currently Out of Stock</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions (Add to Bag / Wishlist) */}
                            <div className="flex gap-4 mt-2">
                                <button
                                    className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide rounded text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={hasAttributes ? (!activeVariant || activeVariant.stock === 0) : false}
                                    style={{ backgroundColor: '#FF3E6C' }}
                                    onClick={async () => {
                                        if (hasAttributes && !activeVariant) {
                                            alert("Please select options before adding to bag");
                                            return;
                                        }
                                        try {
                                            await handleAddItem({
                                                productId: product._id,
                                                variantId: activeVariant?._id
                                            });
                                        } catch (err) {
                                            console.error('Failed to add to cart', err);
                                        }
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    {hasAttributes && !activeVariant ? 'SELECT OPTIONS' : (hasAttributes && activeVariant?.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG')}
                                </button>
                                <button
                                    onClick={() => handleToggleWishlistItem(product._id)}
                                    className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide rounded border flex items-center justify-center gap-2 transition-colors ${isInWishlist ? 'bg-pink-50 text-pink-500 border-pink-500' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'}`}
                                >
                                    <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {isInWishlist ? 'WISHLISTED' : 'WISHLIST'}
                                </button>
                            </div>

                            {/* Product Details Section */}
                            <div className="mt-10 border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    Product Details
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;