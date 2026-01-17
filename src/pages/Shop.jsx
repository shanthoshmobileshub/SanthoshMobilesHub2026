import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import initialProducts from "../data/products.json";
import ProductCard from "../components/ProductCard";

// Replace with your actual deployment URL
const API_URL = "https://script.google.com/macros/s/AKfycbyZn3hERrmuATHMoOADARri9ewATpzuJOmJW1xBkksBl2XOHptfeFB18lUQXFa5eQ-xlw/exec";

export default function Shop() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = (params.get("search") || "").trim();
  const category = (params.get("category") || "").trim();
  const qLower = q.toLowerCase();
  const catLower = category.toLowerCase();

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false); // Can be used to show spinner if needed

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}?action=getProducts`);
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          // Merge API products? Or replace? 
          // Replacing is safer to ensure deleted products are gone.
          // But we need to ensure local images work.
          // API image URLs might be full URLs. Local JSON has relative paths.
          // We'll trust the API data structure if it matches.
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic products, using fallback.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    // category filter (exact match, case-insensitive) — if no category, allow all
    const byCategory = category ? ((p.category || "").toLowerCase() === catLower) : true;

    // search filter (if present) — matches title / brand / category
    const bySearch = q
      ? `${p.title ?? ""} ${p.brand ?? ""} ${p.category ?? ""}`.toLowerCase().includes(qLower)
      : true;

    return byCategory && bySearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
          {category ? category : "All Products"}
        </h1>
        {products === initialProducts && (
          <span className="text-xs text-gray-400">⚡ Fast Loaded (Catalog v2 - Live)</span>
        )}
      </div>

      {q && <p className="mb-6 text-gray-600 dark:text-gray-400">Showing results for <strong>"{q}"</strong></p>}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id ?? p._id ?? Math.random()} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-primary-light/30 rounded-3xl">
          <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Not Available</h2>
          <p className="mb-6 text-gray-500">No products found for <strong>{category || q || "your query"}</strong>.</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">You can request via WhatsApp:</p>
          <div className="flex justify-center gap-4">
            <a className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2" target="_blank" rel="noreferrer" href={`https://wa.me/919790225832?text=${encodeURIComponent(`Looking for: ${category || q}`)}`}>
              Message 9790225832
            </a>
          </div>
        </div>
      )}
    </div>
  );
}