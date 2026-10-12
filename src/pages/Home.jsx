import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { apiRequest } from "../services/api"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    apiRequest("/api/products")
      .then((response) => setProducts(response.data.products))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <section className="relative mt-6 flex min-h-[440px] items-center overflow-hidden bg-[#e9e4dc] px-7 py-14 sm:min-h-[540px] sm:px-16 lg:px-20">
        {products[0]?.images?.[0] && (
          <img
            src={products[0].images[0]}
            alt={products[0].title}
            className="absolute inset-y-0 right-0 h-full w-full object-cover object-top sm:w-[62%]"
            onError={(event) => { event.currentTarget.style.display = "none" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e9e4dc] via-[#e9e4dc]/90 to-[#e9e4dc]/35 sm:via-[#e9e4dc]/80 sm:to-transparent" />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600">The everyday edit</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-7xl">
            Dress like<br />you mean it.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-600 sm:text-base">
            Fresh fits, easy layers, and pieces made to move with you.
          </p>
          <Link to="/collection" className="mt-8 inline-flex bg-neutral-950 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700">
            Shop the collection
          </Link>
        </div>
        <span className="absolute bottom-6 right-7 z-10 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 sm:right-10">
          Find your fit · Snitch
        </span>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Made for your rotation</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">New & noteworthy</h2>
          </div>
          <Link to="/collection" className="shrink-0 border-b border-neutral-400 pb-1 text-xs font-medium uppercase tracking-[0.13em] hover:border-neutral-950">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="py-16 text-center text-sm text-neutral-500">Loading the latest collection…</p>
        ) : error ? (
          <p role="alert" className="py-12 text-center text-sm text-red-700">{error}</p>
        ) : products.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="bg-stone-50 px-6 py-14 text-center">
            <p className="text-sm text-neutral-600">The collection is being refreshed. Check back soon.</p>
          </div>
        )}
      </section>

      <section className="mb-16 grid overflow-hidden bg-stone-100 sm:grid-cols-2">
        {products[1]?.images?.[0] && (
          <img
            src={products[1].images[0]}
            alt={products[1].title}
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover sm:aspect-auto"
            onError={(event) => { event.currentTarget.style.display = "none" }}
          />
        )}
        <div className="flex flex-col justify-center px-7 py-9 sm:px-12 sm:py-12">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Made for real life</p>
          <h2 className="mt-2 text-xl font-semibold">Good style. No overthinking.</h2>
          <Link to="/about" className="mt-5 w-fit border-b border-neutral-400 pb-1 text-xs font-medium uppercase tracking-[0.13em] hover:border-neutral-950">
            Get to know us
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
