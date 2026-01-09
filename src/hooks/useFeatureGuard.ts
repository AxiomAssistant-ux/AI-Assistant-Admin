// src/hooks/useFeatureGuard.tsx

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PAGE_FEATURES } from '@/config/page-features'
import { isOrgUser } from '@/types/auth'
import { hasFullPageAccess } from '@/helpers/feature-access'
import { useAuth } from '@/context/useAuthContext'

export const useFeatureGuard = () => {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // Platform users have full access
    if (!isOrgUser(user)) return

    const requiredFeature = PAGE_FEATURES[pathname]

    // Check BOTH vertical AND feature access
    if (!hasFullPageAccess(user, pathname, requiredFeature)) {
      router.replace('/403')
    }
  }, [pathname, user, isAuthenticated, router])
}