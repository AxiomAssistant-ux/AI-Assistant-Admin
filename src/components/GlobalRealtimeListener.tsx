'use client'

import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import { useSocketIO } from '@/hooks/useSocketIO'

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

    // ✅ refresh call logs everywhere
    window.dispatchEvent(
      new CustomEvent('call_logs_refresh', {
        detail: { reason: 'call_log_created', data }
      })
    )

    // ✅ refresh unread count everywhere
    window.dispatchEvent(
      new CustomEvent('unread_count_refresh', {
        detail: { reason: 'call_log_created', data }
      })
    )

  }, [])

  const handleActiveCallsUpdated = useCallback((data: any) => {
    console.log('📞 Global: Active calls updated:', data)

    // ✅ trigger update for badge hook
    window.dispatchEvent(
      new CustomEvent('active_calls_updated', {
        detail: data
      })
    )

    // optional toast
    if (data.count > 0) {
      toast.info(
        `${data.count} active call${data.count > 1 ? 's' : ''} in progress`,
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
        }
      )
    }
  }, [])

  useSocketIO({
    onCallLogCreated: handleCallLogCreated,
    onActiveCallsUpdated: handleActiveCallsUpdated,
    onConnect: () => console.log('✅ Global Socket.IO connected'),
    onDisconnect: () => console.log('❌ Global Socket.IO disconnected'),
  })

  return null
}
