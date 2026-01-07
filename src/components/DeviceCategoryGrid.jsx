import React from 'react'
import { Link } from 'react-router-dom'

const cards = [
  'Sealed Boxes','Open Boxes (Non-Activated)','Seal Cut (Less than 2 months)','2–5 Months','5–9 Months','9–11 Months','11+ Months'
]

export default function DeviceCategoryGrid(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h3 className="text-xl font-semibold mb-4">Shop By Device Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {cards.map(c=> (
          <Link key={c} to={`/shop?condition=${encodeURIComponent(c)}`} className="bg-white p-4 rounded-lg text-center card-shadow">
            <div className="text-sm font-medium">{c}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
