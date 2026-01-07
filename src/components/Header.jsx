import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Mobiles",
  "AirPods",
  "Smart Watches",
  "iPads",
  "Tabs",
  "Laptops",
  "Accessories",
  "All Products",
  "Device Category",
  "Book a Repair"
];

export default function Header() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function onSearchSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(`/shop${term ? `?search=${encodeURIComponent(term)}` : ""}`);
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <div className="logo">Santhosh Mobiles</div>

        <nav className="flex-1">
          <ul className="flex gap-4">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  to={c === "All Products" ? "/shop" : `/shop?category=${encodeURIComponent(c)}`}
                  className="text-sm text-gray-700 hover:text-indigo-600"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form onSubmit={onSearchSubmit} className="flex items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="px-3 py-1 border rounded-l"
            aria-label="Search products"
          />
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-r">Search</button>
        </form>
      </div>
    </header>
  );
}