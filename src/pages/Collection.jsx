import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { apiRequest } from "../services/api"

const Collection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sort, setSort] = useState("featured")
  const [selectedSize, setSelectedSize] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("search")?.trim() ?? ""

  useEffect(() => {
    apiRequest("/api/products")
      .then((response) => setProducts(response.data.products))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleProducts = useMemo(() => {
    const terms = search.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
    const result = products.filter((product) => {
      const searchableText = `${product.title} ${product.description}`
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
      const matchesSearch = terms.every((term) => searchableText.includes(term))
      const matchesSize = !selectedSize || product.sizes?.some((item) => item.size === selectedSize && item.stock > 0)
      return matchesSearch && matchesSize
    })
    if (sort === "price-low") result.sort((a, b) => a.price.amount - b.price.amount)
    if (sort === "price-high") result.sort((a, b) => b.price.amount - a.price.amount)
    if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title))
    return result
  }, [products, search, selectedSize, sort])

  function handleSearch(event) {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get("search")?.toString().trim() ?? ""
    setSearchParams(query ? { search: query } : {})
  }

  return (
    <main className="pb-16">
      <div className="py-12 text-center sm:py-16">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Find your next favorite</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The collection</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">Everyday essentials and statement pieces, picked for the way you move.</p>
      </div>
      <form onSubmit={handleSearch} role="search" className="mx-auto mb-7 flex max-w-xl items-center gap-3 border-b border-neutral-300 py-2 focus-within:border-neutral-950">
        <label htmlFor="collection-search" className="sr-only">Search products</label>
        <input
          id="collection-search"
          key={search}
          name="search"
          type="search"
          defaultValue={search}
          placeholder="Search by product name or keyword"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-400"
        />
        <button type="submit" className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] hover:text-neutral-500">Search</button>
        {search && <button type="button" onClick={() => setSearchParams({})} className="shrink-0 text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-950">Clear</button>}
      </form>
      <div className="mb-5 flex flex-col gap-4 border-y border-neutral-200 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">
          {search ? <>Results for <span className="font-medium text-neutral-950">“{searchParams.get("search")}”</span> · </> : null}
          {visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="size-filter">Filter by size</label>
          <select id="size-filter" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} className="border border-neutral-200 bg-white px-3 py-2 text-xs">
            <option value="">All sizes</option>
            {["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40"].map((size) => <option key={size}>{size}</option>)}
          </select>
          <label className="sr-only" htmlFor="sort-products">Sort products</label>
          <select id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)} className="border border-neutral-200 bg-white px-3 py-2 text-xs">
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="py-20 text-center text-sm text-neutral-500">Loading products…</p>
      ) : error ? (
        <p role="alert" className="py-16 text-center text-sm text-red-700">{error}</p>
      ) : visibleProducts.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-neutral-800">No products match those filters.</p>
          <button type="button" onClick={() => setSelectedSize("")} className="mt-3 text-sm underline underline-offset-4">Clear size filter</button>
        </div>
      )}
    </main>
  )
}

export default Collection
