// src/hooks/useComplaintsBadge.ts
'use client'
import { useEffect, useState, useCallback } from 'react'
import { complaintsApi } from '@/api/org/complaints'
import { useAuth } from '@/context/useAuthContext'

export function useComplaintsBadge() {
  const [pendingCount, setPendingCount] = useState(0)
  const [inProgressCount, setInProgressCount] = useState(0)
  const { token, isAuthenticated, user } = useAuth()

  const fetchComplaintCounts = useCallback(async () => {
    // Only fetch for org users (not platform users)
    if (!token || !isAuthenticated || user?.actor === 'platform') {
      setPendingCount(0)
      setInProgressCount(0)
      return
    }
    
    try {
      const [pendingResponse, inProgressResponse] = await Promise.all([
        complaintsApi.getPendingCount(),
        complaintsApi.getInProgressCount()
      ])
      
      setPendingCount(pendingResponse.pending_count)
      setInProgressCount(inProgressResponse.in_progress_count)
    } catch (err) {
      console.error('Failed to fetch complaints counts:', err)
      // Don't reset counts on error to avoid badge flickering
    }
  }, [token, isAuthenticated, user?.actor])

  useEffect(() => {
    // Initial fetch
    fetchComplaintCounts()

    // Listen for updates from complaints page
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ 
        pendingCount: number
        inProgressCount: number 
      }>
      
      if (customEvent.detail) {
        if (customEvent.detail.pendingCount !== undefined) {
          setPendingCount(customEvent.detail.pendingCount)
        }
        if (customEvent.detail.inProgressCount !== undefined) {
          setInProgressCount(customEvent.detail.inProgressCount)
        }
      }
    }

    // Listen for complaint status changes
    const handleComplaintChanged = () => {
      fetchComplaintCounts()
    }

    window.addEventListener('complaintsCountUpdated', handleUpdate)
    window.addEventListener('complaintStatusChanged', handleComplaintChanged)

    // Poll every 30 seconds for updates
    const interval = setInterval(fetchComplaintCounts, 30000)

    return () => {
      window.removeEventListener('complaintsCountUpdated', handleUpdate)
      window.removeEventListener('complaintStatusChanged', handleComplaintChanged)
      clearInterval(interval)
    }
  }, [fetchComplaintCounts])

  return { 
    pendingCount, 
    inProgressCount, 
    totalCount: pendingCount + inProgressCount 
  }
}