// src/hooks/useActiveCalls.ts
import { useEffect, useState, useCallback } from 'react'
// import { useRealtimeUpdates } from './useRealtimeUpdates'

export interface ActiveCall {
  call_sid: string
  agent_id: string
  caller_id: string
  start_time: string
  conversation_id: string
}

export interface ActiveCallsData {
  count: number
  calls: ActiveCall[]
}

/**
 * Hook to track active calls in real-time
 * 
 * IMPORTANT: This hook does NOT create its own WebSocket connection.
 * It relies on the parent component having useRealtimeUpdates() with
 * onActiveCallsUpdated callback.
 * 
 * Usage:
 * ```tsx
 * // In parent component:
 * useRealtimeUpdates({
 *   onActiveCallsUpdated: (data) => console.log(data),
 *   // ... other callbacks
 * })
 * 
 * // In child component:
 * const { activeCallsCount, activeCalls } = useActiveCalls()
 * ```
 */
export function useActiveCalls() {
  const [activeCallsData, setActiveCallsData] = useState<ActiveCallsData>({
    count: 0,
    calls: []
  })

  // Listen for custom events dispatched by the shared WebSocket
  useEffect(() => {
    const handleUpdate = (event: CustomEvent<ActiveCallsData>) => {
      console.log('📞 Active calls badge received update:', event.detail)
      setActiveCallsData(event.detail)
    }

    window.addEventListener('active_calls_updated' as any, handleUpdate)
    
    return () => {
      window.removeEventListener('active_calls_updated' as any, handleUpdate)
    }
  }, [])

  return {
    /** Number of active calls */
    activeCallsCount: activeCallsData.count,
    
    /** List of active calls */
    activeCalls: activeCallsData.calls
  }
}