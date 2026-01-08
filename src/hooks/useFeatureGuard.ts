'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PAGE_FEATURES } from '@/config/page-features'
import { isOrgUser } from '@/types/auth'
import { hasPageAccess } from '@/helpers/feature-access'
import { useAuth } from '@/context/useAuthContext'

export const useFeatureGuard = () => {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const requiredFeature = PAGE_FEATURES[pathname]
    // Only Org Users have features. Platform users have full access.
    // If it's an Org User, check their features.
    // If it's a Platform User, they implicitly have access to all features.
    if (isOrgUser(user) && !hasPageAccess(user.features, requiredFeature)) {
      router.replace('/403')
    }
  }, [pathname, user, isAuthenticated, router])
}
