import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="w-full pt-16 pb-12 px-8 lg:px-16 xl:px-24" style={{ backgroundColor: '#fbf9f6', borderTop: '1px solid #e4e2df', fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 justify-between">
                
                {/* Column 1 & 2 wrapper for mobile/tablet */}
                <div className="flex flex-col sm:flex-row gap-12 lg:gap-16">
                    {/* ONLINE SHOPPING & USEFUL LINKS */}
                    <div className="flex flex-col gap-10">
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] mb-4" style={{ color: '#1b1c1a' }}>Online Shopping</h3>
                            <ul className="flex flex-col gap-2 text-[13px]" style={{ color: '#7A6E63' }}>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Men</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Women</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Kids</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Home</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Beauty</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Genz</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Gift Cards</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Snitch Insider</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] mb-4" style={{ color: '#1b1c1a' }}>Useful Links</h3>
                            <ul className="flex flex-col gap-2 text-[13px]" style={{ color: '#7A6E63' }}>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Blog</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Careers</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Site Map</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Corporate Information</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Whitehat</Link></li>
                                <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Snitch Global</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* CUSTOMER POLICIES */}
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] mb-4" style={{ color: '#1b1c1a' }}>Customer Policies</h3>
                        <ul className="flex flex-col gap-2 text-[13px]" style={{ color: '#7A6E63' }}>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Contact Us</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">FAQ</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">T&C</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Terms Of Use</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Track Orders</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Shipping</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Cancellation</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Returns</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Privacy policy</Link></li>
                            <li><Link to="/" className="hover:text-[#1b1c1a] transition-colors">Grievance Redressal</Link></li>
                        </ul>
                    </div>
                </div>

                {/* APP & SOCIAL */}
                <div className="flex flex-col gap-10">
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] mb-4" style={{ color: '#1b1c1a' }}>Experience Snitch App on Mobile</h3>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414C17.523 12.1932 20.0822 10.6384 20.1983 10.5694C18.6186 8.26189 16.1423 7.90422 15.3093 7.79815C13.2215 7.58941 11.206 9.03451 10.138 9.03451C9.06995 9.03451 7.42065 7.82015 5.68817 7.85408C3.42055 7.88854 1.32832 9.17244 0.160166 11.2038C-2.22238 15.334 0.771966 21.4398 3.08419 24.7749C4.20847 26.3986 5.51351 28.2173 7.23466 28.1483C8.90847 28.0788 9.53982 27.0543 11.5367 27.0543C13.5327 27.0543 14.1165 28.1483 15.8624 28.1134C17.655 28.0788 18.7797 26.467 19.8927 24.8433C21.1896 22.9515 21.7249 21.0942 21.7483 20.991C21.7011 20.9702 17.523 19.3807 17.523 15.3414Z"/><path d="M14.4925 5.09341C15.4227 3.96865 16.0527 2.39958 15.8825 0.833984C14.5368 0.887661 12.897 1.73356 11.9197 2.85832C11.0421 3.84439 10.2974 5.44855 10.5147 6.98305C12.0232 7.10014 13.5631 6.21852 14.4925 5.09341Z"/></svg>
                                <div className="text-left">
                                    <p className="text-[8px] uppercase">Download on the</p>
                                    <p className="text-sm font-semibold leading-tight">App Store</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.38 1.488C2.518 1.341 2.766 1.25 3.09 1.25c.343 0 .736.1 1.157.29L16.29 7.026c.712.33 1.178.694 1.36.945-1.127.842-13.627 8.358-13.882 8.513l-1.39-15z" fill="#00c8ff"/><path d="M19.168 11.126l-1.518-.817c-.422-.227-.923-.496-1.472-.803l-1.077-.6L2.38 1.488l9.167 9.167 7.62 1.47z" fill="#00e676"/><path d="M2.38 1.488L21.758 12.5c-.328.283-1.07.65-2.006 1.096l-1.783.845-6.42 2.81L2.38 1.488z" fill="#ff3d00"/><path d="M11.55 17.252l6.42-2.81 1.782-.846c1.23-.585 1.62-.93 1.62-1.096 0-.166-.39-.51-1.62-1.096l-.888-.423-7.314 6.27z" fill="#ffc400"/></svg>
                                <div className="text-left">
                                    <p className="text-[8px] uppercase">GET IT ON</p>
                                    <p className="text-sm font-semibold leading-tight">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] mb-4" style={{ color: '#1b1c1a' }}>Keep in touch</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300">
                                {/* FB */}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                            </a>
                            <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300">
                                {/* Twitter */}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                            </a>
                            <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300">
                                {/* Youtube */}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"></path><polyline points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polyline></svg>
                            </a>
                            <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300">
                                {/* Insta */}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* GUARANTEES */}
                <div className="flex flex-col gap-6 lg:ml-auto max-w-xs">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex-shrink-0">
                            {/* Original icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="#7A6E63" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><circle cx="12" cy="11" r="3"></circle></svg>
                        </div>
                        <div>
                            <p className="text-sm" style={{ color: '#1b1c1a' }}>
                                <span className="font-bold">100% ORIGINAL</span> guarantee for all products at snitch.com
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4 mt-2">
                        <div className="w-12 h-12 flex-shrink-0 text-[#7A6E63]">
                            {/* Return icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline><text x="8" y="16" fontSize="8" fontWeight="bold">14</text></svg>
                        </div>
                        <div>
                            <p className="text-sm" style={{ color: '#1b1c1a' }}>
                                <span className="font-bold">Return within 14days</span> of receiving your order
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Bottom Footer Border & Search bar placeholder (matching design) */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 flex items-center justify-center border-t border-[#e4e2df]">
                <span
                    className="text-[10px] uppercase tracking-[0.35em]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                >
                    Snitch. © {new Date().getFullYear()}
                </span>
            </div>
        </footer>
    );
};

export default Footer;
