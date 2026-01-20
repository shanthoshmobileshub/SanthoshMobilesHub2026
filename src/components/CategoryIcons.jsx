import React from 'react'
import { Link } from 'react-router-dom'

const items = [
  { k: 'Mobiles', img: 'images/Category/Mobiles.jpg' },
  { k: 'AirPods', img: 'images/Category/AirPods.jpg' },
  { k: 'iPads', img: 'images/Category/iPads.jpg' },
  { k: 'Tabs', img: 'images/Category/Tabs.jpg' },
  { k: 'Smart Watches', img: 'images/Category/Smart Watches.jpg' },
  { k: 'Accessories', img: 'images/Category/Accessories.jpg' }
]

export default function CategoryIcons() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-6">Browse by Category</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {items.map(i => (
          <Link key={i.k} to={`/shop?category=${encodeURIComponent(i.k)}`} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 group-hover:from-accent group-hover:to-yellow-400 transition-all duration-300 shadow-md">
              <img src={`${import.meta.env.BASE_URL}${i.img}`} alt={i.k} className="w-full h-full object-cover rounded-full border-2 border-white dark:border-primary-dark" />
            </div>
            <span className="mt-3 text-sm font-medium text-slate-700 dark:text-gray-300 group-hover:text-accent transition-colors">{i.k}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
