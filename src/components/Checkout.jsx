import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { saveCheckoutDraft } from '../services/api'

// Checkout component (manual UPI flow starter)
export default function Checkout() {
  const navigate = useNavigate()
  const { cart } = useCart()
  const first = cart && cart.length ? cart[0] : null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [upiId, setUpiId] = useState('')
  const [productName, setProductName] = useState(first ? first.title : '')
  const [amount, setAmount] = useState(first ? (first.price || '') : '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (first) {
      setProductName(first.title)
      setAmount(first.price || '')
    }
  }, [first])

  function validate() {
    if (!name.trim()) return 'Name is required'
    if (!email.trim()) return 'Email is required'
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter valid Email ID'
    if (!phone.trim() || phone.trim().length < 6) return 'Valid phone required'
    if (!address.trim()) return 'Address required'
    if (!productName.trim()) return 'Select a product'
    if (!amount) return 'Amount required'
    return null
  }

  function generateUpiLink(merchantUpi, merchantName, orderRef, amt) {
    const pa = encodeURIComponent(merchantUpi)
    const pn = encodeURIComponent(merchantName)
    const tn = encodeURIComponent(orderRef)
    const am = encodeURIComponent(String(amt))
    return `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&am=${am}&cu=INR`
  }

  async function handleProceed(e) {
    e.preventDefault()

    const err = validate()
    if (err) return alert(err)

    const draft = {
      name,
      email,
      phone,
      gender,
      address,
      upiId,
      productName,
      amount
    }

    sessionStorage.setItem('checkout_draft', JSON.stringify(draft))

    try {
      setLoading(true)
      await saveCheckoutDraft(draft)
    } catch (err) {
      console.warn('Draft save failed', err)
    }
    setLoading(false)

    const merchantUpi = 'merchant@upi' // 🔴 replace with real UPI
    const merchantName = 'SanthoshMobiles'
    const orderRef = `SM-${Date.now()}`
    const upiLink = generateUpiLink(
      merchantUpi,
      merchantName,
      orderRef,
      amount
    )

    const proceed = window.confirm(
      'You will be redirected to UPI apps (GPay / PhonePe / Paytm). After payment, come back and confirm your order.'
    )
    if (!proceed) return

    draft.orderRef = orderRef
    sessionStorage.setItem('checkout_draft', JSON.stringify(draft))

    // ✅ THIS IS WHERE GPay / PhonePe / Paytm OPENS
    window.location.href = upiLink
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">
        Checkout — Manual UPI
      </h2>

      <form onSubmit={handleProceed} className="space-y-3">

        <div>
          <label className="block text-sm">Name *</label>
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">Email ID *</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>

        <div>
          <label className="block text-sm">Phone *</label>
          <input
            className="w-full border p-2 rounded"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">Gender</label>
          <select
            className="w-full border p-2 rounded"
            value={gender}
            onChange={e => setGender(e.target.value)}
          >
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Full Shipping Address *</label>
          <textarea
            className="w-full border p-2 rounded"
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Product</label>
            <input
              className="w-full border p-2 rounded"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm">Amount (INR)</label>
            <input
              className="w-full border p-2 rounded"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Your UPI ID (optional)</label>
          <input
            className="w-full border p-2 rounded"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? 'Processing...' : 'Pay with UPI'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/confirm')}
            className="px-3 py-2 border rounded"
          >
            I already paid — Confirm
          </button>
        </div>

        <div className="text-sm text-yellow-700">
          Orders are dispatched only after payment verification.
        </div>

      </form>
    </div>
  )
}
