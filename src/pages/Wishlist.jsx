import React from 'react'
import Footer from '../components/Footer'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist(){
  const { items, remove } = useWishlist()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
        {items.length === 0 ? (
          <div className="text-gray-600">No items in wishlist yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(i=> (
              <div key={i.id} className="bg-white rounded-lg p-4 card-shadow">
                <img src={i.image} alt={i.title} className="w-full object-contain rounded bg-white" />
                <h4 className="mt-2 font-semibold">{i.title}</h4>
                <div className="text-sm text-gray-600">{i.brand}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=> remove(i.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
