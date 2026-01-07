// src/hooks/useRealtimeUpdates.ts
import { useEffect, useRef, useState, useCallback } from 'react'

export type RealtimeEvent =
  | 'connected'
  | 'heartbeat'
  | 'call_log_created'
  | 'complaint_created'
  | 'complaint_updated'
  | 'appointment_created'
  | 'appointment_updated'
  | 'order_created'
  | 'order_updated'
  | 'active_calls_updated'

export interface RealtimeMessage {
  event: RealtimeEvent
  data: any
  timestamp?: string
}

export interface UseRealtimeUpdatesOptions {
  onConnect?: () => void
  onDisconnect?: () => void
  onMessage?: (message: RealtimeMessage) => void
  onCallLogCreated?: (data: any) => void
  onComplaintCreated?: (data: any) => void
  onComplaintUpdated?: (data: any) => void
  onAppointmentCreated?: (data: any) => void
  onAppointmentUpdated?: (data: any) => void
  onOrderCreated?: (data: any) => void
  onOrderUpdated?: (data: any) => void
  autoReconnect?: boolean
  reconnectDelay?: number
}

export function useRealtimeUpdates(options: UseRealtimeUpdatesOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isManualClose = useRef(false)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // STABILITY UPDATE: Store options in a ref so connect() 
  // doesn't need to re-run when functions change
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const connect = useCallback(() => {
    if (wsRef.current) {
      console.log('[WebSocket] Connection already exists, skipping')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'
      let wsUrl = baseUrl
        .replace('https://', 'wss://')
        .replace('http://', 'ws://')

      const ws = new WebSocket(`${wsUrl}/realtime/ws?token=${encodeURIComponent(token)}`)

      ws.onopen = () => {
        console.log('[WebSocket] Connected successfully')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        optionsRef.current.onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data)

          if (message.event !== 'heartbeat') {
            console.log('[WebSocket] Message:', message.event)
          }

          // Use Ref for all callbacks to prevent stale closures/restarts
          optionsRef.current.onMessage?.(message)

          const h = optionsRef.current;
          switch (message.event) {
            case 'call_log_created': h.onCallLogCreated?.(message.data); break
            case 'complaint_created': h.onComplaintCreated?.(message.data); break
            case 'complaint_updated': h.onComplaintUpdated?.(message.data); break
            case 'appointment_created': h.onAppointmentCreated?.(message.data); break
            case 'appointment_updated': h.onAppointmentUpdated?.(message.data); break
            case 'order_created': h.onOrderCreated?.(message.data); break
            case 'order_updated': h.onOrderUpdated?.(message.data); break
            // Active calls update is handled via onMessage callback
          }
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('[WebSocket] Connection error')
        setError('WebSocket connection error')
      }

      ws.onclose = (event) => {
        if (wsRef.current !== ws) {
          console.log('[WebSocket] Ignoring stale socket close')
          return
        }

        console.log('[WebSocket] Disconnected:', event.code, event.reason || 'No reason provided')
        setIsConnected(false)
        wsRef.current = null
        optionsRef.current.onDisconnect?.()

        const { autoReconnect = true, reconnectDelay = 3000 } = optionsRef.current;

        if (autoReconnect && !isManualClose.current) {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++
            const delay = reconnectDelay * Math.pow(1.5, reconnectAttempts.current - 1)

            console.log(`[WebSocket] Reconnecting in ${Math.round(delay)}ms... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`)

            reconnectTimeoutRef.current = setTimeout(() => {
              connect()
            }, delay)
          } else {
            console.error('[WebSocket] Max reconnection attempts reached')
            setError('Failed to reconnect after multiple attempts')
          }
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('[WebSocket] Connection failed:', err)
      setError('Failed to establish WebSocket connection')
    }
  }, []) 

  const disconnect = useCallback(() => {
    isManualClose.current = true

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }

    reconnectAttempts.current = 0
    setIsConnected(false)
  }, [])

  const sendHeartbeat = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('ping')
    }
  }, [])

  useEffect(() => {
    isManualClose.current = false
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      sendHeartbeat()
    }, 30000)

    return () => clearInterval(interval)
  }, [isConnected, sendHeartbeat])

  return {
    isConnected,
    error,
    disconnect,
    reconnect: connect
  }
}