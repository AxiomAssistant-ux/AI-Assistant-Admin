'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PAGE_FEATURES } from '@/config/page-features'
import { hasPageAccess } from '@/helpers/feature-access'
import { useAuth } from '@/context/useAuthContext'

export const useFeatureGuard = () => {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const requiredFeature = PAGE_FEATURES[pathname]

    if (!hasPageAccess(user.features, requiredFeature)) {
      router.replace('/403')
    }
  }, [pathname, user, isAuthenticated])
}
