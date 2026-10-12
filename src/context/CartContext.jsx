import { useCallback, useEffect, useMemo, useState } from "react"
import { apiRequest } from "../services/api"
import { useAuth } from "./useAuth"
import CartContext from "./cartContext"

const CART_KEY = "snitch.guestCart"

function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]")
  } catch {
    localStorage.removeItem(CART_KEY)
    return []
  }
}

function productIdOf(product) {
  return product?._id ?? product?.id
}

export function CartProvider({ children }) {
  const { accessToken, ready } = useAuth()
  const [items, setItems] = useState(readGuestCart)
  const [loadedFor, setLoadedFor] = useState(null)
  const [error, setError] = useState("")

  const loadRemoteCart = useCallback(async () => {
    const response = await apiRequest("/api/cart")
    setItems(response.data.cart.products.filter((line) => line.product).map((line) => ({
      product: line.product,
      quantity: line.quantity,
      size: line.size,
    })))
  }, [])

  useEffect(() => {
    let active = true
    if (!ready) return () => { active = false }
    if (accessToken) {
      const guestItems = readGuestCart()
      const mergeGuestCart = guestItems.length
        ? apiRequest("/api/cart/merge", {
          method: "POST",
          body: {
            items: guestItems.map((line) => ({
              productId: productIdOf(line.product),
              size: line.size,
              quantity: line.quantity,
            })),
          },
        }).then(() => localStorage.removeItem(CART_KEY))
        : Promise.resolve()
      mergeGuestCart.then(async () => {
        await loadRemoteCart()
        if (active) {
          setError("")
          setLoadedFor(accessToken)
        }
      })
        .catch((requestError) => {
          if (active) {
            setError(requestError.message)
            setLoadedFor(accessToken)
          }
        })
    } else {
      Promise.resolve().then(() => {
        if (!active) return
        setItems(readGuestCart())
        setLoadedFor("guest")
        setError("")
      })
    }
    return () => { active = false }
  }, [accessToken, ready, loadRemoteCart])

  useEffect(() => {
    if (!accessToken && ready) localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [accessToken, items, ready])

  const addToCart = useCallback(async (product, size, quantity = 1) => {
    setError("")
    const productId = productIdOf(product)
    if (accessToken) {
      await apiRequest("/api/cart", {
        method: "POST",
        body: { productId, size, quantity },
      })
      await loadRemoteCart()
      return
    }

    setItems((currentItems) => {
      const existing = currentItems.find((line) => productIdOf(line.product) === productId && line.size === size)
      if (existing) {
        return currentItems.map((line) =>
          productIdOf(line.product) === productId && line.size === size
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      }
      return [...currentItems, { product, size, quantity }]
    })
  }, [accessToken, loadRemoteCart])

  const updateQuantity = useCallback(async (productId, size, quantity) => {
    setError("")
    if (accessToken) {
      await apiRequest("/api/cart", {
        method: "PATCH",
        body: { productId, size, quantity },
      })
      await loadRemoteCart()
      return
    }
    setItems((currentItems) => quantity === 0
      ? currentItems.filter((line) => !(productIdOf(line.product) === productId && line.size === size))
      : currentItems.map((line) =>
        productIdOf(line.product) === productId && line.size === size ? { ...line, quantity } : line,
      ))
  }, [accessToken, loadRemoteCart])

  const removeItem = useCallback(async (productId, size) => {
    setError("")
    if (accessToken) {
      await apiRequest(`/api/cart/item/${encodeURIComponent(productId)}/${encodeURIComponent(size)}`, {
        method: "DELETE",
      })
      setItems((currentItems) =>
        currentItems.filter((line) => !(productIdOf(line.product) === productId && line.size === size)),
      )
      return
    }
    setItems((currentItems) =>
      currentItems.filter((line) => !(productIdOf(line.product) === productId && line.size === size)),
    )
  }, [accessToken])

  const clearCart = useCallback(async () => {
    if (accessToken) {
      await apiRequest("/api/cart", { method: "DELETE" })
    }
    setItems([])
    setError("")
  }, [accessToken])

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = items.reduce((sum, line) => sum + (line.product?.price?.amount ?? 0) * line.quantity, 0)
  const currency = items[0]?.product?.price?.currency ?? "INR"
  const loading = !ready || loadedFor !== (accessToken ?? "guest")
  const value = useMemo(() => ({
    items, itemCount, subtotal, currency, loading, error, addToCart, updateQuantity, removeItem, clearCart,
  }), [items, itemCount, subtotal, currency, loading, error, addToCart, updateQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
