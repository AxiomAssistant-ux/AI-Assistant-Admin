import React from 'react'
import { Metadata } from 'next'
import Error404 from '../(other)/error-pages/pages-404/components/Error404'

export const metadata: Metadata = { title: '404 ' }


export default function DashboardNotFound() {
  return <Error404/>
}

