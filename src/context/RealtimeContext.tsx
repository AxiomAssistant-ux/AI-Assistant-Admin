// src/context/RealtimeContext.tsx
'use client'

import React, { createContext, useContext, useCallback } from 'react'
import { useRealtimeUpdates, type RealtimeMessage } from '@/hooks/useRealtimeUpdates'

interface RealtimeContextValue {
  isConnected: boolean
  subscribe: (event: string, callback: (data: any) => void) => () => void
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null)

// Global event subscribers
const subscribers = new Map<string, Set<(data: any) => void>>()

/**
 * Global Realtime Provider
 * 
 * Place this at the root of your app (in layout.tsx) to provide
 * a single WebSocket connection for the entire application.
 * 
 * Usage in app/layout.tsx:
 * ```tsx
 * <RealtimeProvider>
 *   {children}
 * </RealtimeProvider>
 * ```
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  // Handle all incoming messages
  const handleMessage = useCallback((message: RealtimeMessage) => {
    const eventSubscribers = subscribers.get(message.event)
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        try {
          callback(message.data)
        } catch (error) {
          console.error(`[RealtimeProvider] Error in ${message.event} subscriber:`, error)
        }
      })
    }
  }, [])

  // Single WebSocket connection for entire app
  const { isConnected } = useRealtimeUpdates({
    onMessage: handleMessage,
    onConnect: () => console.log('✅ [RealtimeProvider] Global WebSocket connected'),
    onDisconnect: () => console.log('❌ [RealtimeProvider] Global WebSocket disconnected')
  })

  // Subscribe to specific events
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (!subscribers.has(event)) {
      subscribers.set(event, new Set())
    }
    
    const eventSubscribers = subscribers.get(event)!
    eventSubscribers.add(callback)
    
    console.log(`[RealtimeProvider] Subscribed to ${event}, total: ${eventSubscribers.size}`)
    
    // Return unsubscribe function
    return () => {
      eventSubscribers.delete(callback)
      console.log(`[RealtimeProvider] Unsubscribed from ${event}, remaining: ${eventSubscribers.size}`)
      
      if (eventSubscribers.size === 0) {
        subscribers.delete(event)
      }
    }
  }, [])

  return (
    <RealtimeContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </RealtimeContext.Provider>
  )
}

/**
 * Hook to access global realtime connection
 */
export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider')
  }
  return context
}
