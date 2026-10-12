import { useCallback, useEffect, useMemo, useState } from "react"
import { apiRequest } from "../services/api"
import AuthContext from "./authContext"

const TOKEN_KEY = "snitch.accessToken"

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    apiRequest("/api/auth/refresh")
      .then((response) => {
        if (!active) return
        const token = response.data.accessToken
        localStorage.setItem(TOKEN_KEY, token)
        setAccessToken(token)
        setUser(response.data.user)
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem(TOKEN_KEY)
        setAccessToken(null)
        setUser(null)
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => { active = false }
  }, [])

  const authenticate = useCallback(async (path, details) => {
    const response = await apiRequest(path, { method: "POST", body: details })
    const token = response.data.accessToken
    localStorage.setItem(TOKEN_KEY, token)
    setAccessToken(token)
    setUser(response.data.user)
    return response.data
  }, [])

  const login = useCallback((details) => {
    return authenticate("/api/auth/login", details)
  }, [authenticate])

  const register = useCallback((details) => {
    return authenticate("/api/auth/register", details)
  }, [authenticate])

  const logout = useCallback(async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" })
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ accessToken, user, ready, login, register, logout }),
    [accessToken, user, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
