// src/hooks/useActiveCalls.ts
import { useEffect, useState } from 'react'

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
 * ✅ FIXED: Hook to track active calls in real-time
 * 
 * This hook listens to custom events dispatched by GlobalRealtimeListener
 * and updates the active calls state accordingly.
 * 
 * Usage:
 * ```tsx
 * const { activeCallsCount, activeCalls } = useActiveCalls()
 * ```
 */
export function useActiveCalls() {
  const [activeCallsData, setActiveCallsData] = useState<ActiveCallsData>({
    count: 0,
    calls: []
  })

  useEffect(() => {
    // ✅ FIX #11: Properly typed event handler
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ActiveCallsData>
      console.log('📞 useActiveCalls: Received update:', customEvent.detail)
      
      // ✅ Validate data structure before updating state
      if (customEvent.detail && typeof customEvent.detail.count === 'number') {
        setActiveCallsData({
          count: customEvent.detail.count,
          calls: customEvent.detail.calls || []
        })
      }
    }

    window.addEventListener('active_calls_updated', handleUpdate)
    
    return () => {
      window.removeEventListener('active_calls_updated', handleUpdate)
    }
  }, [])

  return {
    /** Number of active calls */
    activeCallsCount: activeCallsData.count,
    
    /** List of active calls */
    activeCalls: activeCallsData.calls
  }
}