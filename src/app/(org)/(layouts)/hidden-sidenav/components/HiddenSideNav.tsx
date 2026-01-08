'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const HiddenSideNav = () => {
  const route = useRouter()
  const { changeMenu } = useLayoutContext()
  useEffect(() => {
    changeMenu.size('hidden')
    route.push('/dashboards')
  }, [changeMenu, route])
  return <></>
}

export default HiddenSideNav
