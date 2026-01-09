'use client'
import React, { useEffect } from 'react'
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

  const handleMenuSize = () => {
    if (size === 'hidden') toggleBackdrop()
    if (size === 'condensed') changeMenuSize('default')
    else if (size === 'default') changeMenuSize('condensed')
  }

  useEffect(() => {
    if (width <= 1140) {
      if (size !== 'hidden') changeMenuSize('hidden')
    } else {
      if (size === 'hidden') changeMenuSize('default')
    }
  }, [width, size, changeMenuSize])

  useEffect(() => {
    if (size === 'hidden') {
      const htmlTag = document.getElementsByTagName('html')[0]
      if (htmlTag.classList.contains('sidebar-enable')) {
        toggleBackdrop()
      }
    }
  }, [pathname, size, toggleBackdrop])

  return (
    <div className="topbar-item">
      <button type="button" onClick={handleMenuSize} className="button-toggle-menu topbar-button">
        <IconifyIcon icon="solar:hamburger-menu-outline" width={24} height={24} className="fs-24  align-middle" />
      </button>
    </div>
  )
}

export default LeftSideBarToggle
