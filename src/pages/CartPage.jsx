import React from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";

export default function CartPage() {
  const { cart = [], removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Helper to safely parse price
  const getPrice = (p) => {
    if (typeof p === 'number') return p;
    if (!p) return 0;
    // Remove comma if present
    const clean = String(p).replace(/,/g, '');
    return Number(clean) || 0;
  };

  const total = cart.reduce((sum, item) => sum + (getPrice(item.price) * (item.qty || 1)), 0);

  const handleWhatsAppOrder = () => {
    let message = "👋 Hello Santhosh Mobiles, I would like to place an order:\n\n";

    cart.forEach((item, index) => {
      const p = getPrice(item.price);
      message += `${index + 1}. *${item.title}* \n   Price: ₹${p.toLocaleString('en-IN')} x ${item.qty || 1}\n\n`;
    });

    message += `----------------\n*Total Amount: ₹${total.toLocaleString('en-IN')}*\n----------------\n`;
    message += "\nPlease confirm availability and delivery details. My address is:\n(Type your address here)";

    // Use the official Whatsapp link format
    const url = `https://wa.me/919790225832?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-dark transition-colors duration-300">
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <FiArrowLeft size={24} className="text-slate-700 dark:text-gray-200" />
          </button>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <FiShoppingBag /> Your Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-primary-light/30 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <FiShoppingBag size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white dark:bg-primary-light/50 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center border border-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                    <div className="text-accent font-bold mt-1">₹{getPrice(item.price).toLocaleString('en-IN')}</div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                      Qty: {item.qty || 1}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <button onClick={clearCart} className="text-sm text-red-500 font-medium hover:underline">
                  Clear Cart
                </button>
                <button onClick={() => navigate("/")} className="text-sm text-accent font-medium hover:underline">
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-primary-light/50 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl sticky top-24 shadow-lg">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery</span>
                    <span className="text-green-500 font-medium">To be discussed</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-xl text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 group"
                  >
                    <AiOutlineWhatsApp size={24} className="group-hover:scale-110 transition-transform" />
                    Order via WhatsApp
                  </button>

                  <p className="text-xs text-center text-gray-400 px-4">
                    Clicking above will open WhatsApp with your order details pre-filled. You can discuss delivery and payment there.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
