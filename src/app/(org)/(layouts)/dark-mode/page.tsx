import React from 'react'
import DarkMode from './components/DarkMode'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dark Mode' }

const DarkModePage = () => {
  return (
    <>
      <DarkMode />
    </>
  )
}

export default DarkModePage
