import React from 'react'
import DarkSideNav from './components/DarkSideNav'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dark Sidenav' }

const DarkSideNavPage = () => {
  return (
    <>
      <DarkSideNav />
    </>
  )
}

export default DarkSideNavPage
