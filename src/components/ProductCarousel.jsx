import React, { useEffect, useRef, useState } from 'react'
import products from '../data/products.json'
import { Link } from 'react-router-dom'

const MOBILE_SLIDES = products.filter(p => p.category === 'Mobiles')

export default function ProductCarousel({ embed = false }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const length = MOBILE_SLIDES.length || 0
  const timerRef = useRef(null)

  useEffect(() => {
    if (paused || length === 0) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % length)
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [paused, length])

  function prev() { setIndex(i => (i - 1 + length) % length) }
  function next() { setIndex(i => (i + 1) % length) }

  if (length === 0) return null

  return (
    <div className={`${embed ? 'w-full px-4' : 'max-w-6xl mx-auto px-4 py-6'}`}>
      <div className={`relative overflow-hidden rounded-lg ${embed ? 'h-44 md:h-64' : 'h-64 md:h-96'}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="absolute inset-0 flex transition-transform duration-700" style={{ transform: `translateX(-${index * 100}%)` }}>
          {MOBILE_SLIDES.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="w-full flex-shrink-0 relative flex items-center justify-center bg-black/5">
              <img src={`${import.meta.env.BASE_URL}${p.image.startsWith('/') ? p.image.slice(1) : p.image}`} alt={p.title} className={`${embed ? 'max-h-40 md:max-h-56' : 'w-full h-64 md:h-96'} object-contain`} />
              <div className={`absolute left-4 bottom-4 text-black ${embed ? 'text-sm' : 'text-lg md:text-2xl'}`}>
                <h3 className={`font-extrabold ${embed ? 'text-base' : 'text-2xl'}`}>{p.title}</h3>
                <p className={`font-extrabold ${embed ? 'text-xs' : 'text-sm'} text-black`}>{p.brand} • {p.condition}</p>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full">‹</button>
        <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full">›</button>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
          {MOBILE_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} aria-label={`Go to slide ${i + 1}`}></button>
          ))}
        </div>
      </div>
    </div>
  )
}
