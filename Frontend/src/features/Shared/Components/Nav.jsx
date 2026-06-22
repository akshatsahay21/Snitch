import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link, useSearchParams } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart.items)
    const wishlist = useSelector(state => state.account.wishlist)
    const { handleLogout } = useAuth()

    function onLogout() {
        handleLogout()
        navigate('/login')
    }

    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchRef = useRef(null)
    const debounceRef = useRef(null)

    // Focus input when search opens
    useEffect(() => {
        if (searchOpen && searchRef.current) {
            searchRef.current.focus()
        }
    }, [searchOpen])

    // Debounced navigation with ?q=
    const handleSearchChange = useCallback((e) => {
        const val = e.target.value
        setSearchQuery(val)
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            if (val.trim()) {
                navigate(`/?q=${encodeURIComponent(val.trim())}`)
            } else {
                navigate('/')
            }
        }, 350)
    }, [navigate])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
        }
        setSearchOpen(false)
    }

    const closeSearch = () => {
        setSearchOpen(false)
        setSearchQuery('')
        navigate('/')
    }

    return (
        <nav
            className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between border-b"
            style={{ borderColor: '#e4e2df' }}
        >
            {/* Logo */}
            <Link
                to="/"
                className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity flex-shrink-0"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
            >
                Snitch.
            </Link>

            {/* Search Bar (expands inline) */}
            {searchOpen && (
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 mx-8 flex items-center gap-3"
                    style={{ borderBottom: '1px solid #C9A96E' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={searchRef}
                        id="nav-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                        className="flex-1 bg-transparent outline-none py-2 text-[12px] tracking-[0.08em]"
                        style={{ color: '#1b1c1a', fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                        type="button"
                        onClick={closeSearch}
                        className="text-[10px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                        style={{ color: '#B5ADA3' }}
                    >
                        Close
                    </button>
                </form>
            )}

            {/* Right side icons */}
            <div className="flex gap-5 items-center text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                {/* Search Icon */}
                {!searchOpen && (
                    <button
                        id="nav-search-btn"
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center hover:opacity-70 transition-opacity"
                        style={{ color: '#1b1c1a' }}
                        aria-label="Search"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                )}

                {user ? (
                    <>
                        {user.role === 'seller' ? (
                            <>
                                <Link to="/seller/dashboard" className="transition-colors hover:text-[#C9A96E] hidden lg:block">
                                    Dashboard
                                </Link>
                                {/* Seller Logout */}
                                <button
                                    id="nav-logout-btn"
                                    onClick={onLogout}
                                    className="flex items-center gap-1.5 hover:opacity-70 transition-opacity text-[10px] uppercase tracking-[0.18em] font-medium"
                                    style={{ color: '#7A6E63' }}
                                    aria-label="Logout"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Account Link */}
                                <Link
                                    to="/account"
                                    id="nav-account-link"
                                    className="flex items-center hover:opacity-70 transition-opacity"
                                    style={{ color: '#1b1c1a' }}
                                    aria-label="My account"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                </Link>

                                {/* Wishlist Icon */}
                                <Link
                                    to="/account/wishlist"
                                    id="nav-wishlist-link"
                                    className="relative flex items-center hover:opacity-70 transition-opacity"
                                    style={{ color: '#1b1c1a' }}
                                    aria-label="Wishlist"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    {wishlist.length > 0 && (
                                        <span
                                            className="absolute -top-2 -right-2 flex items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: '#C9A96E',
                                                color: '#fff',
                                                width: '15px',
                                                height: '15px',
                                                fontSize: '8px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {wishlist.length > 9 ? '9+' : wishlist.length}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        {/* Cart Icon */}
                        <Link
                            to="/cart"
                            id="nav-cart-link"
                            className="relative flex items-center hover:opacity-70 transition-opacity"
                            style={{ color: '#1b1c1a' }}
                            aria-label="Shopping cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartItems.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                    style={{
                                        backgroundColor: '#C9A96E',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '9px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 600,
                                        letterSpacing: 0,
                                    }}
                                >
                                    {cartItems.length > 9 ? '9+' : cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Buyer Logout */}
                        <button
                            id="nav-logout-btn"
                            onClick={onLogout}
                            className="flex items-center hover:opacity-70 transition-opacity"
                            style={{ color: '#1b1c1a' }}
                            aria-label="Logout"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                        <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Nav