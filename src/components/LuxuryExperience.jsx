import React from 'react'
import ProductCarousel from './ProductCarousel';

export default function LuxuryExperience() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* BACKGROUND & OVERLAY */}
            <div className="absolute inset-0 bg-white dark:bg-primary-dark z-0 transition-colors duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-accent),0.15),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.5),transparent_50%)]"></div>
            </div>

            {/* HERO CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center">

                {/* BADGE */}
                <div className="mb-6 animate-fade-in-up">
                    <span className="px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 dark:bg-accent/10 text-accent text-sm font-semibold tracking-wider uppercase">
                        #1 Premium Mobile Destination in Tiruppur
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight animate-fade-in-up delay-100 transition-colors duration-300">
                    Experience <span className="text-gradient-gold">Luxury</span> <br />
                    in Every Pixel.
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 animate-fade-in-up delay-200">
                    Discover the latest premium smartphones, exclusive accessories, and expert service.
                    Elevate your digital lifestyle with Santhosh Mobiles.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up delay-300">
                    <button className="btn-primary text-lg px-8 py-3">
                        Shop Premium Collection
                    </button>
                    <button className="px-8 py-3 rounded-full border border-gray-600 text-gray-300 font-semibold hover:border-accent hover:text-accent transition-all duration-300">
                        Book Service
                    </button>
                </div>

                {/* STATS / TRUST INDICATORS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-gray-200 dark:border-gray-800 pt-8 w-full max-w-4xl opacity-80 animate-fade-in-up delay-500 transition-colors duration-300">
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">5K+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-500">Happy Customers</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-500">Genuine Products</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
                        <div className="text-sm text-gray-600 dark:text-gray-500">Support</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">Fast</div>
                        <div className="text-sm text-gray-600 dark:text-gray-500">Delivery</div>
                    </div>
                </div>
            </div>

            {/* PRODUCT CAROUSEL */}
            <div className="relative w-full z-10 -mt-10 mb-10 opacity-0 animate-fade-in-up delay-700" style={{ animationFillMode: 'forwards' }}>
                <ProductCarousel embed={true} />
            </div>

        </section >
    )
}
