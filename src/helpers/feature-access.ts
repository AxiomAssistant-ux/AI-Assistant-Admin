// src/helpers/feature-access.ts

import type { OrgUser } from '@/types/auth'
import { isMenuAllowedForVertical } from '@/config/verticals'

export const hasPageAccess = (
  user: OrgUser,
  requiredFeature?: string
): boolean => {
  // ✅ ADMIN OVERRIDE
  if (user?.is_admin) return true

  // No feature required → public page
  if (!requiredFeature) return true

  return user?.features?.includes(requiredFeature) ?? false
}

/**
 * Check if user has access based on BOTH vertical AND features
 */
export const hasFullPageAccess = (
  user: OrgUser,
  pageUrl: string,
  requiredFeature?: string
): boolean => {
  // Admins still need to respect vertical restrictions
  const menuKey = getMenuKeyFromUrl(pageUrl)
  const verticalKey = user?.organization?.vertical_key
  
  // Step 1: Check vertical access FIRST (even for admins)
  if (!isMenuAllowedForVertical(menuKey, verticalKey)) {
    return false
  }

  // Step 2: Admins bypass feature checks (but not vertical checks)
  if (user?.is_admin) return true

  // Step 3: Check feature access for non-admins
  if (!requiredFeature) return true
  
  return user?.features?.includes(requiredFeature) ?? false
}

/**
 * Helper: Map page URL to menu key for vertical checking
 */
const getMenuKeyFromUrl = (url: string): string => {
  const urlToKeyMap: Record<string, string> = {
    '/dashboards': 'org-dashboard',
    '/agent': 'agent',
    '/users-roles': 'users-roles',
    '/call-records': 'call-records',
    '/action-items': 'action-items',
    '/complaints': 'complaints',
    '/orders': 'orders',
    '/incidents-reports': 'incident-reports',
    '/appointments': 'appointments',
    '/locations': 'locations',
    '/usage': 'usage-billing',
    '/faqs': 'faqs',
    '/contact-support': 'contact-support',
  }
  
  return urlToKeyMap[url] || url.replace(/^\//, '')
}