'use client'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import dynamic from 'next/dynamic'
const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then((mod) => mod.LayoutProvider), {
  ssr: false,
})
import { AuthProvider } from '@/context/useAuthContext'
import { NotificationProvider } from '@/context/useNotificationContext'
import { VoicesProvider } from '@/context/useVoicesContext'
import { ChildrenType } from '@/types/component-props'

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  return (
    <SessionProvider>
      <AuthProvider>
        <VoicesProvider>
          <LayoutProvider>
            <NotificationProvider>
              {children}
              <ToastContainer theme="colored" />
            </NotificationProvider>
          </LayoutProvider>
        </VoicesProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
export default AppProvidersWrapper
