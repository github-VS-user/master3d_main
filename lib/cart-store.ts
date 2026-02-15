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

export function getCartTotal(): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity + item.shipping_cost, 0)
}

export function getCartCount(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
