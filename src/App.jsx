import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import Checkout from "./components/Checkout";
import PaymentConfirm from "./components/PaymentConfirm";

import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";

// 🔒 PROTECTED ADMIN ROUTE
function ProtectedAdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <p className="p-6 text-red-600 font-semibold">Not Authorized</p>;
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirm" element={<PaymentConfirm />} />

            {/* 🔐 ADMIN ONLY DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
