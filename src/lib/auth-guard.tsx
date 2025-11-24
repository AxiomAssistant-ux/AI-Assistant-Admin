'use client'

import { useAuth } from '@/context/useAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/Spinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireRole?: 'admin' | 'user' | null
  signInPath?: string
}

/**
 * Auth Guard Component
 * Protects routes and ensures user is authenticated
 * Optionally requires specific role
 */
export default function AuthGuard({ children, requireRole, signInPath }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const loginPath = signInPath ?? (requireRole === 'admin' ? '/auth/admin/sign-in' : '/auth/sign-in')

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(loginPath)
      } else if (requireRole && user?.role !== requireRole) {
        router.push('/dashboards')
      }
    }
  }, [isAuthenticated, isLoading, user, requireRole, router, loginPath])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  // Show loading state while redirecting
  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  // Check role if required
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}

