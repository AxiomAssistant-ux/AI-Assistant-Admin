'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const DarkTopNav = () => {
  const route = useRouter()
  const { changeTopbarTheme } = useLayoutContext()
  useEffect(() => {
    changeTopbarTheme('dark')
    route.push('/dashboards')
  }, [changeTopbarTheme, route])
  return <></>
}

export default DarkTopNav
