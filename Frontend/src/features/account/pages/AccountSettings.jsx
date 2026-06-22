import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useAccount } from '../hook/useAccount'

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceLowest: '#ffffff',
    surfaceHigh: '#eae8e5',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    primaryDark: '#745a27',
    outlineVariant: '#d0c5b5',
    outline: '#7f7668',
}

const inputStyle = {
    color: tokens.onSurface,
    borderBottom: `1px solid ${tokens.outlineVariant}`,
    fontFamily: "'Inter', sans-serif"
}

export default function AccountSettings() {
    const user = useSelector(state => state.user)
    const { handleUpdateProfile, handleAddAddress, handleDeleteAddress, handleGetProfile } = useAccount()

    const [profile, setProfile] = useState({ fullname: '', contact: '' })
    const [profileSaved, setProfileSaved] = useState(false)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [addresses, setAddresses] = useState([])
    const [addressForm, setAddressForm] = useState({
        label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false
    })

    useEffect(() => {
        handleGetProfile().then(u => {
            setProfile({ fullname: u.fullname ?? '', contact: u.contact ?? '' })
            setAddresses(u.addresses ?? [])
        })
    }, [])

    async function onSaveProfile(e) {
        e.preventDefault()
        await handleUpdateProfile(profile)
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 2500)
    }

    async function onAddAddress(e) {
        e.preventDefault()
        const updated = await handleAddAddress(addressForm)
        setAddresses(updated)
        setShowAddressForm(false)
        setAddressForm({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
    }

    async function onDeleteAddress(id) {
        await handleDeleteAddress(id)
        setAddresses(prev => prev.filter(a => a._id !== id))
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
                        <Link to="/account" style={{ color: tokens.primary, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Profile</Link>
                        <Link to="/account/wishlist" className="hover:opacity-70 transition-opacity">Wishlist</Link>
                        <Link to="/account/orders" className="hover:opacity-70 transition-opacity">Orders</Link>
                    </div>
                </nav>

                <div className="max-w-3xl mx-auto px-8 lg:px-0 pt-14">
                    {/* Page Title */}
                    <div className="mb-12">
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-3 font-medium" style={{ color: tokens.primary }}>My Account</p>
                        <h1
                            className="font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface, fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}
                        >
                            Account Settings
                        </h1>
                    </div>

                    {/* Profile Section */}
                    <section className="mb-14">
                        <h2
                            className="text-[10px] uppercase tracking-[0.22em] font-medium mb-8"
                            style={{ color: tokens.secondary, borderBottom: `1px solid ${tokens.surfaceHighest}`, paddingBottom: '1rem' }}
                        >
                            Personal Details
                        </h2>
                        <form onSubmit={onSaveProfile} className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: tokens.secondary }}>
                                        Full Name
                                    </label>
                                    <input
                                        value={profile.fullname}
                                        onChange={e => setProfile(p => ({ ...p, fullname: e.target.value }))}
                                        className="w-full bg-transparent outline-none py-3 text-sm"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderBottomColor = tokens.primary}
                                        onBlur={e => e.target.style.borderBottomColor = tokens.outlineVariant}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: tokens.secondary }}>
                                        Contact Number
                                    </label>
                                    <input
                                        value={profile.contact}
                                        onChange={e => setProfile(p => ({ ...p, contact: e.target.value }))}
                                        className="w-full bg-transparent outline-none py-3 text-sm"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderBottomColor = tokens.primary}
                                        onBlur={e => e.target.style.borderBottomColor = tokens.outlineVariant}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: tokens.secondary }}>
                                        Email Address
                                    </label>
                                    <input
                                        value={user?.email ?? ''}
                                        disabled
                                        className="w-full bg-transparent outline-none py-3 text-sm opacity-50"
                                        style={inputStyle}
                                        title="Email cannot be changed"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    id="save-profile-btn"
                                    className="px-10 py-3 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.primary; e.currentTarget.style.color = tokens.onSurface }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = tokens.onSurface; e.currentTarget.style.color = tokens.surface }}
                                >
                                    Save Changes
                                </button>
                                {profileSaved && (
                                    <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#5a7a5a' }}>
                                        ✓ Saved successfully
                                    </span>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* Addresses Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8" style={{ borderBottom: `1px solid ${tokens.surfaceHighest}`, paddingBottom: '1rem' }}>
                            <h2 className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: tokens.secondary }}>
                                Saved Addresses
                            </h2>
                            <button
                                id="add-address-btn"
                                onClick={() => setShowAddressForm(s => !s)}
                                className="text-[10px] uppercase tracking-[0.2em] transition-colors"
                                style={{ color: tokens.primary }}
                            >
                                {showAddressForm ? '— Cancel' : '+ Add Address'}
                            </button>
                        </div>

                        {/* Add Address Form */}
                        {showAddressForm && (
                            <form onSubmit={onAddAddress} className="mb-10 p-8" style={{ backgroundColor: tokens.surfaceLow }}>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-6" style={{ color: tokens.secondary }}>New Address</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {[
                                        { label: 'Label (e.g. Home)', key: 'label', placeholder: 'Home' },
                                        { label: 'Street Line 1', key: 'line1', placeholder: '123, MG Road' },
                                        { label: 'Street Line 2 (optional)', key: 'line2', placeholder: 'Apt / Suite' },
                                        { label: 'City', key: 'city', placeholder: 'Bengaluru' },
                                        { label: 'State', key: 'state', placeholder: 'Karnataka' },
                                        { label: 'Pincode', key: 'pincode', placeholder: '560001' },
                                    ].map(f => (
                                        <div key={f.key} className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-[0.16em]" style={{ color: tokens.secondary }}>{f.label}</label>
                                            <input
                                                value={addressForm[f.key]}
                                                onChange={e => setAddressForm(p => ({ ...p, [f.key]: e.target.value }))}
                                                placeholder={f.placeholder}
                                                required={f.key !== 'line2'}
                                                className="w-full bg-transparent outline-none py-2 text-sm"
                                                style={{ ...inputStyle, backgroundColor: 'transparent' }}
                                                onFocus={e => e.target.style.borderBottomColor = tokens.primary}
                                                onBlur={e => e.target.style.borderBottomColor = tokens.outlineVariant}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer mb-6">
                                    <input
                                        type="checkbox"
                                        checked={addressForm.isDefault}
                                        onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))}
                                        className="w-4 h-4"
                                        style={{ accentColor: tokens.primary }}
                                    />
                                    <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: tokens.secondary }}>Set as default address</span>
                                </label>
                                <button
                                    type="submit"
                                    id="save-address-btn"
                                    className="px-10 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-300"
                                    style={{ backgroundColor: tokens.onSurface, color: tokens.surface }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.primary; e.currentTarget.style.color = tokens.onSurface }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = tokens.onSurface; e.currentTarget.style.color = tokens.surface }}
                                >
                                    Save Address
                                </button>
                            </form>
                        )}

                        {/* Address Cards */}
                        {addresses.length === 0 ? (
                            <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: tokens.muted }}>
                                No addresses saved yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr._id}
                                        className="p-6 relative"
                                        style={{ backgroundColor: tokens.surfaceLow, border: addr.isDefault ? `1px solid ${tokens.primary}` : `1px solid transparent` }}
                                    >
                                        {addr.isDefault && (
                                            <span className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.2em] px-2 py-1" style={{ backgroundColor: tokens.primary, color: '#fff' }}>
                                                Default
                                            </span>
                                        )}
                                        <p className="text-[10px] uppercase tracking-[0.18em] font-medium mb-3" style={{ color: tokens.secondary }}>{addr.label}</p>
                                        <p className="text-sm leading-relaxed" style={{ color: tokens.onSurface }}>
                                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                                            {addr.city}, {addr.state} — {addr.pincode}
                                        </p>
                                        <button
                                            id={`delete-addr-${addr._id}`}
                                            onClick={() => onDeleteAddress(addr._id)}
                                            className="mt-4 text-[10px] uppercase tracking-[0.18em] transition-colors hover:opacity-70"
                                            style={{ color: tokens.muted }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    )
}
