import { useState, useCallback, useEffect } from 'react'
import { STORAGE_KEYS } from '../config/constants'

const defaultUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
}

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
    return savedUser ? JSON.parse(savedUser) : defaultUser
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }, [user])

  // const login = useCallback(async (credentials) => {
  //   setLoading(true)
  //   try {
  //     // 实现登录逻辑
  //     setUser(defaultUser)
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }, [])

  return { user, loading, logout }
} 