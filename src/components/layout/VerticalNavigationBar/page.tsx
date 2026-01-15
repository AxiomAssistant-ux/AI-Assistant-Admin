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
import type { MenuItemType } from '@/types/menu'

const Page = () => {
  const { user } = useAuth()
  const unreadCallLogsCount = useCallLogsBadge()
  const pendingUrgentActionItemsCount = useActionItemsBadge()

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
      // Update Call Records badge with unread count
      if (item.key === 'call-records') {
        return {
          ...item,
          badge: unreadCallLogsCount > 0 
            ? { variant: 'warning', text: String(unreadCallLogsCount) }
            : undefined
        }
      }
      
      // Update Action Items badge with pending urgent count
      if (item.key === 'action-items') {
        return {
          ...item,
          badge: pendingUrgentActionItemsCount > 0 
            ? { variant: 'danger', text: String(pendingUrgentActionItemsCount) }
            : undefined
        }
      }
      
      return item
    })
  }, [baseMenuItems, unreadCallLogsCount, pendingUrgentActionItemsCount])

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