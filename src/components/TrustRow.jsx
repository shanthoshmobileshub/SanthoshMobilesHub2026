import React from 'react'

const items = ['54+ Quality Checks','Brand Warranty','Returns & Replacement','Guaranteed Buyback','Actual Product Images']

export default function TrustRow(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-4 overflow-auto">
      {items.map(i=> (
        <div key={i} className="bg-white p-3 rounded-lg card-shadow text-sm">{i}</div>
      ))}
    </div>
  )
}
