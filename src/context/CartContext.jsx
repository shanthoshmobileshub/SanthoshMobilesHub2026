import React, { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("sm_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sm_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p));
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}