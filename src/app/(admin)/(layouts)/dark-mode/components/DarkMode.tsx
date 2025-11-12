'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const DarkMode = () => {
  const route = useRouter()
  const { changeTheme } = useLayoutContext()
  useEffect(() => {
    changeTheme('dark')
    route.push('/dashboards')
  }, [])
  return <></>
}

export default DarkMode
