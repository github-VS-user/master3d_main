"use client"

import { useSyncExternalStore } from "react"
import {
  getCart,
  getCartCount,
  getCartTotal,
  getCartSubtotal,
  getCartShipping,
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
const getCartSubtotalSnapshot = () => getCartSubtotal()
const getCartShippingSnapshot = () => getCartShipping()

// Stable server snapshots
const emptyCart: CartItem[] = []
const getServerCartSnapshot = () => emptyCart
const getServerCountSnapshot = () => 0
const getServerTotalSnapshot = () => 0
const getServerSubtotalSnapshot = () => 0
const getServerShippingSnapshot = () => 0

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

  const subtotal = useSyncExternalStore(
    subscribeToCart,
    getCartSubtotalSnapshot,
    getServerSubtotalSnapshot
  )

  const shipping = useSyncExternalStore(
    subscribeToCart,
    getCartShippingSnapshot,
    getServerShippingSnapshot
  )

  return {
    items: cart,
    count,
    total,
    subtotal,
    shipping,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
