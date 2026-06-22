import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useAccount } from '../hook/useAccount'

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    outlineVariant: '#d0c5b5',
}

const statusColors = {
    paid: { bg: '#eaf5ea', text: '#2d6e2d', label: 'Paid' },
    pending: { bg: '#fdf6e8', text: '#7a5e1a', label: 'Pending' },
    failed: { bg: '#fdeaea', text: '#8b1a1a', label: 'Failed' },
}

export default function OrderHistory() {
    const { handleGetOrders } = useAccount()
    const orders = useSelector(state => state.account.orders)
    const loading = useSelector(state => state.account.loading)

    useEffect(() => {
        handleGetOrders()
    }, [])

    const formatCurrency = (amount, currency = 'INR') =>
        `${currency} ${Number(amount).toLocaleString('en-IN')}`

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
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
                {/* Top Nav */}
                <nav
                    className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between"
                    style={{ borderBottom: `1px solid ${tokens.surfaceHighest}` }}
                >
                    <Link
                        to="/"
                        className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.primary }}
                    >
                        Snitch.
                    </Link>
                    <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em]" style={{ color: tokens.secondary }}>
                        <Link to="/account" className="hover:opacity-70 transition-opacity">Profile</Link>
                        <Link to="/account/wishlist" className="hover:opacity-70 transition-opacity">Wishlist</Link>
                        <Link to="/account/orders" style={{ color: tokens.primary, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Orders</Link>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto px-8 lg:px-0 pt-14">
                    <div className="mb-12">
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-medium" style={{ color: tokens.primary }}>My Account</p>
                        <h1
                            className="font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface, fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}
                        >
                            Order History
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.18em] mt-2" style={{ color: tokens.muted }}>
                            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: tokens.surfaceHighest, borderTopColor: tokens.primary }} />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-24">
                            <p className="text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}>
                                No orders yet.
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: tokens.muted }}>Your order history will appear here</p>
                            <Link
                                to="/"
                                id="shop-now-cta"
                                className="mt-2 px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.primary; e.currentTarget.style.color = tokens.onSurface }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = tokens.onSurface; e.currentTarget.style.color = tokens.surface }}
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {orders.map((order, idx) => {
                                const status = statusColors[order.status] ?? statusColors.pending
                                return (
                                    <div
                                        key={order._id ?? idx}
                                        className="p-8"
                                        style={{ backgroundColor: tokens.surfaceLow }}
                                    >
                                        {/* Order Header */}
                                        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: tokens.muted }}>
                                                    Order ID
                                                </p>
                                                <p className="text-sm font-mono" style={{ color: tokens.onSurface }}>
                                                    {order.razorpay?.orderId ?? order._id}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: tokens.muted }}>
                                                    Placed on
                                                </p>
                                                <p className="text-[11px]" style={{ color: tokens.onSurface }}>
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <div>
                                                <span
                                                    className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-medium"
                                                    style={{ backgroundColor: status.bg, color: status.text }}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: tokens.muted }}>Total</p>
                                                <p className="text-sm font-medium" style={{ color: tokens.onSurface }}>
                                                    {formatCurrency(order.price?.amount, order.price?.currency)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="mb-5" style={{ height: 1, backgroundColor: tokens.surfaceHighest }} />

                                        {/* Order Items */}
                                        <div className="flex flex-col gap-4">
                                            {order.orderItems?.map((item, i) => (
                                                <div key={i} className="flex gap-4 items-center">
                                                    {item.images?.[0]?.url ? (
                                                        <img
                                                            src={item.images[0].url}
                                                            alt={item.title}
                                                            className="w-16 h-20 object-cover flex-shrink-0"
                                                            style={{ backgroundColor: tokens.surfaceHighest }}
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-20 flex-shrink-0" style={{ backgroundColor: tokens.surfaceHighest }} />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-light leading-snug mb-1" style={{ color: tokens.onSurface }}>{item.title}</p>
                                                        <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: tokens.muted }}>
                                                            Qty: {item.quantity} · {formatCurrency(item.price?.amount, item.price?.currency)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
