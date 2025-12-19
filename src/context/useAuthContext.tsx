// src/context/useAuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/auth-api'
import { authStorage } from '@/lib/auth-storage'
import type {
  UserOut,
  SignInRequest,
  SignUpRequest,
  SignupOTPRequestOut,
  TokenOut,
} from '@/types/auth'

interface AuthContextType {
  user: UserOut | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (data: SignInRequest, isAdmin?: boolean) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignUpRequest, isAdmin?: boolean) => Promise<{ success: boolean; error?: string; data?: SignupOTPRequestOut }>
  signOut: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // ===============================
  // Init from storage
  // ===============================
  useEffect(() => {
    const initAuth = () => {
      const storedToken = authStorage.getToken()
      const storedUser = authStorage.getUser()

      if (storedToken && storedUser && !authStorage.isTokenExpired()) {
        setToken(storedToken)
        setUser(storedUser)
      } else {
        authStorage.clearAuth()
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  // ===============================
  // Sign In
  // ===============================
  const signIn = async (
    data: SignInRequest,
    isAdmin: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)

      const response = isAdmin
        ? await authApi.adminSignIn(data)
        : await authApi.userSignIn(data)

      if (response.error || !response.data) {
        return { success: false, error: response.error || 'Sign in failed' }
      }

      const tokenData = response.data as TokenOut
      
      // Platform admins get 'platform', org users get 'org'
      const actor: 'platform' | 'org' = isAdmin ? 'platform' : 'org'

      const userWithActor: UserOut = {
        ...tokenData.user,
        actor,
      }

      authStorage.saveAuth({
        ...tokenData,
        user: userWithActor,
      })

      setToken(tokenData.access_token)
      setUser(userWithActor)

      const redirectPath = actor === 'platform' ? '/dashboard' : '/dashboards'
      
      console.log('🔐 SignIn Success:', {
        isAdmin,
        actor,
        redirectPath,
        user: userWithActor
      })

      // Route correctly based on actor
      router.push(redirectPath)

      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  // ===============================
  // Sign Up
  // ===============================
  const signUp = async (
    data: SignUpRequest,
    isAdmin: boolean = false
  ): Promise<{ success: boolean; error?: string; data?: SignupOTPRequestOut }> => {
    try {
      setIsLoading(true)

      const response = isAdmin
        ? await authApi.adminSignUp(data)
        : await authApi.userSignUp(data)

      if (response.error || !response.data) {
        return { success: false, error: response.error || 'Sign up failed' }
      }

      if (isAdmin) {
        return await signIn({ email: data.email, password: data.password }, true)
      }

      return { success: true, data: response.data as SignupOTPRequestOut }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  // ===============================
  // Sign Out
  // ===============================
  const signOut = () => {
    const actor = user?.actor
    authStorage.clearAuth()
    setToken(null)
    setUser(null)
    router.push(actor === 'platform' ? '/auth/admin/sign-in' : '/auth/sign-in')
  }

  // ===============================
  // Refresh User
  // ===============================
  const refreshUser = async () => {
    const currentToken = authStorage.getToken()
    if (!currentToken) return

    try {
      const response = await authApi.getUserProfile(currentToken)
      if (response.data && user?.actor) {
        const refreshedUser: UserOut = {
          ...response.data,
          actor: user.actor,
        }

        setUser(refreshedUser)
        authStorage.saveAuth({
          access_token: currentToken,
          token_type: 'bearer',
          expires_in: 3600,
          user: refreshedUser,
        })
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token && !authStorage.isTokenExpired(),
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}