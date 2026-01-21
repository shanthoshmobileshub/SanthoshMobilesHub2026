import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";
const CACHE_KEY = "smh_footer_data";

export default function Footer() {
  const [data, setData] = useState({
    description: "Your premium destination for the latest smartphones, accessories, and expert repairs. Experience luxury service.",
    address: "Collector Office, Tiruppur - 641 604.",
    phone: "+91 97902 25832",
    email: "contact@shanthoshmobiles.com",
    copyright: "2026 Santhosh Mobiles",
    shopLinks: "Mobiles,Tabs,iPads,Laptops,Personalized Computers,Smart Watches,AirPods,Accessories",
    serviceLinks: "Sell a Phone,Book a Repair,Device Diagnostics,Data Recovery",
    quickLinks: "About Us,Why SanthoshMobiles,Terms & Conditions,Privacy Policy"
  });

  useEffect(() => {
    // 1. Load from cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch (e) { console.error(e) }
    }

    // 2. Fetch fresh data
    fetch(`${API_URL}?action=getFooter`)
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          const newData = { ...data };
          // Override defaults with fetched data
          json.data.forEach(item => {
            // Only update if value is not empty? Or allow clearing?
            // Allow clearing by accepting empty strings.
            newData[item.key] = item.value;
          });

          setData(newData);
          localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
        }
      })
      .catch(err => console.error("Failed to fetch footer", err));
  }, []);

  return (
    <footer className="bg-primary-dark border-t border-gray-800 text-gray-300 mt-auto relative overflow-hidden">
      {/* DECORATIVE GRADIENT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h4 className="font-heading font-bold text-2xl text-white mb-6">
            Santhosh <span className="text-accent">Mobiles</span>
          </h4>
          <p className="text-sm leading-relaxed text-gray-400 mb-6">
            {data.description}
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">A.</span>
              <span>{data.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold">P.</span>
              <span>{data.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold">E.</span>
              <span>{data.email}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg text-white mb-6">Shop Collection</h4>
          <ul className="space-y-3 text-sm">
            {data.shopLinks?.split(',').map(item => item.trim()).map(item => (
              <li key={item}>
                <Link to={`/shop?category=${encodeURIComponent(item)}`} className="hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-accent transition-colors"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg text-white mb-6">Our Services</h4>
          <ul className="space-y-3 text-sm">
            {data.serviceLinks?.split(',').map(item => item.trim()).map(item => (
              <li key={item}>
                <Link to="#" className="hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-accent transition-colors"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg text-white mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {data.quickLinks?.split(',').map(item => item.trim()).map(item => (
              <li key={item}>
                <Link to="#" className="hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-accent transition-colors"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-black/20 border-t border-gray-800 text-center py-6 text-sm text-gray-500">
        © {data.copyright} – Innovation in Every Device.
      </div>
    </footer>
  )
}
