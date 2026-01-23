'use client'

import { useEffect, useState } from 'react'

export function useRealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const handleConnected = () => setIsConnected(true)
    const handleDisconnected = () => setIsConnected(false)

    window.addEventListener('realtime_connected', handleConnected)
    window.addEventListener('realtime_disconnected', handleDisconnected)

    return () => {
      window.removeEventListener('realtime_connected', handleConnected)
      window.removeEventListener('realtime_disconnected', handleDisconnected)
    }
  }, [])

  return { isConnected }
}
