'use client'

import { useAuth } from '@/context/useAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/Spinner'

interface AuthGuardProps {
  children: React.ReactNode
  actor: 'org' | 'platform'
  requireRole?: 'admin' | 'user'
  signInPath?: string
}

export default function AuthGuard({
  children,
  actor,
  requireRole,
  signInPath,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  const loginPath =
    signInPath ??
    (actor === 'platform'
      ? '/auth/admin/sign-in'
      : '/auth/sign-in')

  useEffect(() => {
    if (isLoading) return

    // Not logged in
    if (!isAuthenticated) {
      router.push(loginPath)
      return
    }

    // Actor mismatch (CRITICAL)
    if (user?.actor !== actor) {
      router.push(loginPath)
      return
    }

    // Role mismatch (only for org users)
    if (actor === 'org' && requireRole && user?.role !== requireRole) {
      router.push('/dashboards')
    }
  }, [isAuthenticated, isLoading, user, actor, requireRole, router, loginPath])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  if (user?.actor !== actor) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  if (actor === 'org' && requireRole && user?.role !== requireRole) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}



export const dynamic = 'force-dynamic'
