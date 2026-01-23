'use client'

import { useEffect, useRef } from 'react'

type FetchFn = () => void | Promise<void>

/**
 * ✅ Triggers your fetch function whenever a real-time event happens
 * 
 * This hook listens to custom events dispatched by GlobalRealtimeListener
 * and triggers your data fetch function automatically.
 * 
 * Works with events:
 * - 'call_logs_refresh' - When new call logs are created
 * - 'active_calls_updated' - When active calls change
 * - 'complaints_refresh' - When complaints are updated
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const fetchData = async () => {
 *     const response = await api.getCallLogs()
 *     setData(response.data)
 *   }
 * 
 *   useRealtimeRefresh(fetchData)
 * 
 *   return <div>...</div>
 * }
 * ```
 */
export function useRealtimeRefresh(fetchFn: FetchFn, events: string[] = ['call_logs_refresh']) {
  const fetchRef = useRef(fetchFn)

  // Keep latest fetch function reference (avoid stale closure)
  useEffect(() => {
    fetchRef.current = fetchFn
  }, [fetchFn])

  useEffect(() => {
    const handleRefresh = (event: Event) => {
      const customEvent = event as CustomEvent
      console.log(`[useRealtimeRefresh] Triggered by ${customEvent.type}`, customEvent.detail)
      fetchRef.current?.()
    }

    // Subscribe to all specified events
    events.forEach(eventName => {
      window.addEventListener(eventName, handleRefresh)
    })

    return () => {
      // Unsubscribe from all events
      events.forEach(eventName => {
        window.removeEventListener(eventName, handleRefresh)
      })
    }
  }, [events])
}

/**
 * ✅ Hook specifically for active calls updates
 * 
 * This is a convenience hook that listens only to 'active_calls_updated' events.
 */
export function useActiveCallsRefresh(fetchFn: FetchFn) {
  return useRealtimeRefresh(fetchFn, ['active_calls_updated'])
}