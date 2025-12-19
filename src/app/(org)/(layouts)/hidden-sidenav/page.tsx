import React from 'react'
import HiddenSideNav from './components/HiddenSideNav'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hidden Sidenav' }

const HiddenSideNavPage = () => {
  return (
    <>
      <HiddenSideNav />
    </>
  )
}

export default HiddenSideNavPage
