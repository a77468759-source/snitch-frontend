import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { formatPrice } from "../utils/formatPrice"
import { useCart } from "../context/useCart"
import { apiRequest } from "../services/api"

const Product = () => {
  const { productId } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loadedProductId, setLoadedProductId] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    let active = true
    apiRequest(`/api/products/${productId}`)
      .then((response) => {
        if (!active) return
        const data = response.data.product
        setProduct(data)
        setSelectedImage(0)
        setSelectedSize(data.sizes?.find((size) => size.stock > 0)?.size ?? "")
      })
      .catch((requestError) => {
        if (active) setError({ productId, message: requestError.message })
      })
      .finally(() => {
        if (active) setLoadedProductId(productId)
      })
    return () => { active = false }
  }, [productId])

  async function handleAddToCart() {
    if (!selectedSize) {
      setNotice("Choose an available size to continue.")
      return
    }
    setAdding(true)
    setNotice("")
    try {
      await addToCart(product, selectedSize, quantity)
      setNotice("Added to your bag.")
    } catch (requestError) {
      setNotice(requestError.message)
    } finally {
      setAdding(false)
    }
  }

  const loading = loadedProductId !== productId
  const productError = error?.productId === productId ? error.message : ""
  if (loading) return <main className="py-24 text-center text-sm text-neutral-500">Loading product…</main>
  if (productError || !product) {
    return (
      <main className="py-24 text-center">
        <p role="alert" className="text-sm text-red-700">{productError || "Product not found"}</p>
        <Link to="/collection" className="mt-4 inline-block text-sm underline underline-offset-4">Back to collection</Link>
      </main>
    )
  }

  const sizes = product.sizes ?? []
  const selectedStock = sizes.find((size) => size.size === selectedSize)?.stock ?? 0

  return (
    <main className="pb-20 pt-7">
      <p className="mb-6 text-xs text-neutral-500"><Link to="/" className="hover:text-neutral-950">Home</Link> / <Link to="/collection" className="hover:text-neutral-950">Collection</Link> / <span className="text-neutral-800">{product.title}</span></p>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="grid grid-cols-[64px_1fr] gap-3 sm:grid-cols-[76px_1fr] sm:gap-4">
          <div className="flex flex-col gap-3">
            {(product.images?.length ? product.images : [""]).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
                className={`aspect-[4/5] overflow-hidden bg-stone-100 ${selectedImage === index ? "ring-1 ring-neutral-950" : ""}`}
              >
                {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
              </button>
            ))}
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-stone-100">
            {product.images?.[selectedImage] ? (
              <img src={product.images[selectedImage]} alt={product.title} className="h-full w-full object-cover" />
            ) : <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-stone-400">Snitch</div>}
          </div>
        </div>

        <section className="py-2 md:py-7">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Everyday edit</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{product.title}</h1>
          <p className="mt-4 text-lg">{formatPrice(product.price?.amount, product.price?.currency)}</p>
          <div className="my-6 h-px bg-neutral-200" />
          <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">{product.description}</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">Select size</p>
              <Link to="/contact" className="text-xs text-neutral-500 underline underline-offset-4">Need help?</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map(({ size, stock }) => (
                <button
                  key={size}
                  type="button"
                  disabled={stock < 1}
                  onClick={() => { setSelectedSize(size); setQuantity(1); setNotice("") }}
                  className={`min-w-12 border px-3 py-2.5 text-xs transition disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300 ${
                    selectedSize === size ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 hover:border-neutral-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!sizes.some((size) => size.stock > 0) && <p className="mt-3 text-sm text-red-700">Currently out of stock.</p>}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <label htmlFor="product-quantity" className="text-xs font-semibold uppercase tracking-[0.15em]">Qty</label>
            <select
              id="product-quantity"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              disabled={!selectedStock}
              className="border border-neutral-200 bg-white px-3 py-2.5 text-sm"
            >
              {Array.from({ length: Math.min(selectedStock, 10) }, (_, index) => index + 1).map((value) => <option key={value}>{value}</option>)}
            </select>
            <span className="text-xs text-neutral-500">{selectedStock ? `${selectedStock} available` : ""}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding || !selectedStock}
            className="mt-7 w-full bg-neutral-950 px-6 py-4 text-xs font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {adding ? "Adding…" : "Add to bag"}
          </button>
          {notice && <p role="status" className={`mt-3 text-sm ${notice.includes("Added") ? "text-green-700" : "text-red-700"}`}>{notice}</p>}
          <p className="mt-5 text-xs leading-5 text-neutral-500">Secure checkout · Easy everyday style · Cash on delivery available</p>
        </section>
      </div>
    </main>
  )
}

export default Product
