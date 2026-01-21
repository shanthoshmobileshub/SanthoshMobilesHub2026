import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



const API_URL = "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";
const CACHE_KEY = "smh_categories_data";

export default function CategoryIcons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try to load from cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          // If we have cache, we are not "loading" in the blocking sense, 
          // but we still fetch to update.
          setLoading(false);
        }
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    // 2. Fetch fresh data
    fetch(`${API_URL}?action=getCategories`)
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          // Map API data
          const mapped = json.data.map(c => ({
            k: c.name,
            img: c.image,
            link: c.link
          }));

          setItems(mapped);
          localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        } else {
          // If expressly empty, clear? 
          if (json.data) {
            setItems([]);
            localStorage.removeItem(CACHE_KEY);
          }
        }
      })
      .catch(err => console.error("Failed to fetch categories", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 mb-3"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-6">Browse by Category</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {items.map(i => (
          <Link
            key={i.k}
            to={i.link || `/shop?category=${encodeURIComponent(i.k)}`}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 group-hover:from-accent group-hover:to-yellow-400 transition-all duration-300 shadow-md">
              <img
                src={i.img?.startsWith('http') ? i.img : `${import.meta.env.BASE_URL}${i.img}`}
                alt={i.k}
                className="w-full h-full object-cover rounded-full border-2 border-white dark:border-primary-dark"
              />
            </div>
            <span className="mt-3 text-sm font-medium text-slate-700 dark:text-gray-300 group-hover:text-accent transition-colors">{i.k}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
