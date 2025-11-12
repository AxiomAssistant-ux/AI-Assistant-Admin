'use client'
import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLayoutContext } from '@/context/useLayoutContext'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import useViewPort from '@/hooks/useViewPort'

const LeftSideBarToggle = () => {
  const {
    menu: { size },
    changeMenu: { size: changeMenuSize },
    toggleBackdrop,
  } = useLayoutContext()
  const pathname = usePathname()
  const { width } = useViewPort()
  const isFirstRender = useRef(true)

  const handleMenuSize = () => {
    if (size === 'hidden') toggleBackdrop()
    if (size === 'condensed') changeMenuSize('default')
    else if (size === 'default') changeMenuSize('condensed')
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else if (size === 'hidden') {
      toggleBackdrop()
    }

    if (width <= 1140) {
      if (size !== 'hidden') changeMenuSize('hidden')
    }
  }, [pathname, width])

  return (
    <div className="topbar-item">
      <button type="button" onClick={handleMenuSize} className="button-toggle-menu topbar-button">
        <IconifyIcon icon="solar:hamburger-menu-outline" width={24} height={24} className="fs-24  align-middle" />
      </button>
    </div>
  )
}

export default LeftSideBarToggle
