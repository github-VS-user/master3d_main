"use client"

import { useSyncExternalStore } from "react"
import {
  getCart,
  getCartCount,
  getCartTotal,
  getCartSubtotal,
  getCartShipping,
  getShippingBreakdown,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  subscribeToCart,
  type CartItem,
  type ShippingBreakdown,
} from "@/lib/cart-store"

const defaultBreakdown: ShippingBreakdown = {
  total: 0,
  hasFreeShipping: false,
  hasGroupedDiscount: false,
  groupedCount: 0,
  groupedSaving: 0,
}

// Stable snapshot functions
const getCartSnapshot = () => getCart()
const getCartCountSnapshot = () => getCartCount()
const getCartTotalSnapshot = () => getCartTotal()
const getCartSubtotalSnapshot = () => getCartSubtotal()
const getCartShippingSnapshot = () => getCartShipping()
const getBreakdownSnapshot = () => getShippingBreakdown()

// Server snapshots
const emptyCart: CartItem[] = []
const getServerCartSnapshot = () => emptyCart
const getServerCountSnapshot = () => 0
const getServerTotalSnapshot = () => 0
const getServerSubtotalSnapshot = () => 0
const getServerShippingSnapshot = () => 0
const getServerBreakdownSnapshot = () => defaultBreakdown

export function useCart() {
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot)
  const count = useSyncExternalStore(subscribeToCart, getCartCountSnapshot, getServerCountSnapshot)
  const total = useSyncExternalStore(subscribeToCart, getCartTotalSnapshot, getServerTotalSnapshot)
  const subtotal = useSyncExternalStore(subscribeToCart, getCartSubtotalSnapshot, getServerSubtotalSnapshot)
  const shipping = useSyncExternalStore(subscribeToCart, getCartShippingSnapshot, getServerShippingSnapshot)
  const shippingBreakdown = useSyncExternalStore(subscribeToCart, getBreakdownSnapshot, getServerBreakdownSnapshot)

  return {
    items: cart,
    count,
    total,
    subtotal,
    shipping,
    shippingBreakdown,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
