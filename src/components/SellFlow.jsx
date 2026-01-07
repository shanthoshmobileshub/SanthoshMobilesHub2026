import React from 'react'

const steps = [
  {t:'Instant Price Quote', d:'Share device details and get an estimated price instantly.'},
  {t:'Request Device Pickup', d:'Pickup from home or workplace at your convenience.'},
  {t:'Get Paid', d:'Payment processed within 48 hours after verification.'}
]

export default function SellFlow(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-xl font-semibold mb-4">Sell Your Device</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(s=> (
          <div key={s.t} className="bg-white p-4 rounded-lg card-shadow">
            <div className="text-3xl">💡</div>
            <h4 className="font-semibold mt-2">{s.t}</h4>
            <p className="text-sm text-gray-600 mt-1">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
