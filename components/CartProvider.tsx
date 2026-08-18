'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  key: string
  product_id: string
  name: string
  slug: string
  image: string
  variant: string
  price: number
  qty: number
}

type CartContext = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  ready: boolean
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
  open: () => void
  close: () => void
}

const Ctx = createContext<CartContext | null>(null)
const STORAGE_KEY = 'znacky-cart-v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      /* ignore malformed storage */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage full or blocked */
    }
  }, [items, ready])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const add: CartContext['add'] = useCallback((item, qty = 1) => {
    const key = `${item.product_id}::${item.variant}`
    setItems((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { ...item, key, qty }]
    })
  }, [])

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContext>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0)
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
    return { items, count, subtotal, isOpen, ready, add, remove, setQty, clear, open, close }
  }, [items, isOpen, ready, add, remove, setQty, clear, open, close])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
