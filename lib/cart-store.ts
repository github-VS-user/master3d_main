export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
  shipping_time: string
  shipping_cost: number
  color?: string
}

type CartListener = () => void

const CART_KEY = "master3d_cart"

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    // ignore localStorage errors
  }
}

let cart: CartItem[] = loadCart()
const listeners: Set<CartListener> = new Set()

function notifyListeners() {
  _cachedBreakdown = null // invalidate so getShippingBreakdown recomputes
  listeners.forEach((listener) => listener())
}

function getCartKey(item: { id: string; color?: string }): string {
  return `${item.id}-${item.color || ''}`
}

export function getCart(): CartItem[] {
  return cart
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  // Find existing item with same id AND color
  const existing = cart.find((i) => i.id === item.id && i.color === item.color)
  if (existing) {
    cart = cart.map((i) => 
      (i.id === item.id && i.color === item.color) 
        ? { ...i, quantity: i.quantity + 1 } 
        : i
    )
  } else {
    cart = [...cart, { ...item, quantity: 1 }]
  }
  saveCart(cart)
  notifyListeners()
}

export function removeFromCart(cartKey: string) {
  cart = cart.filter((i) => getCartKey(i) !== cartKey)
  saveCart(cart)
  notifyListeners()
}

export function updateQuantity(cartKey: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(cartKey)
    return
  }
  cart = cart.map((i) => (getCartKey(i) === cartKey ? { ...i, quantity } : i))
  saveCart(cart)
  notifyListeners()
}

export function clearCart() {
  cart = []
  saveCart(cart)
  notifyListeners()
}

export function getCartSubtotal(): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export interface ShippingBreakdown {
  total: number
  hasFreeShipping: boolean
  hasGroupedDiscount: boolean
  /** How many CHF-1 items are grouped (paying CHF 1 flat instead of per-item) */
  groupedCount: number
  /** How much was saved by grouping */
  groupedSaving: number
}

// Cached breakdown — only recomputed when cart changes (avoids useSyncExternalStore infinite loop)
let _cachedBreakdown: ShippingBreakdown | null = null

function computeShippingBreakdown(): ShippingBreakdown {
  const subtotal = getCartSubtotal()

  if (subtotal >= 20) {
    return { total: 0, hasFreeShipping: true, hasGroupedDiscount: false, groupedCount: 0, groupedSaving: 0 }
  }

  let chf1Units = 0
  let otherShipping = 0

  for (const item of cart) {
    if (Number(item.shipping_cost) === 1) {
      chf1Units += item.quantity
    } else {
      otherShipping += Number(item.shipping_cost) * item.quantity
    }
  }

  const groupedCount = Math.min(chf1Units, 3)
  const normalChf1Units = Math.max(0, chf1Units - 3)
  const chf1Shipping = groupedCount > 0 ? 1 : 0
  const chf1NormalShipping = normalChf1Units * 1
  const total = chf1Shipping + chf1NormalShipping + otherShipping
  const groupedSaving = groupedCount > 1 ? groupedCount - 1 : 0
  const hasGroupedDiscount = groupedCount >= 2

  return { total, hasFreeShipping: false, hasGroupedDiscount, groupedCount, groupedSaving }
}

export function getShippingBreakdown(): ShippingBreakdown {
  if (!_cachedBreakdown) {
    _cachedBreakdown = computeShippingBreakdown()
  }
  return _cachedBreakdown
}

export function getCartShipping(): number {
  return getShippingBreakdown().total
}

export function getCartTotal(): number {
  return getCartSubtotal() + getCartShipping()
}

export function getCartCount(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
