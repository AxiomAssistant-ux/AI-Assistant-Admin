'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const DarkSideNav = () => {
  const route = useRouter()
  const { changeMenu } = useLayoutContext()
  useEffect(() => {
    changeMenu.theme('dark')
    route.push('/dashboards')
  }, [])
  return <></>
}

export default DarkSideNav
