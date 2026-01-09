/**
 * Auth Context
 * Manages authentication state for both org and platform users
 * ADDED: Route protection based on user status
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
    if (!userStr) return null

    try {
      const parsed = JSON.parse(userStr)
      // Transform MongoDB format to clean format
      return cleanMongoDBFormat(parsed)
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      return null
    }
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
// Helper: Clean MongoDB Format
// ===============================

function cleanMongoDBFormat(obj: any): any {
  if (obj === null || obj === undefined) return obj

  // Handle MongoDB ObjectId format: { $oid: "..." }
  if (obj.$oid) {
    return obj.$oid
  }

  // Handle MongoDB Date format: { $date: "..." }
  if (obj.$date) {
    return obj.$date
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => cleanMongoDBFormat(item))
  }

  // Handle objects
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const key in obj) {
      cleaned[key] = cleanMongoDBFormat(obj[key])
    }
    return cleaned
  }

  return obj
}

// ===============================
// Transform Backend Response to UserOut
// ===============================

function transformOrgUserResponse(response: OrgUserResponse): UserOut {
  const cleaned = cleanMongoDBFormat(response)

  return {
    actor: 'org',
    id: cleaned.org_user._id,
    _id: cleaned.org_user._id,
    email: cleaned.org_user.email,
    name: cleaned.org_user.name,
    org_id: cleaned.org_user.org_id,
    is_admin: cleaned.org_user.is_admin,
    role_name: cleaned.org_user.role_name,
    role: cleaned.org_user.role_name || '',
    status: cleaned.org_user.status,
    features: cleaned.org_user.features,
    organization: cleaned.organization,
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
  const pathname = usePathname()

  // ===============================
  // Check user status and redirect
  // ===============================
  const checkUserStatus = (currentUser: UserOut, currentPath: string) => {
    if (currentUser.actor !== 'org') return

    const isPendingOnboard = currentUser.status === 'pending_onboard' || !currentUser.org_id
    const isOnboardingPage = currentPath?.startsWith('/onboarding')
    const isAuthPage = currentPath?.startsWith('/auth')

    // If pending onboard and not on onboarding/auth pages, redirect to onboarding
    if (isPendingOnboard && !isOnboardingPage && !isAuthPage) {
      console.log('🔄 User needs onboarding, redirecting...')
      router.push('/onboarding?step=org')
    }

    // If active user on onboarding page, redirect to dashboard
    if (!isPendingOnboard && isOnboardingPage) {
      console.log('✅ User already onboarded, redirecting to dashboard...')
      router.push('/dashboards')
    }
  }

  // ===============================
  // Initialize from storage
  // ===============================
  useEffect(() => {
    const initAuth = () => {
      const storedToken = AUTH_STORAGE.getToken()
      const storedUser = AUTH_STORAGE.getUser()

      console.log('🔍 Initializing auth from storage:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        status: storedUser?.actor === 'org' ? storedUser.status : undefined,
        has_org: storedUser?.actor === 'org' ? !!storedUser.org_id : undefined,
      })

      if (storedToken && storedUser && !AUTH_STORAGE.isTokenExpired()) {
        setToken(storedToken)
        setUser(storedUser)

        // Check if user needs to complete onboarding
        checkUserStatus(storedUser, pathname || '')
      } else {
        AUTH_STORAGE.clearAuth()
      }

      setIsLoading(false)
    }

    initAuth()
  }, [pathname])

  // ===============================
  // Sign In
  // ===============================
  const signIn = async (
    data: SignInRequest,
    isPlatform: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      if (isPlatform) {
        return {
          success: false,
          error: 'Platform admin sign in not yet implemented. Please use org sign in.'
        }
      }

      // Step 1: Sign in and get token
      const signInResponse = await authApi.orgSignIn(data)

      // Step 2: Save token immediately
      AUTH_STORAGE.saveToken(signInResponse.access_token)

      console.log('✅ Token saved to localStorage')

      // Step 3: Get current user data
      const userResponse = await authApi.getCurrentOrgUser()

      // Step 4: Transform to UserOut (with MongoDB cleanup)
      const userOut = transformOrgUserResponse(userResponse as any)

      if (userOut.actor === 'org') {
        console.log('✅ User data transformed:', {
          actor: userOut.actor,
          name: userOut.name,
          status: userOut.status,
          has_org: !!userOut.org_id,
        })
      }

      // Step 5: Save complete auth data
      AUTH_STORAGE.saveAuth(
        signInResponse.access_token,
        userOut,
        signInResponse.expires_in
      )

      // Step 6: Update state
      setToken(signInResponse.access_token)
      setUser(userOut)

      // Step 7: Redirect based on user status
      const isPendingOnboard =
        userOut.actor === 'org' &&
        (userOut.status === 'pending_onboard' || !userOut.org_id)
      const redirectPath = isPendingOnboard ? '/onboarding?step=org' : '/dashboards'

      if (userOut.actor === 'org') {
        console.log('✅ Sign In Success:', {
          actor: userOut.actor,
          user: userOut.name,
          status: userOut.status,
          has_org: !!userOut.org_id,
          redirectPath,
        })
      }

      router.push(redirectPath)

      return { success: true }
    } catch (error: any) {
      console.error('❌ Sign in error:', error)

      AUTH_STORAGE.clearAuth()

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
      if (user.actor === 'org') {
        const userResponse = await authApi.getCurrentOrgUser()
        const refreshedUser = transformOrgUserResponse(userResponse as any)


        // console.log('🔄 User refreshed:', {
        //   status: refreshedUser.status,
        //   has_org: !!refreshedUser.org_id,
        // })

        setUser(refreshedUser)
        AUTH_STORAGE.saveAuth(
          currentToken,
          refreshedUser,
          3600 // Default 1 hour
        )

        // Check status after refresh
        checkUserStatus(refreshedUser, pathname || '')
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
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