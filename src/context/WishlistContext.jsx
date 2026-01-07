import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function useWishlist(){
  return useContext(WishlistContext)
}

export function WishlistProvider({children}){
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('sm_wishlist')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('sm_wishlist', JSON.stringify(items)) } catch {}
  }, [items])

  function add(item){
    setItems(prev => {
      if(prev.find(i=> i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  function remove(id){
    setItems(prev => prev.filter(i=> i.id !== id))
  }

  function toggle(item){
    setItems(prev => {
      return prev.find(i=> i.id === item.id) ? prev.filter(i=> i.id !== item.id) : [...prev, item]
    })
  }

  const value = { items, add, remove, toggle, count: items.length }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export default WishlistContext
