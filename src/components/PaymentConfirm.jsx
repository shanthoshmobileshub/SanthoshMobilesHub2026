import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL ='https://script.google.com/macros/s/AKfycbzkrLj5kD6dX5on-oQ_2aMPJYfx3rnRZktGhdzLnwRbkYLAr6JzbBm9JQZ2sTB9uU0_Mw/exec'

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // IMPORTANT: strip data:image/...;base64,
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function PaymentConfirm() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(null)
  const [txId, setTxId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('checkout_draft')
    if (raw) setDraft(JSON.parse(raw))
  }, [])

  if (!draft) {
    return <div className="p-4">No checkout data</div>
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!txId.trim()) return alert('Enter transaction ID')
    if (!file) return alert('Upload payment screenshot')

    const allowed = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowed.includes(file.type)) {
      return alert('Only JPG / JPEG / PNG images allowed')
    }

    if (file.size > 6 * 1024 * 1024) {
      return alert('Image must be under 6 MB')
    }

    setLoading(true)

    try {
      const base64 = await readFileAsBase64(file)

      const payload = {
        customerName: draft.name,
        phone: draft.phone,
        gender: draft.gender,
        address: draft.address,
        productName: draft.productName,
        amount: draft.amount,
        upiId: draft.upiId,
        email: draft.email,
        transactionId: txId,
        screenshot: base64,
        screenshotType: file.type
      }

      console.log('FILE TYPE:', file.type)
      //console.log('BASE64 LENGTH:', base64.length)

      // ✅ FORM-ENCODED REQUEST (CORRECT FOR APPS SCRIPT)
      const form = new URLSearchParams()
      form.append('action', 'order')
      form.append('data', JSON.stringify(payload))

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: form
      })

      const result = await res.json()

      if (result.success) {
        alert('Order submitted successfully ✅')
        sessionStorage.removeItem('checkout_draft')
        navigate('/')
      } else {
        alert(result.error || 'Submission failed')
      }

    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Confirm Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Transaction ID"
          value={txId}
          onChange={e => setTxId(e.target.value)}
        />

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={e => setFile(e.target.files[0] || null)}
        />

        <button
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? 'Uploading...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  )
}
