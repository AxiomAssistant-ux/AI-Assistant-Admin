'use client'

import React from 'react'
import AppMenu from './components/AppMenu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import LogoBox from '@/components/wrapper/LogoBox'
import { useAuth } from '@/context/useAuthContext'
import { getAccessibleMenuItems } from '@/helpers/Manu'

const Page = () => {
  const { user } = useAuth()

  // const menuItems = getMenuItems(user?.actor ?? null)
  const menuItems = getAccessibleMenuItems(user?.actor ?? null, {
    is_admin: user?.role === 'admin',
    features: []
  })


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
