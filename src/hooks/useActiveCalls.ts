// src/hooks/useActiveCalls.ts
import { useEffect, useState, useCallback } from 'react'
import { useRealtimeUpdates } from './useRealtimeUpdates'

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
 * Usage:
 * ```tsx
 * const { activeCallsCount, activeCalls, isLoading } = useActiveCalls()
 * ```
 */
export function useActiveCalls() {
  const [activeCallsData, setActiveCallsData] = useState<ActiveCallsData>({
    count: 0,
    calls: []
  })
  const [isLoading, setIsLoading] = useState(true)

  const handleActiveCallsUpdate = useCallback((data: ActiveCallsData) => {
    console.log('📞 Active calls updated:', data)
    setActiveCallsData(data)
    setIsLoading(false)
  }, [])

  const handleConnect = useCallback(() => {
    console.log('✅ Active calls tracking connected')
    setIsLoading(false)
  }, [])

  const handleDisconnect = useCallback(() => {
    console.log('❌ Active calls tracking disconnected')
    // Keep last known state on disconnect
  }, [])

  // Subscribe to real-time updates
  const { isConnected } = useRealtimeUpdates({
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onMessage: (message) => {
      if (message.event === 'active_calls_updated') {
        handleActiveCallsUpdate(message.data)
      }
    }
  })

  return {
    /** Number of active calls */
    activeCallsCount: activeCallsData.count,
    
    /** List of active calls */
    activeCalls: activeCallsData.calls,
    
    /** Whether the initial data is loading */
    isLoading,
    
    /** Whether real-time updates are connected */
    isConnected
  }
}