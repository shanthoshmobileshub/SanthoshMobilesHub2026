import React from 'react'

const actions = [
  {t:'Sell Mobile', btn:'Sell Now', c:'from-red-500 to-orange-400'},
  {t:'Buy Mobiles', btn:'Buy Now', c:'from-green-400 to-teal-500'},
  {t:'Exchange Mobiles', btn:'Exchange Now', c:'from-blue-500 to-indigo-500'}
]

export default function ActionBanners(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map(a=> (
        <div key={a.t} className={`rounded-lg p-6 text-white bg-gradient-to-r ${a.c} flex items-center justify-between`}> 
          <div>
            <div className="font-bold text-lg">{a.t}</div>
            <div className="mt-2">Best deals and quick processes</div>
          </div>
          <div>
            <button className="bg-white text-black px-4 py-2 rounded-full">{a.btn}</button>
          </div>
        </div>
      ))}
    </div>
  )
}
