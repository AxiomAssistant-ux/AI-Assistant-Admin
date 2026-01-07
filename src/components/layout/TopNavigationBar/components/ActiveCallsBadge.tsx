// src/components/header/ActiveCallsBadge.tsx
'use client'

import React from 'react'
import { Badge, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useActiveCalls } from '@/hooks/useActiveCalls'

/**
 * Active Calls Badge Component
 * 
 * Displays a real-time badge showing the number of active calls.
 * Shows a pulsing animation when calls are in progress.
 * 
 * Usage in Header:
 * ```tsx
 * <ActiveCallsBadge />
 * ```
 */
export const ActiveCallsBadge: React.FC = () => {
  const { activeCallsCount, isLoading, isConnected } = useActiveCalls()

  // Don't show badge if not connected and no active calls
  if (!isConnected && activeCallsCount === 0) {
    return null
  }

  // Show loading state
  if (isLoading) {
    return (
      <Badge bg="secondary" className="d-flex align-items-center gap-2 px-3 py-2">
        <Spinner size="sm" animation="border" style={{ width: 14, height: 14 }} />
        <span className="fw-semibold small">Connecting...</span>
      </Badge>
    )
  }

  // No active calls - show minimal badge
  if (activeCallsCount === 0) {
    return (
      <Badge 
        bg="secondary" 
        className="d-flex align-items-center gap-2 px-3 py-2"
        style={{ opacity: 0.7 }}
      >
        <IconifyIcon icon="solar:phone-linear" width={16} height={16} />
        <span className="fw-semibold small">No Active Calls</span>
      </Badge>
    )
  }

  // Active calls present - show with animation
  return (
    <Badge 
      bg="success" 
      className="d-flex align-items-center gap-2 px-3 py-2 position-relative"
    >
      {/* Pulsing indicator */}
      <span
        className="position-absolute rounded-circle bg-white"
        style={{
          width: 8,
          height: 8,
          left: 8,
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />
      
      {/* Phone icon */}
      <IconifyIcon 
        icon="solar:phone-calling-rounded-bold" 
        width={18} 
        height={18}
        className="ms-1"
      />
      
      {/* Count */}
      <span className="fw-bold">
        {activeCallsCount} {activeCallsCount === 1 ? 'Call' : 'Calls'} in Progress
      </span>

      {/* Add CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
        }
      `}</style>
    </Badge>
  )
}

export default ActiveCallsBadge