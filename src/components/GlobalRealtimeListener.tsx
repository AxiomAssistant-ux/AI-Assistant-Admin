'use client'

import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import { useSocketIO } from '@/hooks/useSocketIO'

export default function GlobalRealtimeListener() {
  const shownNotifications = useRef<Set<string>>(new Set())

  const handleCallLogCreated = useCallback((data: any) => {
    const notificationKey = `call_${data.conversation_id || data.id}`

    // ✅ Prevent duplicate toasts
    if (shownNotifications.current.has(notificationKey)) return
    shownNotifications.current.add(notificationKey)

    setTimeout(() => {
      shownNotifications.current.delete(notificationKey)
    }, 30000)

    // ✅ Show toast globally
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

    // ✅ Trigger refresh events
    window.dispatchEvent(
      new CustomEvent('call_logs_refresh', {
        detail: { reason: 'call_log_created', data }
      })
    )

    window.dispatchEvent(
      new CustomEvent('unread_count_refresh', {
        detail: { reason: 'call_log_created', data }
      })
    )

  }, [])

  const handleActiveCallsUpdated = useCallback((data: any) => {
    console.log('📞 Global: Active calls updated:', data)

    // ✅ FIX #8: Dispatch event with data for useActiveCalls hook
    window.dispatchEvent(
      new CustomEvent('active_calls_updated', {
        detail: data
      })
    )

    // ✅ FIX #9: Only show toast when count changes significantly
    // Don't spam toasts for every update
    const lastCount = parseInt(sessionStorage.getItem('last_active_calls_count') || '0')
    const currentCount = data.count || 0

    if (currentCount !== lastCount) {
      sessionStorage.setItem('last_active_calls_count', currentCount.toString())
      
      // Only show toast if there's a meaningful change
      if (currentCount > lastCount) {
        toast.info(
          `${currentCount} active call${currentCount > 1 ? 's' : ''} in progress`,
          {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            toastId: 'active_calls_update' // Prevent duplicates
          }
        )
      }
    }
  }, [])

  // ✅ FIX #10: Single Socket.IO connection for entire app
  useSocketIO({
    onCallLogCreated: handleCallLogCreated,
    onActiveCallsUpdated: handleActiveCallsUpdated,
    onConnect: () => {
      console.log('✅ Global Socket.IO connected')
      // Reset active calls count on reconnect
      sessionStorage.removeItem('last_active_calls_count')
    },
    onDisconnect: () => {
      console.log('❌ Global Socket.IO disconnected')
    },
  })

  return null
}