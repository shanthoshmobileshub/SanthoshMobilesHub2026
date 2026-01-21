import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


const API_URL = "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";

export default function CategoryIcons() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}?action=getCategories`)
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          // Map API data to component format
          // API returns { id, name, link, image }
          // Component expects { k (name), img (url/path), link (optional) }
          const mapped = json.data.map(c => ({
            k: c.name,
            img: c.image,
            link: c.link
          }));
          setItems(mapped);
        } else {
          setItems([]); // Ensure strictly empty if no data matches
        }
      })
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

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
