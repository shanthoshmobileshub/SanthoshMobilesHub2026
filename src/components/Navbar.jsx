import React, { useRef, useState } from "react";
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
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { FiSun, FiMoon } from 'react-icons/fi';
import WishlistDropdown from './WishlistDropdown'; // Import WishlistDropdown
import CartDropdown from './CartDropdown'; // Import CartDropdown

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
  const { isAuthenticated, login, logout } = useAuth(); // Use the auth context
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { cart, addToCart: ctxAddToCart, removeFromCart: ctxRemoveFromCart } = useCart();
  const { items: wishlist, remove: ctxRemoveFromWishlist, toggle: ctxToggleWishlist } = useWishlist();

  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state for mobile search

  const [password, setPassword] = useState(""); // Only need password for admin login in modal
  const [adminModalError, setAdminModalError] = useState("");

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  function handleAdminLoginAttempt() {
    setAdminModalError("");
    if (login(password)) { // Use the login function from AuthContext
      setShowAdminLoginModal(false);
      setPassword(""); // Clear password
      navigate("/admin");
    } else {
      setAdminModalError("Invalid Admin Password");
    }
  }

  function handleAdminLogout() {
    logout(); // Use the logout function from AuthContext
    navigate("/");
  }

  // -----------------------------
  // Search Logic
  // -----------------------------
  React.useEffect(() => { // Changed to React.useEffect for clarity but not strictly necessary
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

  React.useEffect(() => {
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
    navigate("/cart");
    setShowCartDropdown(false);
  }

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300">
      {/* MAIN NAV - GLASS EFFECT */}
      <div className="w-full glass-nav shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 md:gap-6">

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-accent"
          >
            <FiMenu size={24} />
          </button>

          {/* LOGO (Hidden if mobile search is active) */}
          <div className={`flex items-center gap-2 min-w-0 shrink ${showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
            <Link to="/" className="flex items-center gap-2 md:gap-3 group min-w-0">
              <img src={`${import.meta.env.BASE_URL}images/Favicon/SMLogo.png`} alt="SM" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-lg group-hover:scale-105 transition-transform shrink-0" />
              <div className="text-lg md:text-xl font-heading font-bold text-slate-900 dark:text-gray-100 tracking-wide truncate">
                Santhosh <span className="text-gradient-gold">Mobiles</span>
              </div>
            </Link>
          </div>

          {/* SEARCH (Desktop) */}
          <div className="hidden md:block flex-1 relative max-w-xl mx-auto" ref={searchRef}>
            <form onSubmit={onSubmitSearch} className="relative group">
              <div className="flex items-center bg-gray-100 dark:bg-primary-light/50 border border-gray-200 dark:border-gray-700/50 rounded-full overflow-hidden focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/30 transition-all">
                <span className="pl-4 text-gray-400 group-focus-within:text-accent"><FiSearch size={18} /></span>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search for premium devices..."
                  className="w-full px-4 py-2 bg-transparent text-slate-900 dark:text-gray-200 placeholder-gray-500 outline-none"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="pr-4 text-gray-400 hover:text-slate-900 dark:hover:text-white">
                    <FiX />
                  </button>
                )}
              </div>
            </form>

            {/* SEARCH SUGGESTIONS (Desktop) */}
            {showSuggestions && (
              <div ref={suggestionsRef} className="absolute left-0 right-0 mt-2 bg-white dark:bg-primary-light border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-auto backdrop-blur-xl">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { goToProduct(p.id); setShowSuggestions(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-primary/50 flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 last:border-none transition-colors"
                    >
                      <img
                        src={p.image.startsWith('http') ? p.image : `${import.meta.env.BASE_URL}${p.image}`}
                        alt={p.title}
                        className="w-12 h-12 object-contain bg-white rounded-md p-1 border border-gray-100"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900 dark:text-gray-200 truncate">{p.title}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{p.brand} • {p.category}</div>
                      </div>
                      <div className="text-sm font-bold text-accent">₹{p.price}</div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <div className="text-sm text-gray-400 mb-3">Product not found in our collection</div>
                    <a
                      className="inline-flex items-center gap-2 px-5 py-2 btn-primary text-sm"
                      href={`https://wa.me/919790225832?text=${encodeURIComponent(`Hi, I'm looking for: ${search}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <AiOutlineWhatsApp size={18} /> Request via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE SEARCH INPUT (Visible when toggled) */}
          {showMobileSearch && (
            <div className="md:hidden flex-1 absolute inset-x-0 top-0 h-full bg-white dark:bg-primary-dark z-20 flex items-center px-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={(e) => { onSubmitSearch(e); setShowMobileSearch(false); }} className="w-full flex items-center gap-2">
                <div className="flex-1 flex items-center bg-gray-100 dark:bg-primary-light border border-gray-200 dark:border-gray-700 rounded-full h-10 px-4">
                  <FiSearch className="text-gray-400 mr-2" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-gray-500"
                  />
                </div>
                <button type="button" onClick={() => setShowMobileSearch(false)} className="p-2 text-gray-500">
                  <FiX size={20} />
                </button>
              </form>

              {/* Mobile Suggestions Dropdown */}
              {search.trim() && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-primary-dark border-t border-gray-100 dark:border-gray-800 shadow-xl max-h-[60vh] overflow-y-auto">
                  {suggestions.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { goToProduct(p.id); setShowMobileSearch(false); setSearch(''); }}
                      className="w-full flex items-center gap-3 p-3 border-b border-gray-50 dark:border-gray-800/50"
                    >
                      <img src={p.image.startsWith('http') ? p.image : `${import.meta.env.BASE_URL}${p.image}`} className="w-10 h-10 object-contain rounded bg-white" />
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-gray-100 truncate">{p.title}</div>
                        <div className="text-xs text-accent">₹{p.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 md:gap-5 min-w-0 justify-end ml-auto">

            {/* SEARCH ICON (Mobile Only) */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-accent"
            >
              <FiSearch size={22} />
            </button>


            {/* THEME TOGGLE (Desktop Only - moved to menu for mobile) */}
            <button
              onClick={toggleTheme}
              className="hidden md:block p-2 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* ADMIN (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="p-2 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors" title="Admin Dashboard">
                    <FiUser size={20} />
                  </Link>
                  <button onClick={handleAdminLogout} className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={() => setShowAdminLoginModal(true)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors" title="Admin Login">
                  <FiUser size={20} />
                </button>
              )}
            </div>

            {/* WISHLIST (Hidden on Mobile - moved to menu) */}
            <div className="relative nav-wishlist hidden md:block">
              <button onClick={() => setShowWishlistDropdown((s) => !s)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <FiHeart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0 -right-0 text-[10px] w-4 h-4 flex items-center justify-center bg-accent text-primary-dark font-bold rounded-full animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>

            {/* CART (Visible on Mobile) */}
            <div className="relative nav-cart">
              <button onClick={() => setShowCartDropdown((s) => !s)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <FiShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-accent text-primary-dark font-bold rounded-full animate-pulse ring-2 ring-white dark:ring-primary-dark">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* NAV CATEGORIES - DESKTOP ONLY */}
      <nav className="hidden md:block w-full bg-gray-50 dark:bg-primary-dark/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-3 text-sm font-medium">
            {CATEGORIES.map((c) => {
              const to = c === "Home" ? "/" : c === "All Products" ? "/shop" : `/shop?category=${encodeURIComponent(c)}`;
              return (
                <li key={c}>
                  <Link to={to} className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors relative group">
                    {c}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ADMIN LOGIN MODAL */}
      {
        showAdminLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-primary-light w-full max-w-md rounded-2xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0"></div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">Admin Access</h3>
                <button onClick={() => setShowAdminLoginModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Security Key</label>
                  <input
                    className="w-full bg-primary-dark border border-gray-700 focus:border-accent text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600"
                    placeholder="Enter Passkey"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLoginAttempt()}
                  />
                </div>

                {adminModalError && (
                  <div className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
                    {adminModalError}
                  </div>
                )}

                <button
                  onClick={handleAdminLoginAttempt}
                  className="w-full btn-primary py-3 rounded-xl"
                >
                  Authenticate
                </button>

                <div className="text-center text-xs text-gray-500 mt-4">
                  Authorized personnel only. All attempts are logged.
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* MOBILE MENU DRAWER */}
      {
        showMobileMenu && (
          <div className="fixed inset-0 z-[60] flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />

            {/* Drawer */}
            <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-xs bg-white dark:bg-primary-dark shadow-2xl overflow-y-auto transition-all duration-300 flex flex-col">

              {/* Header of Drawer */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-primary-light/30 dark:to-primary-dark border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                    Menu
                  </div>
                  <button onClick={() => setShowMobileMenu(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-red-500 transition-colors">
                    <FiX size={24} />
                  </button>
                </div>

                {/* USER PROFILE SECTION */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <FiUser size={24} />
                  </div>
                  <div>
                    {isAuthenticated ? (
                      <>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Admin User</div>
                        <button onClick={() => { handleAdminLogout(); setShowMobileMenu(false); }} className="text-xs text-red-500 font-medium">Sign Out</button>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Guest User</div>
                        <button onClick={() => { setShowAdminLoginModal(true); setShowMobileMenu(false); }} className="text-xs text-accent font-medium">Admin Login</button>
                      </>
                    )}
                  </div>
                </div>

                {/* WISHLIST & THEME QUICK ACTIONS */}
                <div className="flex gap-4">
                  <button
                    onClick={() => { setShowWishlistDropdown(true); setShowMobileMenu(false); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-primary-light border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-gray-200 hover:border-accent hover:text-accent transition-colors relative"
                  >
                    <FiHeart size={16} /> Wishlist
                    {wishlist.length > 0 && <span className="absolute top-1 right-2 w-2 h-2 bg-accent rounded-full"></span>}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="flex-none p-2 bg-white dark:bg-primary-light border border-gray-200 dark:border-gray-700 rounded-lg text-slate-700 dark:text-gray-200 hover:border-accent hover:text-accent transition-colors"
                  >
                    {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shop Categories</h4>
                <nav className="space-y-1">
                  {CATEGORIES.map(c => (
                    <Link
                      key={c}
                      to={c === "Home" ? "/" : c === "All Products" ? "/shop" : `/shop?category=${encodeURIComponent(c)}`}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-accent transition-all group"
                    >
                      <span className="font-medium">{c}</span>
                      <span className="text-gray-300 group-hover:text-accent transition-colors">→</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Support</h4>
                  <a href="tel:+919790225832" className="flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-accent transition-all">
                    <AiOutlineWhatsApp size={20} />
                    <div>
                      <div className="text-xs text-gray-400">Whatsapp & Support</div>
                      <div className="font-bold">+91 97902 25832</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* DROPDOWNS */}
      <WishlistDropdown
        isOpen={showWishlistDropdown}
        onClose={() => setShowWishlistDropdown(false)}
        items={wishlist}
        onRemoveItem={ctxRemoveFromWishlist}
      />

      <CartDropdown
        isOpen={showCartDropdown}
        onClose={() => setShowCartDropdown(false)}
        items={cart}
        onRemoveItem={ctxRemoveFromCart}
        onProceedToPay={proceedToPay}
      />
    </header >
  );
}
