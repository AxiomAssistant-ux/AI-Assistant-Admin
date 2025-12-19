import React from 'react'
import DarkTopNav from './components/DarkTopNav'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dark Topnav' }

const DarkTopNavPage = () => {
  return (
    <>
      <DarkTopNav />
    </>
  )
}

export default DarkTopNavPage
