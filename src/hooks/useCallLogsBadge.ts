// src/hooks/useCallLogsBadge.ts
'use client'
import { useEffect, useState, useCallback } from 'react'
import { callLogsApi } from '@/api/org/call-logs'
import { useAuth } from '@/context/useAuthContext'

export function useCallLogsBadge() {
  const [unreadCount, setUnreadCount] = useState(0)
  const { token, isAuthenticated, user } = useAuth()

  const fetchUnreadCount = useCallback(async () => {
    // Only fetch for org users (not platform users)
    if (!token || !isAuthenticated || user?.actor === 'platform') {
      setUnreadCount(0)
      return
    }
    
    try {
      const response = await callLogsApi.getUnreadCount()
      setUnreadCount(response.unread_count)
    } catch (err) {
      console.error('Failed to fetch unread call logs count:', err)
      // Don't reset count on error to avoid badge flickering
    }
  }, [token, isAuthenticated, user?.actor])

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount()

    // Listen for updates from call records page
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number }>
      if (customEvent.detail?.count !== undefined) {
        setUnreadCount(customEvent.detail.count)
      }
    }

    // Listen for real-time call log creation events
    const handleNewCallLog = () => {
      // Increment count immediately for better UX
      setUnreadCount(prev => prev + 1)
      // Then fetch actual count to ensure accuracy
      fetchUnreadCount()
    }

    window.addEventListener('unreadCallLogsUpdated', handleUpdate)
    window.addEventListener('newCallLogCreated', handleNewCallLog)

    // Poll every 30 seconds for updates (in case events are missed)
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => {
      window.removeEventListener('unreadCallLogsUpdated', handleUpdate)
      window.removeEventListener('newCallLogCreated', handleNewCallLog)
      clearInterval(interval)
    }
  }, [fetchUnreadCount])

  return unreadCount
}