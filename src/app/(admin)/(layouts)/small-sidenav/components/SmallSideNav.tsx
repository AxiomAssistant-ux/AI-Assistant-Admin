'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const SmallSideNav = () => {
  const route = useRouter()
  const { changeMenu } = useLayoutContext()
  useEffect(() => {
    changeMenu.size('condensed')
    route.push('/dashboards')
  }, [])
  return <></>
}

export default SmallSideNav
