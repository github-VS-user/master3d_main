"use client"

import { useSyncExternalStore } from "react"
import {
  getCart,
  getCartCount,
  getCartTotal,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  subscribeToCart,
  type CartItem,
} from "@/lib/cart-store"

// Stable snapshot functions defined outside component to avoid re-creation
const getCartSnapshot = () => getCart()
const getCartCountSnapshot = () => getCartCount()
const getCartTotalSnapshot = () => getCartTotal()

// Stable server snapshots
const emptyCart: CartItem[] = []
const getServerCartSnapshot = () => emptyCart
const getServerCountSnapshot = () => 0
const getServerTotalSnapshot = () => 0

export function useCart() {
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  )

  const count = useSyncExternalStore(
    subscribeToCart,
    getCartCountSnapshot,
    getServerCountSnapshot
  )

  const total = useSyncExternalStore(
    subscribeToCart,
    getCartTotalSnapshot,
    getServerTotalSnapshot
  )

  return {
    items: cart,
    count,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
