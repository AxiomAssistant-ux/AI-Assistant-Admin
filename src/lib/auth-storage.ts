/**
 * Client-side storage utilities for authentication tokens and user data
 */

import type { TokenOut, UserOut } from '@/types/auth'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const TOKEN_EXPIRY_KEY = 'auth_token_expiry'

export const authStorage = {
  saveAuth(tokenData: TokenOut): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(TOKEN_KEY, tokenData.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(tokenData.user))

      const expiryTime = Date.now() + tokenData.expires_in * 1000
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
    } catch (error) {
      console.error('Error saving auth data:', error)
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null

    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token && this.isTokenExpired()) {
        this.clearAuth()
        return null
      }
      return token
    } catch (error) {
      console.error('Error getting token:', error)
      return null
    }
  },

  getUser(): UserOut | null {
    if (typeof window === 'undefined') return null

    try {
      const userJson = localStorage.getItem(USER_KEY)
      if (!userJson) return null
      return JSON.parse(userJson) as UserOut
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  },

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true

    try {
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
      if (!expiryTime) return true
      return Date.now() >= parseInt(expiryTime)
    } catch (error) {
      console.error('Error checking token expiry:', error)
      return true
    }
  },

  clearAuth(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_EXPIRY_KEY)
    } catch (error) {
      console.error('Error clearing auth data:', error)
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null && !this.isTokenExpired()
  },

  getUserRole(): 'admin' | 'user' | null {
    const user = this.getUser()
    return user?.role || null
  },

  getActor(): 'org' | 'platform' | null {
    const user = this.getUser()
    return user?.actor || null
  },
}
