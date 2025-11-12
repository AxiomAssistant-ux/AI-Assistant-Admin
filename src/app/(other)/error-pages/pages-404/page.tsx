import { Metadata } from 'next'
import React from 'react'
import Error404 from './components/Error404'

export const metadata: Metadata = { title: 'Page Not Found -404 ' }

const Error404Page = () => {
  return (
    <>
      <Error404 />
    </>
  )
}

export default Error404Page
