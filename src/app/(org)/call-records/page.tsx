'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Row, Col, Button, Badge, Modal, Card, Form, Spinner, Dropdown } from 'react-bootstrap'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/useAuthContext'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import { toast } from 'react-toastify'
import { callLogsApi, type CallLog, type CallLogsListParams } from '@/api/org/call-logs'
import { locationsApi, type Location } from '@/api/org/locations'
import { useFeatureGuard } from '@/hooks/useFeatureGuard'
// import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { useSocketIO } from '@/hooks/useSocketIO'
import { useRealtimeRefresh } from '@/hooks/useRealtimeRefresh'
import { useRealtimeStatus } from '@/hooks/useRealtimeStatus'


// Enhanced Progress Button for Audio Playback
const ProgressButton = ({
  progress,
  onClick,
  title,
  icon,
  variant = "outline-danger",
}: {
  progress: number
  onClick: () => void
  title: string
  icon: React.ReactNode
  variant?: string
}) => {
  const size = 36
  const stroke = 3
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#198754"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.1s linear",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      <Button
        variant={variant as any}
        size="sm"
        onClick={onClick}
        title={title}
        style={{
          width: size,
          height: size,
          padding: 0,
          position: "relative",
          zIndex: 2,
          borderRadius: '8px',
        }}
      >
        {icon}
      </Button>
    </div>
  )
}

