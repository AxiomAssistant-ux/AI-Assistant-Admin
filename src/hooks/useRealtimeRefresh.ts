'use client'

import { useEffect, useRef } from 'react'

type FetchFn = () => void | Promise<void>

/**
 * ✅ Triggers your fetch function whenever a real-time event happens
 * (example: call log created, complaint updated etc)
 *
 * Works with GlobalRealtimeListener event: "call_logs_refresh"
 */
export function useRealtimeRefresh(fetchFn: FetchFn) {
  const fetchRef = useRef(fetchFn)

  // keep latest fetch function reference (avoid stale closure)
  useEffect(() => {
    fetchRef.current = fetchFn
  }, [fetchFn])

  useEffect(() => {
    const handleRefresh = () => {
      fetchRef.current?.()
    }

    // ✅ listening to same event global refresher dispatches
    window.addEventListener('call_logs_refresh', handleRefresh)

    return () => {
      window.removeEventListener('call_logs_refresh', handleRefresh)
    }
  }, [])
}
