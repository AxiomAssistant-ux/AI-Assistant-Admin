// src/hooks/useSocketIO.ts
import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export type RealtimeEvent =
  | 'connected'
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

export interface UseSocketIOOptions {
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
  onActiveCallsUpdated?: (data: any) => void
}

export function useSocketIO(options: UseSocketIOOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const mountedRef = useRef(true)  // ✅ Track if component is mounted

  // ✅ FIX #6: Stable options reference to prevent reconnections
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const connect = useCallback(() => {
    // ✅ Prevent connection if already connected or unmounted
    if (!mountedRef.current) {
      console.log('[Socket.IO] Component unmounted, skipping connection')
      return
    }

    if (socketRef.current?.connected) {
      console.log('[Socket.IO] Already connected, skipping')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
      const socketUrl = baseUrl.replace('/api/v1', '')

      console.log('[Socket.IO] Connecting to:', socketUrl)

      const socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: maxReconnectAttempts,
        timeout: 20000
      })

      // ✅ Connection events
      socket.on('connect', () => {
        if (!mountedRef.current) return
        
        console.log('[Socket.IO] Connected successfully', socket.id)
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        optionsRef.current.onConnect?.()
        
        // ✅ Dispatch global event for status tracking
        window.dispatchEvent(new Event('realtime_connected'))
      })

      socket.on('disconnect', (reason) => {
        if (!mountedRef.current) return
        
        console.log('[Socket.IO] Disconnected:', reason)
        setIsConnected(false)
        optionsRef.current.onDisconnect?.()
        
        // ✅ Dispatch global event for status tracking
        window.dispatchEvent(new Event('realtime_disconnected'))
      })

      socket.on('connect_error', (err) => {
        if (!mountedRef.current) return
        
        console.error('[Socket.IO] Connection error:', err.message)
        setError(`Connection error: ${err.message}`)
        reconnectAttempts.current++

        if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error('[Socket.IO] Max reconnection attempts reached')
          setError('Failed to connect after multiple attempts')
        }
      })

      // ✅ Application events - removed duplicate logging
      socket.on('connected', (data) => {
        console.log('[Socket.IO] Server confirmed connection')
      })

      socket.on('call_log_created', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onCallLogCreated?.(message.data)
      })

      socket.on('complaint_created', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onComplaintCreated?.(message.data)
      })

      socket.on('complaint_updated', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onComplaintUpdated?.(message.data)
      })

      socket.on('appointment_created', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onAppointmentCreated?.(message.data)
      })

      socket.on('appointment_updated', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onAppointmentUpdated?.(message.data)
      })

      socket.on('order_created', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onOrderCreated?.(message.data)
      })

      socket.on('order_updated', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onOrderUpdated?.(message.data)
      })

      // ✅ FIX #7: Active calls handler without window event (handled in global listener)
      socket.on('active_calls_updated', (message: RealtimeMessage) => {
        if (!mountedRef.current) return
        console.log('[Socket.IO] Active calls update:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onActiveCallsUpdated?.(message.data)
      })

      socket.on('pong', () => {
        // Silent heartbeat acknowledgment
      })

      socketRef.current = socket

    } catch (err) {
      console.error('[Socket.IO] Connection failed:', err)
      setError('Failed to establish Socket.IO connection')
    }
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    reconnectAttempts.current = 0
    setIsConnected(false)
    window.dispatchEvent(new Event('realtime_disconnected'))
  }, [])

  const sendPing = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping')
    }
  }, [])

  // ✅ Auto-connect on mount
  useEffect(() => {
    mountedRef.current = true
    connect()

    return () => {
      mountedRef.current = false
      disconnect()
    }
  }, [connect, disconnect])

  // ✅ Heartbeat interval
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      sendPing()
    }, 30000)

    return () => clearInterval(interval)
  }, [isConnected, sendPing])

  return {
    isConnected,
    error,
    disconnect,
    reconnect: connect,
    socket: socketRef.current
  }
}