const CallRecordsPage = () => {
  useFeatureGuard()

  const shownNotifications = useRef<Set<string>>(new Set())
  const { token, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const openCallId = searchParams.get('openCallId')

  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [successFilter, setSuccessFilter] = useState<'all' | 'success' | 'failed'>('all')
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  const [unreadCount, setUnreadCount] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)


  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  const [hasAutoOpened, setHasAutoOpened] = useState(false)
  const [openedFromComplaints, setOpenedFromComplaints] = useState(false)

  const [playingId, setPlayingId] = useState<string | null>(null)
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    setPlayingId(null)
  }, [])

  const playAudio = useCallback((call: CallLog) => {
    if (!call.recording_link) return

    stopAudio()

    const audio = new Audio(call.recording_link)
    audioRef.current = audio
    setPlayingId(call.id)

    const updateProgress = () => {
      if (!audioRef.current) return
      const a = audioRef.current

      const duration = a.duration || 0
      const current = a.currentTime || 0
      const progress = duration > 0 ? current / duration : 0

      setPlayProgress((prev) => ({
        ...prev,
        [call.id]: progress
      }))

      rafRef.current = requestAnimationFrame(updateProgress)
    }

    audio.addEventListener("ended", () => {
      stopAudio()
    })

    audio
      .play()
      .then(() => {
        rafRef.current = requestAnimationFrame(updateProgress)
      })
      .catch((err) => {
        toast.error("Unable to play recording")
        console.error("Audio playback error:", err)
        stopAudio()
      })
  }, [stopAudio])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase())
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, successFilter, selectedLocationIds])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (locationDropdownOpen && !target.closest('.location-dropdown-container')) {
        setLocationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [locationDropdownOpen])

  const fetchLocations = useCallback(async () => {
    if (!token || !isAuthenticated) return

    setLoadingLocations(true)
    try {
      const response = await locationsApi.list({ skip: 0, limit: 500 })
      setLocations(response.locations)
    } catch (err: any) {
      console.error('Failed to load locations:', err)
    } finally {
      setLoadingLocations(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const fetchCallLogs = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params: CallLogsListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
      }

      if (debouncedSearch) {
        params.search = debouncedSearch
      }

      if (selectedLocationIds.length > 0) {
        params.location_ids = selectedLocationIds
      }

      const response = await callLogsApi.list(params)

      setCallLogs(response.call_logs)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to fetch call logs')
      toast.error('Unable to load call records')
      setCallLogs([])
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch, selectedLocationIds])

  useEffect(() => {
    fetchCallLogs()
  }, [fetchCallLogs])

  const fetchUnreadCount = useCallback(async () => {
    if (!token || !isAuthenticated) return

    try {
      const response = await callLogsApi.getUnreadCount()
      setUnreadCount(response.unread_count)

      window.dispatchEvent(new CustomEvent('unreadCallLogsUpdated', {
        detail: { count: response.unread_count }
      }))
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount, callLogs])

  const handleCallLogCreated = useCallback((data: any) => {
    const notificationKey = `call_${data.conversation_id || data.id}`

    if (shownNotifications.current.has(notificationKey)) {
      return
    }

    shownNotifications.current.add(notificationKey)

    setTimeout(() => {
      shownNotifications.current.delete(notificationKey)
    }, 30000)

    toast.success(
      <div>
        <strong>New Call Received</strong>
        <div className="small mt-1">
          From: {data.caller_name} ({data.caller_number})
        </div>
        {data.store_location && (
          <div className="small">Location: {data.store_location}</div>
        )}
      </div>,
      {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: notificationKey
      }
    )

    fetchCallLogs()
    fetchUnreadCount()
  }, [fetchCallLogs, fetchUnreadCount])

  // const { isConnected: realtimeConnected } = useSocketIO({
  //   onCallLogCreated: (data) => {
  //     console.log('📞 New call log received on page:', data)
  //     // Optionally: Show page-specific notification
  //     // The global listener already shows a toast
  //   },
  //   onConnect: () => console.log('✅ Page: Real-time connected'),
  //   onDisconnect: () => console.log('❌ Page: Real-time disconnected')
  // })

  // ✅ AUTO-REFRESH WHEN EVENTS HAPPEN
  // useRealtimeRefresh(fetchCallLogs)
  // useRealtimeRefresh(fetchUnreadCount)
  const { isConnected: realtimeConnected } = useRealtimeStatus()


  useRealtimeRefresh(fetchCallLogs, ['call_logs_refresh'])
  useRealtimeRefresh(fetchUnreadCount, ['unread_count_refresh'])




  useEffect(() => {
    const loadSpecificCallLog = async () => {
      if (openCallId && token && isAuthenticated && !hasAutoOpened) {
        setHasAutoOpened(true)
        setOpenedFromComplaints(true)

        try {
          const callLog = await callLogsApi.getById(openCallId)

          setSelectedCall(callLog)
          setShowDetailModal(true)
          setAudioError(null)

          router.replace('/call-records', { scroll: false })

          toast.success('Call record loaded successfully')
        } catch (err: any) {
          console.error('Failed to load call log:', err)
          toast.error('Unable to load the requested call record')

          router.replace('/call-records', { scroll: false })
        }
      }
    }

    loadSpecificCallLog()
  }, [openCallId, token, isAuthenticated, hasAutoOpened, router])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleViewDetails = useCallback(async (call: CallLog) => {
    setSelectedCall(call)
    setShowDetailModal(true)
    setAudioError(null)

    if (!call.view_status) {
      try {
        await callLogsApi.markAsRead(call.id)

        setCallLogs(prev => prev.map(log =>
          log.id === call.id ? { ...log, view_status: true } : log
        ))

        fetchUnreadCount()
      } catch (err) {
        console.error('Failed to mark as read:', err)
      }
    }
  }, [fetchUnreadCount])

  const handleBackToComplaints = useCallback(() => {
    router.push('/complaints')
  }, [router])

  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    const durationMs = endTime - startTime
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDateTime(dateString)
  }

  const filteredCallLogs = useMemo(() => {
    return callLogs.filter((call) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'read' && call.view_status) ||
        (statusFilter === 'unread' && !call.view_status)

      const matchesSuccess =
        successFilter === 'all' ||
        (successFilter === 'success' && call.call_success) ||
        (successFilter === 'failed' && !call.call_success)

      return matchesStatus && matchesSuccess
    })
  }, [callLogs, statusFilter, successFilter])

  const handleLocationToggle = (locationId: string) => {
    setSelectedLocationIds(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId)
      } else {
        return [...prev, locationId]
      }
    })
  }

  const dataTableColumns: DataTableColumn<CallLog>[] = useMemo(
    () => [
      {
        key: 'rowNumber',
        header: '#',
        width: 60,
        align: 'left',
        render: (_, { rowIndex }) => (
          <span className="text-muted fw-semibold">{startIndex + rowIndex + 1}</span>
        )
      },
      {
        key: 'caller',
        header: 'Customer Information',
        minWidth: 200,
        render: (call) => (
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              {/* <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 32,
                  height: 32,
                  background: '#e3f2fd',
                  color: '#1976d2'
                }}
              >
                <IconifyIcon icon="solar:user-bold" width={16} height={16} />
              </div> */}
              <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                {call.caller.name}
              </div>
            </div>
            <small className="text-muted d-flex align-items-center gap-1">
              <IconifyIcon icon="solar:phone-linear" width={14} height={14} />
              {call.caller.number}
            </small>
            {call.caller.email && (
              <small className="text-muted d-flex align-items-center gap-1">
                <IconifyIcon icon="solar:letter-linear" width={14} height={14} />
                {call.caller.email}
              </small>
            )}
          </div>
        )
      },
      {
        key: 'store_info',
        header: 'Store Location',
        minWidth: 150,
        render: (call) => (
          <div>
            {call.store_location && (
              <div className="fw-semibold mb-1">
                {call.store_location}
              </div>
            )}
            {call.store_number && (
              <Badge
                bg="light"
                text="dark"
                className="border"
                style={{ fontSize: '0.75rem' }}
              >
                Store #{call.store_number}
              </Badge>
            )}
            {!call.store_number && !call.store_location && (
              <span className="text-muted fst-italic">Not specified</span>
            )}
          </div>
        )
      },
      {
        key: 'timing',
        header: 'Call Date & Time',
        minWidth: 160,
        render: (call) => (
          <div>
            <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
              {formatDateTime(call.call_timing.started_at)}
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge
                bg="info"
                className="d-flex align-items-center gap-1"
                style={{ fontSize: '0.7rem', padding: '0.35rem 0.6rem' }}
              >
                <IconifyIcon icon="solar:clock-circle-bold" width={12} height={12} />
                {calculateDuration(call.call_timing.started_at, call.call_timing.ended_at)}
              </Badge>
              <small className="text-muted">{formatTimeAgo(call.call_timing.started_at)}</small>
            </div>
          </div>
        )
      },
      {
        key: 'summary',
        header: 'Conversation Summary',
        minWidth: 350,
        render: (call) => (
          <div
            className="text-truncate"
            style={{ maxWidth: '350px' }}
            title={call.summaries.brief}
          >
            {call.summaries.brief}
          </div>
        )
      },
      {
        key: 'success',
        header: 'Call Outcome',
        width: 120,
        align: 'left',
        render: (call) => (
          <Badge
            bg={call.call_success ? 'success' : 'danger'}
            className="d-flex align-items-center gap-1 justify-content-center"
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', fontWeight: 600 }}
          >
            <IconifyIcon
              icon={call.call_success ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
              width={14}
              height={14}
            />
            {call.call_success ? 'Completed' : 'Incomplete'}
          </Badge>
        )
      },
      {
        key: 'view_status',
        header: 'Read Status',
        width: 140,
        align: 'left',
        sticky: 'right',
        defaultSticky: true,
        render: (call) => (
          <Form.Check
            type="switch"
            id={`read-toggle-${call.id}`}
            checked={call.view_status}
            label={
              <span className="fw-semibold">
                {call.view_status ? 'Read' : 'Unread'}
              </span>
            }
            onChange={async (e) => {
              const checked = e.target.checked

              try {
                if (checked) {
                  await callLogsApi.markAsRead(call.id)
                }

                setCallLogs(prev =>
                  prev.map(log =>
                    log.id === call.id ? { ...log, view_status: checked } : log
                  )
                )

                fetchUnreadCount()
              } catch {
                toast.error('Failed to update read status')
              }
            }}
          />
        )
      },
      {
        key: "actions",
        header: "Actions",
        width: 160,
        align: "left",
        sticky: "right",
        render: (call) => {
          const isPlaying = playingId === call.id
          const progress = playProgress[call.id] || 0

          return (
            <div className="d-flex gap-2 align-items-center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleViewDetails(call)}
                title="View Full Details"
                style={{ borderRadius: '8px' }}
              >
                <IconifyIcon icon="solar:eye-bold" width={16} height={16} />
              </Button>

              {call.recording_link ? (
                isPlaying ? (
                  <ProgressButton
                    progress={progress}
                    onClick={(e?: any) => {
                      e?.stopPropagation?.()
                      stopAudio()
                    }}
                    title="Stop Recording"
                    variant="outline-danger"
                    icon={<IconifyIcon icon="solar:stop-bold" width={16} height={16} />}
                  />
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(call)
                    }}
                    title="Play Call Recording"
                    style={{ borderRadius: '8px' }}
                  >
                    <IconifyIcon icon="solar:play-bold" width={16} height={16} />
                  </Button>
                )
              ) : (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled
                  title="Recording Not Available"
                  style={{ opacity: 0.4, borderRadius: '8px' }}
                >
                  <IconifyIcon icon="solar:play-bold" width={16} height={16} />
                </Button>
              )}
            </div>
          )
        },
      }
    ],
    [
      startIndex,
      handleViewDetails,
      playingId,
      playProgress,
      playAudio,
      stopAudio,
    ]
  )

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'status-filter',
        label: 'Review Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'All Calls', value: '' },
          { label: 'Reviewed', value: 'read' },
          { label: 'Needs Review', value: 'unread' }
        ],
        onChange: (value) => {
          setStatusFilter((value || 'all') as any)
          setCurrentPage(1)
        },
        onClear: statusFilter !== 'all' ? () => {
          setStatusFilter('all')
          setCurrentPage(1)
        } : undefined,
        width: 4
      },
      {
        id: 'success-filter',
        label: 'Call Outcome',
        type: 'select',
        value: successFilter === 'all' ? '' : successFilter,
        options: [
          { label: 'All Outcomes', value: '' },
          { label: 'Completed', value: 'success' },
          { label: 'Incomplete', value: 'failed' }
        ],
        onChange: (value) => {
          setSuccessFilter((value || 'all') as any)
          setCurrentPage(1)
        },
        onClear: successFilter !== 'all' ? () => {
          setSuccessFilter('all')
          setCurrentPage(1)
        } : undefined,
        width: 4
      },
    ],
    [statusFilter, successFilter]
  )

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
            <IconifyIcon icon="solar:lock-password-linear" width={64} height={64} className="text-muted mb-3" />
            <h4 className="mb-3">Authentication Required</h4>
            <p className="text-muted mb-4">Please sign in to view call records.</p>
            <Link href="/auth/sign-in">
              <Button variant="primary" size="lg">Sign In</Button>
            </Link>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Customer Call Records</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Call Records</li>
              </ol>
            </div>

            {/* {realtimeConnected && (
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                style={{
                  background: '#E9F7EF',
                  border: '1.5px solid #B7E4C7',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <span
                  className="rounded-circle"
                  style={{
                    width: 8,
                    height: 8,
                    background: '#28a745',
                    animation: 'pulse 1.6s ease-in-out infinite'
                  }}
                />
                <span style={{ color: '#1e7e34' }}>Live Updates Active</span>
              </div>
            )} */}

            {realtimeConnected && (
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                style={{
                  background: '#E9F7EF',
                  border: '1.5px solid #B7E4C7',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <span
                  className="rounded-circle"
                  style={{
                    width: 8,
                    height: 8,
                    background: '#28a745',
                    animation: 'pulse 1.6s ease-in-out infinite'
                  }}
                />
                <span style={{ color: '#1e7e34' }}>Live Updates Active</span>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <DataTable
            id="call-records-table"
            title="Customer Call Records"
            description="Review and manage all customer calls with recordings and summaries"
            columns={dataTableColumns}
            data={filteredCallLogs}
            rowKey={(call) => call.id}
            loading={loading}
            error={error}
            onRetry={fetchCallLogs}
            rowClassName={(call) =>
              !call.view_status ? 'unread-call-row' : ''
            }

            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search by customer name, phone, email, or conversation details...',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              },
              filters: toolbarFilters,
              extra: showFilters ? (
                <div
                  className="position-relative d-flex location-dropdown-container flex-grow-1"
                  style={{ width: 350 }}
                >
                  <button
                    type="button"
                    className="btn shadow-sm border w-100 d-flex justify-content-between align-items-center"
                    style={{ borderRadius: '8px', padding: '0.625rem 1rem' }}
                    onClick={() => setLocationDropdownOpen((v) => !v)}
                  >
                    <span className="text-truncate d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:map-point-linear" width={18} height={18} />
                      {selectedLocationIds.length === 0
                        ? 'Filter by Store Location'
                        : `${selectedLocationIds.length} location${selectedLocationIds.length > 1 ? 's' : ''} selected`}
                    </span>

                    <div className="d-flex align-items-center gap-2">
                      {selectedLocationIds.length > 0 && (
                        <Badge bg="primary" pill>
                          {selectedLocationIds.length}
                        </Badge>
                      )}
                      <IconifyIcon
                        icon={
                          locationDropdownOpen
                            ? 'solar:alt-arrow-up-linear'
                            : 'solar:alt-arrow-down-linear'
                        }
                        width={16}
                        height={16}
                      />
                    </div>
                  </button>

                  {selectedLocationIds.length > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="position-absolute p-0 text-muted"
                      style={{
                        right: 42,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 5
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedLocationIds([])
                      }}
                      title="Clear location filters"
                    >
                      <IconifyIcon icon="solar:close-circle-linear" width={18} height={18} />
                    </Button>
                  )}

                  {locationDropdownOpen && (
                    <div
                      className="position-absolute w-100 mt-2 bg-white border rounded shadow-lg"
                      style={{
                        maxHeight: 360,
                        overflowY: 'auto',
                        zIndex: 1050,
                        top: '100%',
                        borderRadius: '8px'
                      }}
                    >
                      <div className="px-3 py-2 border-bottom bg-light">
                        <Form.Check
                          type="checkbox"
                          checked={selectedLocationIds.length === 0}
                          label={<strong>All Locations</strong>}
                          onChange={() => setSelectedLocationIds([])}
                        />
                      </div>

                      {loadingLocations && (
                        <div className="px-3 py-3 text-center">
                          <Spinner size="sm" className="me-2" />
                          <span className="text-muted small">Loading locations...</span>
                        </div>
                      )}

                      {!loadingLocations && locations.length === 0 && (
                        <div className="px-3 py-3 text-center text-muted small">
                          <IconifyIcon icon="solar:map-point-linear" width={24} height={24} className="mb-2" />
                          <div>No locations available</div>
                        </div>
                      )}

                      {!loadingLocations &&
                        locations.map((location) => {
                          const label = location.store_number
                            ? `Store #${location.store_number} – ${location.store_location}`
                            : location.store_location

                          return (
                            <div key={location.id} className="px-3 py-2 hover-bg-light">
                              <Form.Check
                                type="checkbox"
                                checked={selectedLocationIds.includes(location.id)}
                                onChange={() => handleLocationToggle(location.id)}
                                label={
                                  <span className="d-block text-truncate" title={label}>
                                    {label}
                                  </span>
                                }
                              />
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              ) : undefined
            }}
            columnPanel={{
              enableColumnVisibility: true,
              enableSticky: true,
              maxSticky: 4
            }}
            pagination={{
              currentPage,
              pageSize,
              totalRecords: total,
              totalPages,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [10, 25, 50],
              startRecord: startIndex + 1,
              endRecord: Math.min(startIndex + pageSize, total)
            }}
            emptyState={{
              title: 'No Call Records Found',
              description: debouncedSearch
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'There are no call records at this time. New calls will appear here automatically.'
            }}
          />
        </Col>
      </Row>

      {/* Call Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => {
          setShowDetailModal(false)
          setOpenedFromComplaints(false)
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Call Recording Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedCall && (
            <>
              {openedFromComplaints && (
                <div
                  className="alert d-flex align-items-center mb-4"
                  style={{
                    background: '#E3F2FD',
                    border: '1.5px solid #90CAF9',
                    borderRadius: '8px'
                  }}
                >
                  <IconifyIcon icon="solar:info-circle-bold" width={28} height={28} style={{ color: '#1976D2' }} className="me-3" />
                  <div className="flex-grow-1">
                    <strong style={{ color: '#1565C0' }}>Linked from Customer Complaint</strong>
                    <p className="mb-0 small text-muted mt-1">This call was referenced in a related complaint case</p>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleBackToComplaints}
                    style={{ borderRadius: '8px' }}
                  >
                    <IconifyIcon icon="solar:arrow-left-bold" width={16} height={16} className="me-2" />
                    Back to Complaints
                  </Button>
                </div>
              )}

              {/* Customer Info Card */}
              <Card className="mb-3 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:user-bold" width={20} height={20} className="text-primary" />
                    Customer Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <small className="text-muted d-block mb-1">Customer Name</small>
                      <strong>{selectedCall.caller.name}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block mb-1">Phone Number</small>
                      <strong>{selectedCall.caller.number}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block mb-1">Email Address</small>
                      <strong>{selectedCall.caller.email || 'Not provided'}</strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Store Info Card */}
              {(selectedCall.store_number || selectedCall.store_location) && (
                <Card className="mb-3 border-0 shadow-sm">
                  <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:shop-bold" width={20} height={20} className="text-primary" />
                      Store Location
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      {selectedCall.store_number && (
                        <Col md={6}>
                          <small className="text-muted d-block mb-1">Store Number</small>
                          <strong>#{selectedCall.store_number}</strong>
                        </Col>
                      )}
                      {selectedCall.store_location && (
                        <Col md={6}>
                          <small className="text-muted d-block mb-1">Location Name</small>
                          <Badge bg="secondary" className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                            {selectedCall.store_location}
                          </Badge>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* Call Details Card */}
              <Card className="mb-3 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:phone-bold" width={20} height={20} className="text-primary" />
                    Call Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <small className="text-muted d-block mb-1">Call Started</small>
                      <strong className="small">{formatDateTime(selectedCall.call_timing.started_at)}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block mb-1">Call Ended</small>
                      <strong className="small">{formatDateTime(selectedCall.call_timing.ended_at)}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block mb-1">Duration</small>
                      <Badge bg="info" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        <IconifyIcon icon="solar:clock-circle-bold" width={14} height={14} className="me-1" />
                        {calculateDuration(
                          selectedCall.call_timing.started_at,
                          selectedCall.call_timing.ended_at
                        )}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block mb-1">Call Outcome</small>
                      <Badge bg={selectedCall.call_success ? 'success' : 'danger'} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        <IconifyIcon
                          icon={selectedCall.call_success ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                          width={14}
                          height={14}
                          className="me-1"
                        />
                        {selectedCall.call_success ? 'Completed' : 'Incomplete'}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block mb-1">Review Status</small>
                      <Badge bg={selectedCall.view_status ? 'success' : 'warning'} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        <IconifyIcon
                          icon={selectedCall.view_status ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          width={14}
                          height={14}
                          className="me-1"
                        />
                        {selectedCall.view_status ? 'Reviewed' : 'Needs Review'}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Conversation Summary Card */}
              <Card className="mb-3 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:document-text-bold" width={20} height={20} className="text-primary" />
                    Conversation Summary
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-2">Quick Overview</small>
                    <p className="mb-0 p-3 bg-light rounded">{selectedCall.summaries.brief}</p>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-2">Full Details</small>
                    <p className="mb-0 p-3 bg-light rounded">{selectedCall.summaries.detailed}</p>
                  </div>
                </Card.Body>
              </Card>

              {/* Questions Asked Card */}
              {selectedCall?.questions_asked && selectedCall.questions_asked.length > 0 && (
                <Card className="mb-3 border-0 shadow-sm">
                  <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:chat-round-line-bold" width={20} height={20} className="text-primary" />
                      Customer Questions
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {selectedCall.questions_asked.map((question, idx) => (
                        <li key={idx} className="mb-2">
                          <strong>{question}</strong>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}

              {/* Action Flag Alert */}
              {selectedCall.action_flag && (
                <Card className="mb-3 border-danger shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                      <IconifyIcon icon="solar:danger-circle-bold" width={32} height={32} className="text-danger" />
                      <div>
                        <strong className="text-danger d-block mb-1" style={{ fontSize: '1.05rem' }}>Action Required</strong>
                        <p className="mb-0 small text-muted">This call needs immediate follow-up from management</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Recording Player */}
              {selectedCall.recording_link && (
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:music-library-2-bold" width={20} height={20} className="text-primary" />
                      Call Recording
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid">
                      <audio
                        controls
                        className="w-100"
                        src={selectedCall.recording_link}
                        onError={() => setAudioError('Unable to load audio recording')}
                        style={{ borderRadius: '8px' }}
                      >
                        Your browser does not support audio playback.
                      </audio>
                      {audioError && (
                        <div className="alert alert-danger mt-3 mb-0">
                          <small>
                            <IconifyIcon icon="solar:danger-circle-bold" width={16} height={16} className="me-2" />
                            <strong>Error:</strong> {audioError}
                          </small>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          {openedFromComplaints && (
            <Button
              variant="outline-primary"
              onClick={handleBackToComplaints}
              style={{ borderRadius: '8px' }}
            >
              <IconifyIcon icon="solar:arrow-left-bold" width={18} height={18} className="me-2" />
              Back to Complaints
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              setShowDetailModal(false)
              setOpenedFromComplaints(false)
            }}
            style={{ borderRadius: '8px' }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }

        /* 🔥 UNREAD ROW HIGHLIGHT */
        :global(.unread-call-row) {
          background-color: rgba(255, 193, 7, 0.08);
        }

        :global(.unread-call-row:hover) {
          background-color: rgba(255, 193, 7, 0.14);
        }

        :global(.unread-call-row td) {
          font-weight: 500;
        }
      `}</style>

    </>
  )
}

export default CallRecordsPage

export const dynamic = 'force-dynamic'