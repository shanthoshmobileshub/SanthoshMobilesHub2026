// Simple API helper to call Google Apps Script web app
export const WEB_APP_URL ="https://script.google.com/macros/s/AKfycbzkrLj5kD6dX5on-oQ_2aMPJYfx3rnRZktGhdzLnwRbkYLAr6JzbBm9JQZ2sTB9uU0_Mw/exec"

export async function saveCheckoutDraft(draft) {
  if (!WEB_APP_URL) return null
  try {
    const form = new URLSearchParams()
    form.append('action', 'draft')
    form.append('data', JSON.stringify(draft))

    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      body: form
      // ❌ NO headers here
    })

    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return { success: res.ok }
    }
  } catch (err) {
    console.warn('draft save failed', err)
    return null
  }
}

export async function submitOrder(payload) {
  if (!WEB_APP_URL) throw new Error('WEB_APP_URL not set')

  try {
    const form = new URLSearchParams()
    form.append('action', 'order')
    form.append('data', JSON.stringify(payload))

    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      body: form
      // ❌ NO headers here
    })

    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      throw new Error(
        `Unexpected server response: ${res.status} ${res.statusText} - ${text}`
      )
    }
  } catch (err) {
    console.error('submitOrder failed', err)
    throw err
  }
}
