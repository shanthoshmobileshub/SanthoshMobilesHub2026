import React from 'react'
import { Link } from 'react-router-dom'

const items = [
  { k: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { k: 'AirPods', img: 'https://images.unsplash.com/photo-1616596871232-4f06a8f5b7b5?w=400' },
  { k: 'iPads', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },
  { k: 'Tabs', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
  { k: 'Smart Watches', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400' },
  { k: 'Accessories', img: 'https://images.unsplash.com/photo-1541534401786-8b1f2f6b1d6d?w=400' }
]

export default function CategoryIcons() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-6">Browse by Category</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {items.map(i => (
          <Link key={i.k} to={`/shop?category=${encodeURIComponent(i.k)}`} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 group-hover:from-accent group-hover:to-yellow-400 transition-all duration-300 shadow-md">
              <img src={i.img} alt={i.k} className="w-full h-full object-cover rounded-full border-2 border-white dark:border-primary-dark" />
            </div>
            <span className="mt-3 text-sm font-medium text-slate-700 dark:text-gray-300 group-hover:text-accent transition-colors">{i.k}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
