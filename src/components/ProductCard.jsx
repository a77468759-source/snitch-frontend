import { useState } from "react"
import { Link } from "react-router-dom"
import { formatPrice } from "../utils/formatPrice"

export default function ProductCard({ product }) {
  const image = product.images?.[0]
  const [imageFailed, setImageFailed] = useState(false)
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-stone-100">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-stone-400">Snitch</div>
        )}
      </div>
      <div className="pt-3">
        <h3 className="truncate text-sm font-medium text-neutral-900">{product.title}</h3>
        <p className="mt-1 text-sm text-neutral-600">{formatPrice(product.price?.amount, product.price?.currency)}</p>
      </div>
    </Link>
  )
}
