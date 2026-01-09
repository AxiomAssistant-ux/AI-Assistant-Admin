'use client'
import Footer from '@/components/layout/Footer'
import { ChildrenType } from '@/types/component-props'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Container } from 'react-bootstrap'
import AuthGuard from '@/lib/auth-guard'
import { VerticalDebug } from '@/components/VerticalDebug'

const TopNavigationBar = dynamic(() => import('@/components/layout/TopNavigationBar/page'))
const VerticalNavigationBar = dynamic(() => import('@/components/layout/VerticalNavigationBar/page'))

const AdminLayout = ({ children }: ChildrenType) => {
  return (
    <AuthGuard actor="org" signInPath="/auth/sign-in">
      <div className="wrapper">
        <Suspense>
          <TopNavigationBar />
        </Suspense>
        <VerticalNavigationBar />
        <div className="page-content">
          <Container fluid>
            {children}
            {/* <VerticalDebug /> */}
          </Container>
          <Footer />
        </div>
      </div>
    </AuthGuard>
  )
}

export default AdminLayout
