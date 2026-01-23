// src/app/(dashboard)/Sidebar/page.tsx
'use client'

import React, { useMemo } from 'react'
import AppMenu from './components/AppMenu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import LogoBox from '@/components/wrapper/LogoBox'
import { useAuth } from '@/context/useAuthContext'
import { getAccessibleMenuItems, getMenuItems } from '@/helpers/Manu'
import { useCallLogsBadge } from '@/hooks/useCallLogsBadge'
import { useActionItemsBadge } from '@/hooks/useActionItemsBadge'
import { useComplaintsBadge } from '@/hooks/useComplaintsBadge'
import type { MenuItemType } from '@/types/menu'

const Page = () => {
  const { user } = useAuth()
  const unreadCallLogsCount = useCallLogsBadge()
  const pendingUrgentActionItemsCount = useActionItemsBadge()
  const { pendingCount, inProgressCount } = useComplaintsBadge()

  // Get base menu items
  const baseMenuItems = useMemo(() => {
    return user?.actor === 'platform' 
      ? getMenuItems('platform') 
      : getAccessibleMenuItems(user?.actor ?? null, user)
  }, [user])

  // Update menu items with dynamic badges
  const menuItemsWithBadges = useMemo(() => {
    if (!baseMenuItems) return []

    return baseMenuItems.map((item: MenuItemType) => {
      // Update Call Records badge
      if (item.key === 'call-records') {
        return {
          ...item,
          badge: unreadCallLogsCount > 0 
            ? { variant: 'warning', text: String(unreadCallLogsCount) }
            : undefined
        }
      }
      
      // Update Action Items badge
      if (item.key === 'action-items') {
        return {
          ...item,
          badge: pendingUrgentActionItemsCount > 0 
            ? { variant: 'danger', text: String(pendingUrgentActionItemsCount) }
            : undefined
        }
      }
      
      // Update Complaints badge - ONLY show pending count on parent
      if (item.key === 'complaints') {
        return {
          ...item,
          // Parent badge shows ONLY pending count
          badge: pendingCount > 0 
            ? { variant: 'danger', text: String(pendingCount) }
            : undefined,
          // Update children badges
          children: item.children?.map((child) => {
            // Pending child - show badge
            if (child.key === 'nav_complaints__pending') {
              return {
                ...child,
                badge: pendingCount > 0 
                  ? { variant: 'danger', text: String(pendingCount) }
                  : undefined
              }
            }
            // In Progress child - show badge
            if (child.key === 'nav_complaints__in_progress') {
              return {
                ...child,
                badge: inProgressCount > 0 
                  ? { variant: 'warning', text: String(inProgressCount) }
                  : undefined
              }
            }
            // Resolved child - NO badge
            if (child.key === 'nav_complaints__resolved') {
              return {
                ...child,
                badge: undefined // Explicitly no badge
              }
            }
            return child
          })
        }
      }
      
      return item
    })
  }, [baseMenuItems, unreadCallLogsCount, pendingUrgentActionItemsCount, pendingCount, inProgressCount])

  return (
    <div className="app-sidebar">
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItemsWithBadges} />
      </SimplebarReactClient>
    </div>
  )
}

export default Page

export const dynamic = 'force-dynamic'