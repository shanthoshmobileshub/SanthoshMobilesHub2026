import React from "react";
import { useLocation } from "react-router-dom";
import products from "../data/products.json";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = (params.get("search") || "").trim();
  const category = (params.get("category") || "").trim();
  const qLower = q.toLowerCase();
  const catLower = category.toLowerCase();

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {category ? category : "All Products"}
      </h1>

      {q && <p className="mb-4">Showing results for <strong>"{q}"</strong></p>}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {filtered.map((p) => (
            <ProductCard key={p.id ?? p._id ?? Math.random()} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-3">Not Available</h2>
          <p className="mb-4">No products found for <strong>{category || q || "your query"}</strong>.</p>
          <p className="mb-4">You can request via WhatsApp:</p>
          <div className="flex justify-center gap-4">
            <a className="bg-green-600 text-white px-4 py-2 rounded" target="_blank" rel="noreferrer" href={`https://wa.me/919790225832?text=${encodeURIComponent(`Looking for: ${category || q}`)}`}>9790225832</a>
            <a className="bg-green-600 text-white px-4 py-2 rounded" target="_blank" rel="noreferrer" href={`https://wa.me/917812899145?text=${encodeURIComponent(`Looking for: ${category || q}`)}`}>7812899145</a>
          </div>
        </div>
      )}
    </div>
  );
}