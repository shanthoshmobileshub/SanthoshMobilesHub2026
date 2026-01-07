import React from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage(){
  const { cart = [], removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const latest = cart.length ? cart[cart.length - 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">Your cart is empty.</p>
            <button onClick={() => navigate("/")} className="bg-indigo-600 text-white px-4 py-2 rounded">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 border p-4 rounded">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.brand}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.price ? `₹${item.price}` : 'Coming Soon'}</div>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 mt-2">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => navigate('/checkout')} className="bg-green-600 text-white px-5 py-2 rounded">Proceed to Checkout</button>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold">Latest Item</h3>
              {latest && (
                <div className="flex gap-4 items-center mt-3">
                  <img src={latest.image} alt={latest.title} className="w-28 h-28 object-contain rounded" />
                  <div>
                    <div className="font-semibold">{latest.title}</div>
                    <div className="text-sm text-gray-600">Qty: {latest.qty}</div>
                    <div className="mt-2">{latest.price ? `₹${latest.price}` : 'Coming Soon'}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">All Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cart.map(c=> (
                  <div key={c.id} className="bg-white p-4 rounded card-shadow">
                    <img src={c.image} alt={c.title} className="w-full h-36 object-contain rounded" />
                    <div className="mt-2 font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-600">Qty: {c.qty}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={()=> removeFromCart(c.id)} className="px-3 py-1 border rounded">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={clearCart} className="px-4 py-2 bg-red-500 text-white rounded">Clear Cart</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
