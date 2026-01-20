import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import initialProducts from '../data/products.json'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

const API_URL = "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()

  // Try to find in local JSON first
  const [product, setProduct] = useState(() => {
    return initialProducts.find(p => String(p.id) === id) || null;
  });
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    // If not found in local JSON, fetch from API
    if (!product) {
      fetch(`${API_URL}?action=getProducts`)
        .then(res => res.json())
        .then(json => {
          if (json.data && Array.isArray(json.data)) {
            // Find the product in the fetched list
            const found = json.data.find(p => String(p.id) === id);
            if (found) setProduct(found);
          }
        })
        .catch(err => console.error("Error fetching product", err))
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  if (loading) return (
    <div className="min-h-screen pt-40 text-center flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
      <p className="text-gray-500">Loading product details...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-dark transition-colors duration-300">
      <main className="max-w-6xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-12 flex-1">

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-white dark:bg-white/5 p-8 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800">
          <img
            src={product.image?.startsWith('http') ? product.image : `${import.meta.env.BASE_URL}${product.image?.startsWith('/') ? product.image.slice(1) : product.image}`}
            alt={product.title}
            className="max-h-[500px] w-full object-contain drop-shadow-md"
          />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="text-sm font-bold text-accent uppercase tracking-wider mb-2">{product.brand}</div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4 leading-tight">{product.title}</h1>

          <div className="flex items-center gap-4 mb-8 text-gray-500 dark:text-gray-400">
            <span className="bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200">
              {product.category}
            </span>
            <span>•</span>
            <span>{product.condition || 'Brand New'}</span>
          </div>

          <div className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            {product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Coming Soon'}
          </div>

          <div className="prose dark:prose-invert max-w-none mb-10 text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {product.description || "High quality device, fully tested and certified. Comes with warranty options and compatible accessories."}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-accent/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              Add to Cart
            </button>
            <button
              className="flex-1 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
