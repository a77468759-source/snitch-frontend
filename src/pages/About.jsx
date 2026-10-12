import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiRequest } from "../services/api"

const About = () => {
  const [image, setImage] = useState("")

  useEffect(() => {
    let active = true
    apiRequest("/api/products")
      .then((response) => {
        if (active) setImage(response.data.products.find((product) => product.images?.[0])?.images[0] ?? "")
      })
      .catch((error) => console.error("Could not load store images for the About page:", error))
    return () => { active = false }
  }, [])

  return (
    <main className="pb-20">
    <section className="bg-[#e9e4dc] px-6 py-16 text-center sm:px-12 sm:py-24">
      <p className="text-xs uppercase tracking-[0.24em] text-neutral-600">A little about us</p>
      <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Style should feel like you.</h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
        Snitch is for the everyday: easy-to-wear pieces, fresh ideas, and the freedom to make every fit your own.
      </p>
    </section>
    <section className="mx-auto grid max-w-5xl gap-10 py-14 sm:grid-cols-2 sm:items-center sm:py-20">
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        {image ? (
          <img src={image} alt="A look from the Snitch collection" className="h-full w-full object-cover" onError={() => setImage("")} />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.22em] text-stone-400">Your everyday, reimagined</div>
        )}
      </div>
      <div className="sm:pl-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Keep it personal</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Wear it your way.</h2>
        <p className="mt-5 text-sm leading-7 text-neutral-600">
          Getting dressed should be the fun part. We bring together versatile staples and standout details so you can build a wardrobe that works for your day, your plans, and your point of view.
        </p>
        <Link to="/collection" className="mt-7 inline-block border-b border-neutral-400 pb-1 text-xs font-semibold uppercase tracking-[0.14em] hover:border-neutral-950">Explore the collection</Link>
      </div>
    </section>
    </main>
  )
}

export default About
