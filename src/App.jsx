import { Link, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Collection from "./pages/Collection"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Placeorder from "./pages/Placeorder"
import Order from "./pages/Order"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { useAuth } from "./context/useAuth"

function RequireAuth() {
  const { ready, user } = useAuth()
  const location = useLocation()

  if (!ready) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Checking your sign-in…</main>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  return <Outlet />
}

function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<RequireAuth />}>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="collection" element={<Collection />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="product/:productId" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="placeorder" element={<Placeorder />} />
        <Route path="order" element={<Order />} />
        <Route path="*" element={<main className="py-24 text-center"><h1 className="text-2xl font-semibold">Page not found</h1><Link to="/" className="mt-4 inline-block underline underline-offset-4">Back home</Link></main>} />
      </Route>
    </Route>
  </Routes>
)

export default App
