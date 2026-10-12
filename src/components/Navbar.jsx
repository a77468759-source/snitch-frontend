import { useState } from "react"
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom"
import logo from "../assets/Snitch-logo.png"
import { useAuth } from "../context/useAuth"
import { useCart } from "../context/useCart"

const navItems = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/collection" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
]

const iconClass = "h-5 w-5"

function SearchIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return open ? (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ) : (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [accountError, setAccountError] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  async function handleLogout() {
    setAccountError("")
    try {
      await logout()
      navigate("/")
    } catch (error) {
      setAccountError(error.message)
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    const query = searchQuery.trim()
    navigate(query ? `/collection?search=${encodeURIComponent(query)}` : "/collection")
    setSearchQuery(query)
    setSearchOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `relative py-2 text-sm font-medium transition-colors hover:text-neutral-500 ${
      isActive ? "text-neutral-950 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-neutral-950" : "text-neutral-600"
    }`

  return (
    <header className="relative z-20 border-b border-neutral-200 bg-white">
      <div className="flex h-[76px] items-center justify-between">
        <Link to="/" aria-label="Snitch home" className="shrink-0">
          <img src={logo} alt="Snitch" className="h-9 w-auto object-contain" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
          {navItems.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => {
              if (!searchOpen) setSearchQuery(searchParams.get("search") ?? "")
              setSearchOpen(!searchOpen)
            }}
            className="rounded-full p-2.5 text-neutral-800 transition hover:bg-neutral-100"
          >
            <SearchIcon />
          </button>
          <Link
            to={user ? "/order" : "/login"}
            aria-label={user ? "Your orders" : "Your account"}
            className="hidden rounded-full p-2.5 text-neutral-800 transition hover:bg-neutral-100 sm:inline-flex"
          >
            <UserIcon />
          </Link>
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2.5 text-neutral-800 transition hover:bg-neutral-100"
          >
            <BagIcon />
            {itemCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] text-white">{itemCount > 99 ? "99+" : itemCount}</span>}
          </Link>
          {user && <button type="button" onClick={handleLogout} className="hidden px-2 text-xs text-neutral-500 hover:text-neutral-950 lg:inline">Sign out</button>}
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2.5 text-neutral-800 transition hover:bg-neutral-100 md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} role="search" className="border-t border-neutral-200 py-3">
          <label htmlFor="navbar-search" className="sr-only">Search products</label>
          <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full bg-neutral-100 px-4 py-2.5">
            <SearchIcon />
            <input
              id="navbar-search"
              name="search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              autoFocus
              placeholder="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
            <button type="submit" className="shrink-0 text-sm font-semibold text-neutral-900 hover:text-neutral-500">
              Search
            </button>
          </div>
        </form>
      )}

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-neutral-200 py-3 md:hidden">
          <div className="flex flex-col">
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-2 py-3 text-sm font-medium ${isActive ? "text-neutral-950" : "text-neutral-600"}`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to={user ? "/order" : "/login"} onClick={() => setMenuOpen(false)} className="px-2 py-3 text-sm font-medium text-neutral-600 sm:hidden">
              {user ? "Your orders" : "My account"}
            </Link>
            {user && <button type="button" onClick={() => { setMenuOpen(false); handleLogout() }} className="px-2 py-3 text-left text-sm font-medium text-neutral-600 sm:hidden">Sign out</button>}
          </div>
        </nav>
      )}
      {accountError && <p role="alert" className="absolute right-0 top-full mt-2 bg-white px-4 py-3 text-xs text-red-700 shadow">{accountError}</p>}
    </header>
  )
}

export default Navbar
