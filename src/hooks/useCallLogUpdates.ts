// src/hooks/useCallLogUpdates.ts
import { useEffect, useCallback } from 'react'
import { useRealtime } from '@/context/RealtimeContext'

interface CallLogData {
  id: string
  conversation_id: string
  caller_name: string
  caller_number: string
  store_location?: string
  store_number?: string
  brief_summary: string
  action_flag: boolean
}

/**
 * Hook to subscribe to call log updates
 * 
 * Usage:
 * ```tsx
 * useCallLogUpdates({
 *   onCallLogCreated: (data) => {
 *     console.log('New call log:', data)
 *     // Refresh your list
 *   }
 * })
 * ```
 */
export function useCallLogUpdates(options: {
  onCallLogCreated?: (data: CallLogData) => void
  onComplaintCreated?: (data: any) => void
  onComplaintUpdated?: (data: any) => void
}) {
  const { subscribe } = useRealtime()

  useEffect(() => {
    const unsubscribers: (() => void)[] = []

    // Subscribe to call_log_created
    if (options.onCallLogCreated) {
      const unsubscribe = subscribe('call_log_created', options.onCallLogCreated)
      unsubscribers.push(unsubscribe)
    }

    // Subscribe to complaint_created
    if (options.onComplaintCreated) {
      const unsubscribe = subscribe('complaint_created', options.onComplaintCreated)
      unsubscribers.push(unsubscribe)
    }

    // Subscribe to complaint_updated
    if (options.onComplaintUpdated) {
      const unsubscribe = subscribe('complaint_updated', options.onComplaintUpdated)
      unsubscribers.push(unsubscribe)
    }

    // Cleanup all subscriptions
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  }, [subscribe, options.onCallLogCreated, options.onComplaintCreated, options.onComplaintUpdated])
}
