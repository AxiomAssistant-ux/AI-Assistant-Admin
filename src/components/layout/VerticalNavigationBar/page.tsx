'use client'

import React from 'react'
import AppMenu from './components/AppMenu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import LogoBox from '@/components/wrapper/LogoBox'
import { useAuth } from '@/context/useAuthContext'
import { getAccessibleMenuItems, getMenuItems } from '@/helpers/Manu'

const Page = () => {
  const { user } = useAuth()

  // const menuItems = getMenuItems(user?.actor ?? null)
  const menuItems =
    user?.actor === 'platform' ? getMenuItems('platform') : getAccessibleMenuItems(user?.actor ?? null, user)


  return (
    <div className="app-sidebar">
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  )
}

export default Page


export const dynamic = 'force-dynamic'
