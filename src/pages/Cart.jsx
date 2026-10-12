import { useState } from "react"
import { Link } from "react-router-dom"
import { formatPrice } from "../utils/formatPrice"
import { useCart } from "../context/useCart"

const Cart = () => {
  const { items, itemCount, subtotal, currency, loading, error, updateQuantity, removeItem, clearCart } = useCart()
  const [actionError, setActionError] = useState("")

  async function changeQuantity(productId, size, quantity) {
    try {
      setActionError("")
      await updateQuantity(productId, size, quantity)
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  async function handleRemove(productId, size) {
    try {
      setActionError("")
      await removeItem(productId, size)
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  if (loading) return <main className="py-24 text-center text-sm text-neutral-500">Loading your bag…</main>

  return (
    <main className="min-h-[55vh] pb-20">
      <div className="py-12 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Your picks, all in one place</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Shopping bag <span className="text-neutral-400">({itemCount})</span></h1>
      </div>
      {(error || actionError) && <p role="alert" className="mb-5 text-center text-sm text-red-700">{actionError || error}</p>}
      {!items.length ? (
        <div className="border-y border-neutral-200 py-14 text-center">
          <p className="text-neutral-700">Your bag is taking a breather.</p>
          <Link to="/collection" className="mt-5 inline-flex bg-neutral-950 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-neutral-700">Explore the collection</Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <section className="divide-y divide-neutral-200 border-y border-neutral-200">
            {items.map(({ product, quantity, size }) => {
              const productId = product?._id ?? product?.id
              return (
                <article key={`${productId}-${size}`} className="flex gap-4 py-5 sm:gap-6">
                  <Link to={`/product/${productId}`} className="h-32 w-24 shrink-0 overflow-hidden bg-stone-100 sm:h-40 sm:w-32">
                    {product?.images?.[0] && <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${productId}`} className="text-sm font-medium hover:underline">{product?.title ?? "Unavailable product"}</Link>
                        <p className="mt-2 text-xs text-neutral-500">Size: {size}</p>
                      </div>
                      <p className="shrink-0 text-sm">{formatPrice((product?.price?.amount ?? 0) * quantity, product?.price?.currency)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <label className="sr-only" htmlFor={`quantity-${productId}-${size}`}>Quantity</label>
                      <select
                        id={`quantity-${productId}-${size}`}
                        value={quantity}
                        onChange={(event) => changeQuantity(productId, size, Number(event.target.value))}
                        className="border border-neutral-200 bg-white px-2 py-1.5 text-xs"
                      >
                        {[
                          ...Array.from({ length: product?.sizes?.find((item) => item.size === size)?.stock ?? 0 }, (_, index) => index + 1),
                          ...(quantity > (product?.sizes?.find((item) => item.size === size)?.stock ?? 0) ? [quantity] : []),
                        ].map((value) => <option key={value}>{value}</option>)}
                      </select>
                      <button type="button" onClick={() => handleRemove(productId, size)} className="text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-950">Remove</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
          <aside className="h-fit border border-neutral-200 p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Order summary</h2>
            <div className="mt-6 flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-neutral-600">Shipping</span>
              <span className="text-xs text-neutral-500">Calculated at checkout</span>
            </div>
            <div className="my-5 border-t border-neutral-200" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span><span>{formatPrice(subtotal, currency)}</span>
            </div>
            <p className="mt-3 text-xs text-neutral-500">Shipping is on us.</p>
            <Link to="/placeorder" className="mt-6 block bg-neutral-950 px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-neutral-700">Continue to checkout</Link>
            <button type="button" onClick={() => clearCart().catch((requestError) => setActionError(requestError.message))} className="mt-4 w-full text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-900">Empty bag</button>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Cart
