// src/hooks/useActionItemsBadge.ts
'use client'
import { useEffect, useState, useCallback } from 'react'
import { actionItemsApi } from '@/api/org/action-items'
import { useAuth } from '@/context/useAuthContext'

export function useActionItemsBadge() {
  const [pendingUrgentCount, setPendingUrgentCount] = useState(0)
  const { token, isAuthenticated, user } = useAuth()

  const fetchPendingUrgentCount = useCallback(async () => {
    // Only fetch for org users (not platform users)
    if (!token || !isAuthenticated || user?.actor === 'platform') {
      setPendingUrgentCount(0)
      return
    }
    
    try {
      const response = await actionItemsApi.getPendingUrgentCount()
      setPendingUrgentCount(response.pending_urgent_count)
    } catch (err) {
      console.error('Failed to fetch pending urgent action items count:', err)
      // Don't reset count on error to avoid badge flickering
    }
  }, [token, isAuthenticated, user?.actor])

  useEffect(() => {
    // Initial fetch
    fetchPendingUrgentCount()

    // Listen for updates from action items page
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number }>
      if (customEvent.detail?.count !== undefined) {
        setPendingUrgentCount(customEvent.detail.count)
      }
    }

    // Listen for new action item creation
    const handleNewActionItem = () => {
      // Fetch actual count to ensure accuracy
      fetchPendingUrgentCount()
    }

    // Listen for action item status/urgency changes
    const handleActionItemChanged = () => {
      fetchPendingUrgentCount()
    }

    window.addEventListener('pendingUrgentActionItemsUpdated', handleUpdate)
    window.addEventListener('newActionItemCreated', handleNewActionItem)
    window.addEventListener('actionItemChanged', handleActionItemChanged)

    // Poll every 30 seconds for updates (in case events are missed)
    const interval = setInterval(fetchPendingUrgentCount, 30000)

    return () => {
      window.removeEventListener('pendingUrgentActionItemsUpdated', handleUpdate)
      window.removeEventListener('newActionItemCreated', handleNewActionItem)
      window.removeEventListener('actionItemChanged', handleActionItemChanged)
      clearInterval(interval)
    }
  }, [fetchPendingUrgentCount])

  return pendingUrgentCount
}