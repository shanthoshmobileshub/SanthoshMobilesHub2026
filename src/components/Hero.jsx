import React from 'react'
// ...existing code...
import ProductCarousel from './ProductCarousel';
// ...existing code...
export default function Hero(){
  return (
    <section className="relative">
      <div className="h-80 md:h-96 bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold">Welcome to Santhosh Mobiles</h2>
          <p className="mt-2 md:mt-4">Smarter. Faster. Sleeker.</p>
          <p className="mt-2 font-semibold">Latest Smartphones Available</p>
          <div className="mt-4">
            <button className="bg-white text-indigo-700 px-5 py-2 rounded-full font-semibold">Explore Now</button>
          </div>
        </div>
      </div>
          {/* Embedded scrolling carousel of Mobiles */}
          <div className="w-full mt-6">
            <ProductCarousel embed={true} />
          </div>
    </section>
  )
}
