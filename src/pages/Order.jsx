import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { formatPrice } from "../utils/formatPrice"
import { useAuth } from "../context/useAuth"
import { apiRequest } from "../services/api"

const Order = () => {
  const { user, ready } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")
  const [cancellingId, setCancellingId] = useState("")

  useEffect(() => {
    if (!ready) return
    if (!user) return
    let active = true
    apiRequest("/api/orders")
      .then((response) => { if (active) setOrders(response.data.orders) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [ready, user])

  async function handleCancel(orderId) {
    if (!window.confirm("Cancel this order? Its items will be returned to stock.")) return

    setCancellingId(orderId)
    setActionError("")
    try {
      await apiRequest(`/api/orders/${orderId}/cancel`, { method: "POST" })
      setOrders((currentOrders) => currentOrders.filter((order) => order._id !== orderId))
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setCancellingId("")
    }
  }

  if (!ready || (user && loading)) return <main className="py-24 text-center text-sm text-neutral-500">Loading your orders…</main>
  if (!user) {
    return (
      <main className="py-24 text-center">
        <h1 className="text-2xl font-semibold">Sign in to view your orders</h1>
        <Link to="/login" className="mt-5 inline-block underline underline-offset-4">Sign in</Link>
      </main>
    )
  }

  return (
    <main className="min-h-[55vh] pb-20">
      <div className="py-12 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Thanks for choosing Snitch</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your orders</h1>
      </div>
      {location.state?.justPlaced && <p role="status" className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-800">Order placed successfully. Pay by cash when it arrives.</p>}
      {error && <p role="alert" className="py-8 text-center text-sm text-red-700">{error}</p>}
      {actionError && <p role="alert" className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}
      {!error && !orders.length ? (
        <div className="border-y border-neutral-200 py-14 text-center">
          <p className="text-sm text-neutral-600">No orders yet. Your next favorite might be out there.</p>
          <Link to="/collection" className="mt-5 inline-block bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="border border-neutral-200 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 pb-4">
                <div>
                  <h2 className="text-sm font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <p className="mt-1 text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-xs capitalize ${order.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-stone-100"}`}>{order.status}</span>
                  {order.status === "placed" && (
                    <button
                      type="button"
                      disabled={cancellingId === order._id}
                      onClick={() => handleCancel(order._id)}
                      className="text-xs text-neutral-500 underline underline-offset-4 hover:text-red-700 disabled:text-neutral-300"
                    >
                      {cancellingId === order._id ? "Cancelling…" : "Cancel order"}
                    </button>
                  )}
                </div>
              </div>
              <div className="divide-y divide-neutral-100">
                {order.items.map((item, index) => (
                  <div key={`${item.product}-${item.size}-${index}`} className="flex items-center gap-4 py-4">
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-stone-100">
                      {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-xs text-neutral-500">Size {item.size} · Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm">{formatPrice(item.price * item.quantity, item.currency)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-between gap-2 border-t border-neutral-200 pt-4 text-sm">
                <span className="text-neutral-600">Cash on delivery</span>
                <span className="font-semibold">{formatPrice(order.total, order.currency)}</span>
              </div>
              <p className="mt-3 text-xs text-neutral-500">{order.shippingAddress.name} · {order.shippingAddress.city}, {order.shippingAddress.state}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Order
