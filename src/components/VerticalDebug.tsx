// src/components/debug/VerticalDebug.tsx
'use client'

import { useAuth } from '@/context/useAuthContext'
import { isOrgUser } from '@/types/auth'

export function VerticalDebug() {
  const { user } = useAuth()
  
  if (!user || !isOrgUser(user)) return null
  
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>Vertical: {user.organization?.vertical_key || 'MISSING'}</div>
      <div>Is Admin: {user.is_admin ? 'Yes' : 'No'}</div>
      <div>Features: {user.features.length}</div>
      <div style={{ fontSize: '10px', marginTop: '5px' }}>
        {user.features.join(', ')}
      </div>
    </div>
  )
}