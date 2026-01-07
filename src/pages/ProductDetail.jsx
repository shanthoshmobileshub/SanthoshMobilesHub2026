import React from 'react'
import { useParams } from 'react-router-dom'
import products from '../data/products.json'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function ProductDetail(){
  const { id } = useParams()
  const product = products.find(p=> String(p.id) === id)
  const { addToCart } = useCart()

  if(!product) return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-4xl mx-auto px-4 py-12">Product not found</main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-4xl mx-auto px-4 py-12 flex gap-8">
        <div className="w-1/2">
          <img src={product.image} alt={product.title} className="w-full h-auto object-contain rounded" />
        </div>
        <div className="w-1/2">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="text-sm text-gray-600 mt-2">{product.brand} • {product.condition}</div>
          <div className="text-3xl font-extrabold mt-4">{product.price ? `₹${product.price}` : 'Coming Soon'}</div>
          <p className="mt-4 text-gray-700">High quality refurbished device with tested components and warranty options.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={()=> addToCart(product)} className="px-4 py-2 bg-indigo-600 text-white rounded">Add to Cart</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
