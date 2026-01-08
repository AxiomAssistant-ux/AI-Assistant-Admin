/**
 * Auth Context
 * Manages authentication state for both org and platform users
 * 
 * FIXED: Ensures token is saved before making authenticated requests
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/api/auth'
import type {
  UserOut,
  SignInRequest,
  OrgUserResponse,
  ActorType,
} from '@/types/auth'

// ===============================
// Auth Storage Helper
// ===============================

const AUTH_STORAGE = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  },
  
  getUser: (): UserOut | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  
  getTokenExpiry: (): number | null => {
    if (typeof window === 'undefined') return null
    const expiry = localStorage.getItem('token_expires_at')
    return expiry ? parseInt(expiry) : null
  },
  
  saveAuth: (token: string, user: UserOut, expiresIn: number) => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    // Calculate expiry timestamp
    const expiryTimestamp = Date.now() + (expiresIn * 1000)
    localStorage.setItem('token_expires_at', expiryTimestamp.toString())
  },
  
  // NEW: Save just the token immediately
  saveToken: (token: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('access_token', token)
  },
  
  clearAuth: () => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('token_expires_at')
  },
  
  isTokenExpired: (): boolean => {
    const expiry = AUTH_STORAGE.getTokenExpiry()
    if (!expiry) return true
    return Date.now() > expiry
  },
}

// ===============================
// Transform Backend Response to UserOut
// ===============================

function transformOrgUserResponse(response: OrgUserResponse): UserOut {
  return {
    actor: 'org',
    id: response.org_user._id,
    _id: response.org_user._id,
    email: response.org_user.email,
    name: response.org_user.name,
    org_id: response.org_user.org_id,
    is_admin: response.org_user.is_admin,
    role_name: response.org_user.role_name,
    role: response.org_user.role_name || '',
    status: response.org_user.status,
    features: response.org_user.features,
    organization: response.organization,
  }
}

// ===============================
// Auth Context Type
// ===============================

interface AuthContextType {
  user: UserOut | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (data: SignInRequest, isPlatform?: boolean) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ===============================
// Auth Provider
// ===============================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // ===============================
  // Initialize from storage
  // ===============================
  useEffect(() => {
    const initAuth = () => {
      const storedToken = AUTH_STORAGE.getToken()
      const storedUser = AUTH_STORAGE.getUser()

      if (storedToken && storedUser && !AUTH_STORAGE.isTokenExpired()) {
        setToken(storedToken)
        setUser(storedUser)
      } else {
        AUTH_STORAGE.clearAuth()
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  // ===============================
  // Sign In - FIXED VERSION
  // ===============================
  const signIn = async (
    data: SignInRequest,
    isPlatform: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      // For now, only support org sign in
      if (isPlatform) {
        return { 
          success: false, 
          error: 'Platform admin sign in not yet implemented. Please use org sign in.' 
        }
      }

      // Step 1: Sign in and get token
      const signInResponse = await authApi.orgSignIn(data)
      
      // Step 2: IMMEDIATELY save token to localStorage BEFORE making next request
      // This ensures the axios interceptor can read it
      AUTH_STORAGE.saveToken(signInResponse.access_token)
      
      console.log('✅ Token saved to localStorage:', signInResponse.access_token.substring(0, 20) + '...')
      
      // Step 3: Now get current user data (token will be in headers via interceptor)
      const userResponse = await authApi.getCurrentOrgUser()
      
      // Step 4: Transform to UserOut
      const userOut = transformOrgUserResponse(userResponse as any)
      
      // Step 5: Save complete auth data to storage
      AUTH_STORAGE.saveAuth(
        signInResponse.access_token,
        userOut,
        signInResponse.expires_in
      )
      
      // Step 6: Update state
      setToken(signInResponse.access_token)
      setUser(userOut)

      // Step 7: Redirect to dashboard
      const redirectPath = '/dashboards'
      
      console.log('✅ Sign In Success:', {
        actor: userOut.actor,
        user: userOut.name,
        org: userOut.actor === 'org' ? userOut.organization?.company_name : undefined,
        redirectPath,
      })

      router.push(redirectPath)

      return { success: true }
    } catch (error: any) {
      console.error('❌ Sign in error:', error)
      
      // Clear any partial auth data
      AUTH_STORAGE.clearAuth()
      
      // Extract error message
      let errorMessage = 'An error occurred during sign in'
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ===============================
  // Sign Out
  // ===============================
  const signOut = () => {
    const actor = user?.actor
    
    AUTH_STORAGE.clearAuth()
    setToken(null)
    setUser(null)
    
    // Redirect based on actor type
    const redirectPath = actor === 'platform' 
      ? '/auth/admin/sign-in' 
      : '/auth/sign-in'
    
    router.push(redirectPath)
  }

  // ===============================
  // Refresh User
  // ===============================
  const refreshUser = async () => {
    const currentToken = AUTH_STORAGE.getToken()
    if (!currentToken || !user) return

    try {
      // Only refresh org users for now
      if (user.actor === 'org') {
        const userResponse = await authApi.getCurrentOrgUser()
        const refreshedUser = transformOrgUserResponse(userResponse as any)
        
        setUser(refreshedUser)
        AUTH_STORAGE.saveAuth(
          currentToken,
          refreshedUser,
          3600 // Default 1 hour
        )
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // If refresh fails, sign out
      signOut()
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token && !AUTH_STORAGE.isTokenExpired(),
    signIn,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ===============================
// useAuth Hook
// ===============================

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}