import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

const Login = () => {
  const { login, register } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const returnTo = typeof location.state?.from === "string" ? location.state.from : "/"

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      if (isRegistering) {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      } else {
        await login({ email: form.email.trim(), password: form.password })
      }
      navigate(returnTo, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto min-h-[65vh] max-w-md py-14 sm:py-20">
      <p className="text-center text-xs uppercase tracking-[0.22em] text-neutral-500">Good to have you here</p>
      <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight">{isRegistering ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-3 text-center text-sm text-neutral-500">Sign in to save your bag and keep track of orders.</p>

      <form onSubmit={submit} className="mt-9 space-y-4">
        {isRegistering && (
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-medium">Full name</label>
            <input id="name" name="name" value={form.name} onChange={updateField} required minLength={2} maxLength={50} autoComplete="name" className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-medium">Email address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950" />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-medium">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={updateField} required minLength={6} autoComplete={isRegistering ? "new-password" : "current-password"} className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-950" />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="text-sm text-green-700">{success}</p>}
        <button type="submit" disabled={submitting} className="w-full bg-neutral-950 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-neutral-700 disabled:bg-neutral-400">
          {submitting ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        {isRegistering ? "Already have an account?" : "New around here?"}{" "}
        <button type="button" onClick={() => { setIsRegistering((current) => !current); setError(""); setSuccess("") }} className="font-medium text-neutral-950 underline underline-offset-4">
          {isRegistering ? "Sign in" : "Create an account"}
        </button>
      </p>
      <p className="mt-8 text-center text-xs text-neutral-500">Sign in or create an account to access the store.</p>
    </main>
  )
}

export default Login
