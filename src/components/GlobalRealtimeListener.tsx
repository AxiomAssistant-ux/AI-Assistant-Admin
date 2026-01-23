'use client'

import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'

export default function GlobalRealtimeListener() {
  const shownNotifications = useRef<Set<string>>(new Set())

  const handleCallLogCreated = useCallback((data: any) => {
    const notificationKey = `call_${data.conversation_id || data.id}`

    // ✅ prevent duplicate toasts
    if (shownNotifications.current.has(notificationKey)) return
    shownNotifications.current.add(notificationKey)

    setTimeout(() => {
      shownNotifications.current.delete(notificationKey)
    }, 30000)

    // ✅ show toast globally
    toast.success(
      <div>
        <strong>New Call Received</strong>
        <div className="small mt-1">
          From: {data.caller_name} ({data.caller_number})
        </div>
        {data.store_location && (
          <div className="small">Location: {data.store_location}</div>
        )}
      </div>,
      {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: notificationKey,
      }
    )

    // ✅ trigger refresh for whole app
    window.dispatchEvent(
      new CustomEvent('call_logs_refresh', {
        detail: { reason: 'call_log_created', data }
      })
    )
  }, [])

  useRealtimeUpdates({
    onCallLogCreated: handleCallLogCreated,
    onConnect: () => console.log('✅ Global realtime connected'),
    onDisconnect: () => console.log('❌ Global realtime disconnected'),
  })

  return null
}
