import React from 'react';

const PromoBanner = () => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-10 mt-4 px-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            <div className="relative w-full rounded-[1.5rem] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between shadow-sm overflow-hidden" 
                style={{ 
                    background: 'linear-gradient(90deg, #FFE8D6 0%, #FDF4E3 40%, #FDECF0 80%, #F5E6EC 100%)',
                    fontFamily: "'Inter', sans-serif"
                }}>
                
                {/* Left side: Discount text */}
                <div className="flex flex-col mb-6 md:mb-0 z-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#F05A28' }}>
                        <span style={{ background: '-webkit-linear-gradient(0deg, #F58220, #ED1C24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Get 25% Off
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 font-medium">Up To ₹200 Off*</p>
                </div>

                {/* Center: Coupon Code */}
                <div className="flex flex-col items-center z-10">
                    <div className="bg-white rounded-xl px-5 py-2.5 flex items-center gap-3 shadow-sm border border-gray-100">
                        <div className="flex flex-col text-left border-r border-gray-200 pr-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Coupon</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Code</span>
                        </div>
                        <span className="text-xl md:text-2xl font-black tracking-wider text-[#1b1c1a]">SNITCHSAVE</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">*On your first order | T&C apply</p>
                </div>

                {/* Right side: Large % Graphic */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 md:opacity-100 md:relative md:top-auto md:translate-y-0 z-0 pl-4">
                    <span className="text-7xl md:text-8xl font-black italic" style={{ 
                        background: '-webkit-linear-gradient(45deg, #7A6E63, #C9A96E, #B5ADA3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))'
                    }}>
                        %
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
