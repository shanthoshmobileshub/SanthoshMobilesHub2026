import React from 'react'

const brands = ['Apple','Samsung','Google','Vivo','Oppo','Realme','Nothing']

export default function BrandSlider(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-8 overflow-auto">
        {brands.map(b=> (
          <div key={b} className="flex-shrink-0 w-32 h-16 bg-white rounded-lg flex items-center justify-center card-shadow">{b}</div>
        ))}
      </div>
    </div>
  )
}
