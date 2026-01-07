import React from 'react'
import { Link } from 'react-router-dom'

const items = [
  {k:'Mobiles', img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'},
  {k:'AirPods', img:'https://images.unsplash.com/photo-1616596871232-4f06a8f5b7b5?w=400'},
  {k:'iPads', img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'},
  {k:'Tabs', img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'},
  {k:'Watches', img:'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400'},
  {k:'Accessories', img:'https://images.unsplash.com/photo-1541534401786-8b1f2f6b1d6d?w=400'}
]

export default function CategoryIcons(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {items.map(i=> (
          <Link key={i.k} to={`/shop?category=${encodeURIComponent(i.k)}`} className="flex flex-col items-center bg-white p-3 rounded-lg card-shadow">
            <img src={i.img} alt={i.k} className="w-16 h-16 object-cover rounded-md"/>
            <span className="mt-2 text-sm">{i.k}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
