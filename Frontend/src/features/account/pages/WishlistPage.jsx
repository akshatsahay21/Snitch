import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useAccount } from '../hook/useAccount'

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceLowest: '#ffffff',
    surfaceHigh: '#eae8e5',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    outlineVariant: '#d0c5b5',
}

export default function WishlistPage() {
    const { handleGetWishlist, handleToggleWishlist } = useAccount()
    const wishlist = useSelector(state => state.account.wishlist)
    const loading = useSelector(state => state.account.loading)
    const navigate = useNavigate()

    useEffect(() => {
        handleGetWishlist()
    }, [])

    const formatCurrency = (amount, currency = 'INR') =>
        `${currency} ${Number(amount).toLocaleString('en-IN')}`

    async function onRemove(productId) {
        await handleToggleWishlist(productId)
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div
                className="min-h-screen pb-24"
                style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
            >
                {/* Sub Nav */}
                <nav
                    className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-end"
                    style={{ borderBottom: `1px solid ${tokens.surfaceHighest}` }}
                >
                    <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em]" style={{ color: tokens.secondary }}>
                        <Link to="/account" className="hover:opacity-70 transition-opacity">Profile</Link>
                        <Link to="/account/wishlist" style={{ color: tokens.primary, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Wishlist</Link>
                        <Link to="/account/orders" className="hover:opacity-70 transition-opacity">Orders</Link>
                    </div>
                </nav>

                <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24 pt-14">
                    <div className="mb-12">
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-medium" style={{ color: tokens.primary }}>My Account</p>
                        <h1
                            className="font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface, fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}
                        >
                            My Wishlist
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.18em] mt-2" style={{ color: tokens.muted }}>
                            {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} saved
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: tokens.surfaceHighest, borderTopColor: tokens.primary }} />
                        </div>
                    ) : wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-24">
                            <p className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}>
                                Your wishlist is empty.
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: tokens.muted }}>
                                Discover pieces you love
                            </p>
                            <Link
                                to="/"
                                id="explore-wishlist-cta"
                                className="mt-2 px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.primary; e.currentTarget.style.color = tokens.onSurface }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = tokens.onSurface; e.currentTarget.style.color = tokens.surface }}
                            >
                                Explore Archive
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {wishlist.map(product => {
                                const id = typeof product === 'string' ? product : product?._id
                                const title = product?.title ?? 'Product'
                                const image = product?.images?.[0]?.url
                                const price = product?.price

                                return (
                                    <div key={id} className="group relative flex flex-col">
                                        {/* Image */}
                                        <div
                                            className="relative overflow-hidden mb-4"
                                            style={{ aspectRatio: '4/5', backgroundColor: tokens.surfaceHigh }}
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full" style={{ backgroundColor: tokens.surfaceHighest }} />
                                            )}
                                            {/* Remove from wishlist overlay */}
                                            <button
                                                id={`remove-wishlist-${id}`}
                                                onClick={() => onRemove(id)}
                                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
                                                style={{ backgroundColor: 'rgba(251,249,246,0.9)' }}
                                                title="Remove from wishlist"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M7 12.25S1.75 9.1 1.75 5.25a3.246 3.246 0 0 1 5.25-2.55 3.246 3.246 0 0 1 5.25 2.55C12.25 9.1 7 12.25 7 12.25z" fill={tokens.primary} />
                                                </svg>
                                            </button>
                                        </div>
                                        {/* Info */}
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[13px] font-light leading-snug" style={{ color: tokens.onSurface }}>{title}</p>
                                            {price && (
                                                <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: tokens.secondary }}>
                                                    {formatCurrency(price.amount, price.currency)}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            id={`view-wishlist-${id}`}
                                            onClick={() => navigate(`/product/${id}`)}
                                            className="mt-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
                                            style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.primary; e.currentTarget.style.color = tokens.onSurface }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = tokens.onSurface; e.currentTarget.style.color = tokens.surface }}
                                        >
                                            View Product
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
