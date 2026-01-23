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

  // Store options in ref to avoid re-running effects
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const connect = useCallback(() => {
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
      
      // Remove /api/v1 if present
      const socketUrl = baseUrl.replace('/api/v1', '')

      console.log('[Socket.IO] Connecting to:', socketUrl)

      const socket = io(socketUrl, {
        auth: {
          token
        },
        transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: maxReconnectAttempts,
        timeout: 20000
      })

      // Connection events
      socket.on('connect', () => {
        console.log('[Socket.IO] Connected successfully', socket.id)
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        optionsRef.current.onConnect?.()
      })

      socket.on('disconnect', (reason) => {
        console.log('[Socket.IO] Disconnected:', reason)
        setIsConnected(false)
        optionsRef.current.onDisconnect?.()
      })

      socket.on('connect_error', (err) => {
        console.error('[Socket.IO] Connection error:', err.message)
        setError(`Connection error: ${err.message}`)
        reconnectAttempts.current++

        if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error('[Socket.IO] Max reconnection attempts reached')
          setError('Failed to connect after multiple attempts')
        }
      })

      // Application events
      socket.on('connected', (data) => {
        console.log('[Socket.IO] Server confirmed connection:', data)
      })

      socket.on('call_log_created', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Call log created:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onCallLogCreated?.(message.data)
      })

      socket.on('complaint_created', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Complaint created:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onComplaintCreated?.(message.data)
      })

      socket.on('complaint_updated', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Complaint updated:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onComplaintUpdated?.(message.data)
      })

      socket.on('appointment_created', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Appointment created:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onAppointmentCreated?.(message.data)
      })

      socket.on('appointment_updated', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Appointment updated:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onAppointmentUpdated?.(message.data)
      })

      socket.on('order_created', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Order created:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onOrderCreated?.(message.data)
      })

      socket.on('order_updated', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Order updated:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onOrderUpdated?.(message.data)
      })

      socket.on('active_calls_updated', (message: RealtimeMessage) => {
        console.log('[Socket.IO] Active calls updated:', message.data)
        optionsRef.current.onMessage?.(message)
        optionsRef.current.onActiveCallsUpdated?.(message.data)
        
        // Dispatch custom event for useActiveCalls hook
        window.dispatchEvent(new CustomEvent('active_calls_updated', { 
          detail: message.data 
        }))
      })

      // Heartbeat/ping
      socket.on('pong', (data) => {
        // Heartbeat received
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
  }, [])

  const sendPing = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping')
    }
  }, [])

  // Auto-connect on mount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Heartbeat interval
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      sendPing()
    }, 30000) // 30 seconds

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