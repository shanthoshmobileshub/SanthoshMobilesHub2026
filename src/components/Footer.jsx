import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gray-900 text-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-bold">Company Info</h4>
          <p className="text-sm mt-2">Santhosh Mobiles , Collector Office, Tiruppur- 641 604.</p>
          <p className="text-sm">Phone: +91 97902 25832</p>
          <p className="text-sm">Email: contact@shanthoshmobiles.com</p>
        </div>

        <div>
          <h4 className="font-bold">Buy Services</h4>
          <ul className="mt-2 text-sm space-y-1">
            <li>Buy Mobile</li>
            <li>Buy Tablet</li>
            <li>Buy Laptop</li>
            <li>Buy Smart Watch</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Services</h4>
          <ul className="mt-2 text-sm space-y-1">
            <li>Sell a Phone</li>
            <li>Book a Repair</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Company</h4>
          <ul className="mt-2 text-sm space-y-1">
            <li>About Us</li>
            <li>Why SanthoshMobiles</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-3">© 2025 SanthoshMobiles – Innovation in Every Device.</div>
    </footer>
  )
}
