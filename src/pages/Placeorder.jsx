import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatPrice } from "../utils/formatPrice"
import { useAuth } from "../context/useAuth"
import { useCart } from "../context/useCart"
import { apiRequest } from "../services/api"

const emptyAddress = { name: "", phone: "", address: "", city: "", state: "", postalCode: "" }

const Placeorder = () => {
  const { user, ready } = useAuth()
  const { items, subtotal, currency, loading: cartLoading } = useCart()
  const [address, setAddress] = useState(emptyAddress)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function updateField(event) {
    setAddress((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function placeOrder(event) {
    event.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await apiRequest("/api/orders", { method: "POST", body: { shippingAddress: address } })
      navigate("/order", { replace: true, state: { justPlaced: true } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready || cartLoading) return <main className="py-24 text-center text-sm text-neutral-500">Preparing checkout…</main>
  if (!user) {
    return (
      <main className="mx-auto max-w-lg py-24 text-center">
        <h1 className="text-2xl font-semibold">Sign in to check out</h1>
        <p className="mt-3 text-sm text-neutral-500">Your bag will be here when you get back.</p>
        <Link to="/login" state={{ from: { pathname: "/placeorder" } }} className="mt-6 inline-flex bg-neutral-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white">Sign in</Link>
      </main>
    )
  }
  if (!items.length) {
    return (
      <main className="py-24 text-center">
        <h1 className="text-2xl font-semibold">Your bag is empty</h1>
        <Link to="/collection" className="mt-5 inline-block underline underline-offset-4">Browse the collection</Link>
      </main>
    )
  }

  return (
    <main className="pb-20">
      <div className="py-12 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Almost yours</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Checkout</h1>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={placeOrder}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em]">Delivery details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { name: "name", label: "Full name", autoComplete: "name" },
              { name: "phone", label: "Phone number", autoComplete: "tel" },
              { name: "address", label: "Street address", autoComplete: "street-address", wide: true },
              { name: "city", label: "City", autoComplete: "address-level2" },
              { name: "state", label: "State", autoComplete: "address-level1" },
              { name: "postalCode", label: "PIN / postal code", autoComplete: "postal-code" },
            ].map(({ name, label, autoComplete, wide }) => (
              <div key={name} className={wide ? "sm:col-span-2" : ""}>
                <label htmlFor={name} className="mb-2 block text-xs font-medium">{label}</label>
                <input
                  id={name}
                  name={name}
                  value={address[name]}
                  onChange={updateField}
                  required
                  maxLength={200}
                  autoComplete={autoComplete}
                  className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950"
                />
              </div>
            ))}
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting} className="mt-7 w-full bg-neutral-950 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-neutral-700 disabled:bg-neutral-400 sm:w-auto sm:px-10">
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>

        <aside className="h-fit border border-neutral-200 p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Your order</h2>
          <div className="mt-5 max-h-64 space-y-4 overflow-auto">
            {items.map(({ product, size, quantity }) => (
              <div key={`${product._id ?? product.id}-${size}`} className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-600">{product.title} <span className="text-xs">· {size} × {quantity}</span></span>
                <span className="shrink-0">{formatPrice(product.price.amount * quantity, product.price.currency)}</span>
              </div>
            ))}
          </div>
          <div className="my-5 border-t border-neutral-200" />
          <div className="flex justify-between text-sm font-semibold"><span>Total</span><span>{formatPrice(subtotal, currency)}</span></div>
          <p className="mt-5 border border-neutral-200 p-4 text-xs leading-5 text-neutral-600"><span className="font-semibold text-neutral-950">Cash on delivery</span><br />Pay the delivery partner when your order arrives. Shipping is free.</p>
        </aside>
      </div>
    </main>
  )
}

export default Placeorder
