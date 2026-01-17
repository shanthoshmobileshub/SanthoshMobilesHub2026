import React from 'react'
import { Link } from 'react-router-dom'

const cards = [
  'Sealed Boxes', 'Open Boxes (Non-Activated)', 'Seal Cut (Less than 2 months)', '2–5 Months', '5–9 Months', '9–11 Months', '11+ Months'
]

export default function DeviceCategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-6">Shop Personalized Computer</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {cards.map(c => (
          <Link key={c} to={`/shop?condition=${encodeURIComponent(c)}`} className="bg-white border border-gray-200 dark:bg-primary-light/30 dark:border-gray-800 p-4 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-primary-light hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 group shadow-sm dark:shadow-none">
            <div className="text-sm font-medium text-slate-700 dark:text-gray-300 group-hover:text-accent font-sans">{c}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
