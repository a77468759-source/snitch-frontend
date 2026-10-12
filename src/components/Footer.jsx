import { Link } from "react-router-dom"
import logo from "../assets/Snitch-logo.png"

const Footer = () => (
  <footer className="border-t border-neutral-200">
    <div className="grid gap-10 py-10 sm:grid-cols-3 sm:py-14">
      <div>
        <Link to="/" aria-label="Snitch home"><img src={logo} alt="Snitch" className="h-8 w-auto object-contain" /></Link>
        <p className="mt-4 max-w-xs text-xs leading-5 text-neutral-500">Everyday style, made your own. Find your next favorite in the Snitch collection.</p>
      </div>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Explore</h2>
        <div className="mt-4 flex flex-col items-start gap-3 text-sm text-neutral-600">
          <Link to="/collection" className="hover:text-neutral-950">Shop all</Link>
          <Link to="/about" className="hover:text-neutral-950">Our story</Link>
          <Link to="/contact" className="hover:text-neutral-950">Contact & support</Link>
        </div>
      </div>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Your account</h2>
        <div className="mt-4 flex flex-col items-start gap-3 text-sm text-neutral-600">
          <Link to="/login" className="hover:text-neutral-950">Sign in / Register</Link>
          <Link to="/order" className="hover:text-neutral-950">Your orders</Link>
          <Link to="/cart" className="hover:text-neutral-950">Shopping bag</Link>
        </div>
      </div>
    </div>
    <div className="flex flex-col justify-between gap-2 border-t border-neutral-200 py-4 text-[11px] text-neutral-500 sm:flex-row">
      <p>© {new Date().getFullYear()} Snitch. All rights reserved.</p>
      <p>Made for your everyday.</p>
    </div>
  </footer>
)

export default Footer
