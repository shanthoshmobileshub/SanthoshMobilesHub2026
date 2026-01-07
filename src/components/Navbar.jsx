import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import products from "../data/products.json";
import {
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiSearch,
  FiTrash2,
  FiX,
  FiMenu,
} from "react-icons/fi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const CATEGORIES = [
  "Home",
  "Mobiles",
  "AirPods",
  "Smart Watches",
  "iPads",
  "Tabs",
  "Laptops",
  "Accessories",
  "All Products",
  "Device Category",
  "Book a Repair",
];

export default function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { cart, addToCart: ctxAddToCart, removeFromCart: ctxRemoveFromCart } = useCart()
  const { items: wishlist, remove: ctxRemoveFromWishlist, toggle: ctxToggleWishlist } = useWishlist()

  const [showUserModal, setShowUserModal] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // -----------------------------
  // Check admin login state
  // -----------------------------
  useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminFlag);
  }, []);

  function handleAdminLogin() {
    if (adminEmail === "SanthoshMobilesHub@2026" && adminPassword === "SMH@2026") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      setShowUserModal(false);
      navigate("/admin");
    } else {
      alert("Invalid User ID or Password");
    }
  }

  function handleAdminLogout() {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/");
  }

  // -----------------------------
  // Search Logic
  // -----------------------------
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const q = search.trim().toLowerCase();
    const matched = products.filter((p) =>
      `${p.title ?? ""} ${p.brand ?? ""} ${p.category ?? ""}`.toLowerCase().includes(q)
    );
    setSuggestions(matched.slice(0, 8));
  }, [search]);

  useEffect(() => {
    function onDoc(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
      if (!e.target.closest?.(".nav-wishlist")) setShowWishlistDropdown(false);
      if (!e.target.closest?.(".nav-cart")) setShowCartDropdown(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function onSubmitSearch(e) {
    e.preventDefault();
    const q = search.trim();
    const path = q ? `/shop?search=${encodeURIComponent(q)}` : "/shop";
    navigate(path);
    setShowSuggestions(false);
  }

  function addToCart(product) { ctxAddToCart(product) }
  function removeFromCart(id) { ctxRemoveFromCart(id) }
  function removeFromWishlist(id) { ctxRemoveFromWishlist(id) }

  function goToProduct(id) {
    navigate(`/product/${id}`);
  }

  function proceedToPay() {
    navigate("/checkout");
    setShowCartDropdown(false);
  }

  return (
    <header className="w-full">
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* LOGO */}
          <div className="flex items-center gap-3 min-w-[220px]">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/Favicon/SMLogo.png" alt="SM" className="w-10 h-10 object-contain" />
              <div className="text-lg font-semibold">Santhosh Mobiles</div>
            </Link>
          </div>

          {/* SEARCH */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={onSubmitSearch} className="relative">
              <div className="flex items-center border rounded overflow-hidden">
                <span className="px-3 text-gray-400"><FiSearch /></span>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search products"
                  className="w-full px-3 py-2 outline-none"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="px-3 text-gray-500">
                    <FiX />
                  </button>
                )}
              </div>
            </form>

            {showSuggestions && (
              <div ref={suggestionsRef} className="absolute left-0 right-0 mt-2 bg-white border rounded shadow z-50 max-h-72 overflow-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { goToProduct(p.id); setShowSuggestions(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <img src={p.image} alt={p.title} className="w-12 h-12 object-contain" />
                      <div className="flex-1">
                        <div className="text-sm font-medium truncate">{p.title}</div>
                        <div className="text-xs text-gray-500">{p.brand} — {p.category}</div>
                      </div>
                      <div className="text-sm font-bold">₹{p.price}</div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-2">Product not available</div>
                    <a
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded"
                      href={`https://wa.me/919790225832?text=${encodeURIComponent(`Hi, I'm looking for: ${search}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <AiOutlineWhatsApp /> Raise request via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4 min-w-[220px] justify-end">

            {/* ADMIN OR USER ICON */}
            {!isAdmin ? (
              <button onClick={() => setShowUserModal(true)} className="p-2 hover:bg-gray-100 rounded">
                <FiUser size={18} />
              </button>
            ) : (
              <button onClick={handleAdminLogout} className="bg-red-600 text-white px-3 py-2 rounded">
                Logout Admin
              </button>
            )}

            {/* WISHLIST */}
            <div className="relative nav-wishlist">
              <button onClick={() => setShowWishlistDropdown((s) => !s)} className="p-2 hover:bg-gray-100 rounded">
                <FiHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1 rounded">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>

            {/* CART */}
            <div className="relative nav-cart">
              <button onClick={() => setShowCartDropdown((s) => !s)} className="p-2 hover:bg-gray-100 rounded">
                <FiShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1 rounded">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NAV CATEGORIES */}
      <nav className="w-full sticky top-[64px] z-40 bg-white border-t border-b">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-6 py-2 text-sm">
            {CATEGORIES.map((c) => {
              const to = c === "Home" ? "/" : c === "All Products" ? "/shop" : `/shop?category=${encodeURIComponent(c)}`;
              return (
                <li key={c} className="hover:text-indigo-600 hover:underline">
                  <Link to={to}>{c}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* LOGIN / SIGNUP MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Admin Login</h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-500">
                <FiX />
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => alert("Customer signup is not implemented yet")}
                  className="flex-1 border px-3 py-2 rounded"
                >
                  Sign Up
                </button>
              </div>

              <div className="text-xs text-gray-500">
                Only authorized admin can login here.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
