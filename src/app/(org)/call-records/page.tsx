'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Row, Col, Button, Badge, Modal, Card, Form, Spinner } from 'react-bootstrap'
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
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { useCallLogUpdates } from '@/hooks/useCallLogUpdates'
import { useRealtime } from '@/context/RealtimeContext'

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

  // Location state
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [successFilter, setSuccessFilter] = useState<'all' | 'success' | 'failed'>('all')
  const [actionFilter, setActionFilter] = useState<'all' | 'action' | 'no_action'>('all')
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // Track if modal was opened from complaints page
  const [hasAutoOpened, setHasAutoOpened] = useState(false)
  const [openedFromComplaints, setOpenedFromComplaints] = useState(false)

  // const { isConnected: realtimeConnected } = useRealtime()
  // useCallLogUpdates({
  //   onCallLogCreated: handleCallLogCreated
  // })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase())
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, successFilter, actionFilter, selectedLocationIds])

  // Close dropdown when clicking outside
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

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    if (!token || !isAuthenticated) return

    setLoadingLocations(true)
    try {
      const response = await locationsApi.list({ skip: 0, limit: 500 })
      console.log('=== ALL LOCATIONS ===')
      console.log('Locations loaded:', response.locations)
      console.log('====================')
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

  // Fetch call logs
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

      // Send selected location IDs for multi-select filtering
      if (selectedLocationIds.length > 0) {
        params.location_ids = selectedLocationIds
      }

      // DEBUG: Log what we're sending
      console.log('=== CALL LOGS REQUEST ===')
      console.log('Selected Location IDs:', selectedLocationIds)
      console.log('Params being sent:', params)
      console.log('========================')

      const response = await callLogsApi.list(params)

      // DEBUG: Log what we received
      console.log('=== CALL LOGS RESPONSE ===')
      console.log('Total returned:', response.total)
      console.log('Call logs count:', response.call_logs.length)
      console.log('First call log:', response.call_logs[0])
      console.log('=========================')

      setCallLogs(response.call_logs)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to fetch call logs')
      toast.error('Failed to load call logs')
      setCallLogs([])
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch, selectedLocationIds])

  useEffect(() => {
    fetchCallLogs()
  }, [fetchCallLogs])

  const handleCallLogCreated = useCallback((data: any) => {
    console.log('📞 New call log created:', data)

    // CRITICAL FIX: Prevent duplicate toasts using conversation_id
    const notificationKey = `call_${data.conversation_id || data.id}`

    if (shownNotifications.current.has(notificationKey)) {
      console.log('Skipping duplicate notification for', notificationKey)
      return
    }

    // Mark as shown
    shownNotifications.current.add(notificationKey)

    // Clean up old notifications after 30 seconds
    setTimeout(() => {
      shownNotifications.current.delete(notificationKey)
    }, 30000)

    // Show toast notification with caller info
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
        toastId: notificationKey // CRITICAL: Prevents duplicate toasts with same ID
      }
    )

    // Refresh call logs to show new data
    fetchCallLogs()
  }, [fetchCallLogs]);
  
  // ===== REAL-TIME UPDATES =====
  // const { isConnected: realtimeConnected } = useRealtimeUpdates({
  //   onCallLogCreated: handleCallLogCreated,
  //   onConnect: useCallback(() => console.log('✅ Real-time updates connected'), []),
  //   onDisconnect: useCallback(() => console.log('❌ Real-time updates disconnected'), [])
  // })

  const { isConnected: realtimeConnected } = useRealtimeUpdates({
    onCallLogCreated: handleCallLogCreated,
    onActiveCallsUpdated: (data) => {
      console.log('📞 Active calls updated on page:', data)
      // Badge will automatically update via custom event
    },
    onConnect: () => console.log('✅ Real-time updates connected'),
    onDisconnect: () => console.log('❌ Real-time updates disconnected')
  })

  // Handle opening specific call log from URL parameter
  useEffect(() => {
    const loadSpecificCallLog = async () => {
      // Only auto-open once, and only if we haven't already opened it
      if (openCallId && token && isAuthenticated && !hasAutoOpened) {
        console.log('=== AUTO-OPENING CALL LOG ===')
        console.log('Call ID from URL:', openCallId)

        setHasAutoOpened(true) // Mark as opened immediately to prevent re-triggers
        setOpenedFromComplaints(true) // Mark that it was opened from complaints

        try {
          // Fetch the specific call log
          const callLog = await callLogsApi.getById(openCallId)
          console.log('Fetched call log:', callLog)

          // Open the modal
          setSelectedCall(callLog)
          setShowDetailModal(true)
          setAudioError(null)

          // Clean up URL by removing the parameter
          router.replace('/call-records', { scroll: false })

          toast.success('Call log loaded successfully')
        } catch (err: any) {
          console.error('Failed to load call log:', err)
          toast.error('Failed to load the requested call log')

          // Still clean up URL even on error
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

  // Handle view details
  const handleViewDetails = useCallback((call: CallLog) => {
    setSelectedCall(call)
    setShowDetailModal(true)
    setAudioError(null)
    // Don't set openedFromComplaints for regular opens
  }, [])

  // Handle back to complaints
  const handleBackToComplaints = useCallback(() => {
    router.push('/complaints')
  }, [router])

  // Calculate duration
  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    const durationMs = endTime - startTime
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  // Format datetime
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Frontend filtering (in addition to backend filtering)
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

      const matchesAction =
        actionFilter === 'all' ||
        (actionFilter === 'action' && call.action_flag) ||
        (actionFilter === 'no_action' && !call.action_flag)

      return matchesStatus && matchesSuccess && matchesAction
    })
  }, [callLogs, statusFilter, successFilter, actionFilter])

  // Handle location checkbox toggle
  const handleLocationToggle = (locationId: string) => {
    setSelectedLocationIds(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId)
      } else {
        return [...prev, locationId]
      }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all')
    setSuccessFilter('all')
    setActionFilter('all')
    setSelectedLocationIds([])
    setCurrentPage(1)
  }

  // Check if filters are dirty
  const filtersDirty =
    statusFilter !== 'all' ||
    successFilter !== 'all' ||
    actionFilter !== 'all' ||
    selectedLocationIds.length > 0

  // Table columns
  const dataTableColumns: DataTableColumn<CallLog>[] = useMemo(
    () => [
      {
        key: 'rowNumber',
        header: '#',
        width: 60,
        align: 'center',
        render: (_, { rowIndex }) => (
          <span className="text-muted">{startIndex + rowIndex + 1}</span>
        )
      },
      {
        key: 'caller',
        header: 'Caller',
        minWidth: 200,
        render: (call) => (
          <div>
            <div className="fw-semibold">{call.caller.name}</div>
            <small className="text-muted d-block">{call.caller.number}</small>
            {call.caller.email && (
              <small className="text-muted d-block">{call.caller.email}</small>
            )}
          </div>
        )
      },
      {
        key: 'store_info',
        header: 'Store Info',
        minWidth: 150,
        render: (call) => (
          <div>
            {call.store_location && (
              <div className="small">
                <strong>{call.store_location}</strong>
              </div>
            )}
            {call.store_number && (
              <Badge bg="secondary" className="mt-1">
                Store #{call.store_number}
              </Badge>
            )}
            {!call.store_number && !call.store_location && (
              <span className="text-muted fst-italic">N/A</span>
            )}
          </div>
        )
      },
      {
        key: 'timing',
        header: 'Call Time',
        minWidth: 180,
        render: (call) => (
          <div>
            <div className="small">{formatDateTime(call.call_timing.started_at)}</div>
            <Badge bg="info" className="mt-1">
              {calculateDuration(call.call_timing.started_at, call.call_timing.ended_at)}
            </Badge>
          </div>
        )
      },
      {
        key: 'summary',
        header: 'Summary',
        minWidth: 300,
        render: (call) => (
          <div
            className="text-truncate"
            style={{ maxWidth: '300px' }}
            title={call.summaries.brief}
          >
            {call.summaries.brief}
          </div>
        )
      },
      {
        key: 'success',
        header: 'Status',
        width: 100,
        align: 'center',
        render: (call) => (
          <Badge bg={call.call_success ? 'success' : 'danger'}>
            {call.call_success ? 'Success' : 'Failed'}
          </Badge>
        )
      },
      {
        key: 'view_status',
        header: 'Read',
        width: 100,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (call) => (
          <Badge bg={call.view_status ? 'success' : 'warning'}>
            {call.view_status ? 'Read' : 'Unread'}
          </Badge>
        )
      },
      {
        key: 'action_flag',
        header: 'Action',
        width: 100,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (call) => (
          <Badge bg={call.action_flag ? 'danger' : 'secondary'}>
            {call.action_flag ? 'Required' : 'None'}
          </Badge>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 150,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (call) => (
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleViewDetails(call)}
              title="View Details"
            >
              <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
            </Button>
            {call.recording_link && (
              <Button
                variant="outline-success"
                size="sm"
                href={call.recording_link}
                target="_blank"
                rel="noopener noreferrer"
                title="Play Recording"
              >
                <IconifyIcon icon="solar:play-linear" width={16} height={16} />
              </Button>
            )}
          </div>
        )
      }
    ],
    [startIndex, handleViewDetails]
  )

  // Toolbar filters
  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'status-filter',
        label: 'Read Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'All', value: '' },
          { label: 'Read', value: 'read' },
          { label: 'Unread', value: 'unread' }
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
        label: 'Call Status',
        type: 'select',
        value: successFilter === 'all' ? '' : successFilter,
        options: [
          { label: 'All', value: '' },
          { label: 'Success', value: 'success' },
          { label: 'Failed', value: 'failed' }
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
    [statusFilter, successFilter, actionFilter]
  )

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
            <p>Please sign in to view call records.</p>
            <Link href="/auth/sign-in">
              <Button variant="primary">Sign In</Button>
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
            {/* <div className="d-flex align-items-center gap-3"> */}
            <div>
              <h4 className="mb-2">Call Records</h4>
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

            {/* Real-time connection indicator */}
            {realtimeConnected && (
              <Badge bg="success" className="d-flex gap-1 px-3 py-2">
                <span
                  className="rounded-circle bg-white"
                  style={{
                    width: 6,
                    height: 6,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <span className="fw-semibold">Live Updates</span>
              </Badge>
            )}
            {/* </div> */}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="call-records-table"
            title="Calls"
            description="Track and manage all call logs"
            columns={dataTableColumns}
            data={filteredCallLogs}
            rowKey={(call) => call.id}
            loading={loading}
            error={error}
            onRetry={fetchCallLogs}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search by name, email, phone, or conversation ID...',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              },
              filters: toolbarFilters,
              extra: showFilters ? (
                <div
                  className="position-relative d-flex location-dropdown-container flex-grow-1"
                  style={{ width: 350 }}
                >
                  {/* Trigger */}
                  <button
                    type="button"
                    className="btn shadow-sm border w-100 d-flex justify-content-between "
                    onClick={() => setLocationDropdownOpen((v) => !v)}
                  >
                    <span className="text-truncate">
                      {selectedLocationIds.length === 0
                        ? 'All Locations'
                        : `${selectedLocationIds.length} selected`}
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

                  {/* Clear */}
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
                      title="Clear locations"
                    >
                      <IconifyIcon icon="solar:close-circle-linear" width={18} height={18} />
                    </Button>
                  )}

                  {/* Dropdown */}
                  {locationDropdownOpen && (
                    <div
                      className="position-absolute w-100 mt-2 bg-white border rounded shadow"
                      style={{ maxHeight: 360, overflowY: 'auto', zIndex: 1050, top: '100%' }}
                    >
                      {/* All */}
                      <div className="px-3 py-2 border-bottom">
                        <Form.Check
                          type="checkbox"
                          checked={selectedLocationIds.length === 0}
                          label={<strong>All Locations</strong>}
                          onChange={() => setSelectedLocationIds([])}
                        />
                      </div>

                      {/* Loading */}
                      {loadingLocations && (
                        <div className="px-3 py-3 text-center">
                          <Spinner size="sm" />
                        </div>
                      )}

                      {/* Empty */}
                      {!loadingLocations && locations.length === 0 && (
                        <div className="px-3 py-2 text-muted small">
                          No locations available
                        </div>
                      )}

                      {/* Locations */}
                      {!loadingLocations &&
                        locations.map((location) => {
                          const label = location.store_number
                            ? `Store #${location.store_number} – ${location.store_location}`
                            : location.store_location

                          return (
                            <div key={location.id} className="px-3 py-2">
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
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no call records available at this time.'
            }}
          />
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => {
          setShowDetailModal(false)
          setOpenedFromComplaints(false) // Reset flag when closing
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Call Record Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCall && (
            <>
              {/* Info badge if opened from complaint */}
              {openedFromComplaints && (
                <div className="alert alert-info d-flex align-items-center mb-3">
                  <IconifyIcon icon="solar:info-circle-linear" width={24} height={24} className="me-2" />
                  <div className="flex-grow-1">
                    <strong>Opened from Complaint</strong>
                    <p className="mb-0 small">This call log was referenced in a customer complaint</p>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleBackToComplaints}
                    className="ms-3"
                  >
                    <IconifyIcon icon="solar:arrow-left-linear" width={16} height={16} className="me-1" />
                    Back to Complaints
                  </Button>
                </div>
              )}

              {/* Caller Info Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:user-linear" width={20} height={20} className="me-2" />
                    Caller Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <small className="text-muted d-block">Name</small>
                      <strong>{selectedCall.caller.name}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Phone</small>
                      <strong>{selectedCall.caller.number}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Email</small>
                      <strong>{selectedCall.caller.email || '—'}</strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Store Info Card */}
              {(selectedCall.store_number || selectedCall.store_location) && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <IconifyIcon icon="solar:shop-linear" width={20} height={20} className="me-2" />
                      Store Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      {selectedCall.store_number && (
                        <Col md={6}>
                          <small className="text-muted d-block">Store Number</small>
                          <strong>#{selectedCall.store_number}</strong>
                        </Col>
                      )}
                      {selectedCall.store_location && (
                        <Col md={6}>
                          <small className="text-muted d-block">Location</small>
                          <Badge bg="secondary" className="px-2 py-1">
                            {selectedCall.store_location}
                          </Badge>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* Call Details Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:phone-linear" width={20} height={20} className="me-2" />
                    Call Details
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <small className="text-muted d-block">Started At</small>
                      <strong>{formatDateTime(selectedCall.call_timing.started_at)}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Ended At</small>
                      <strong>{formatDateTime(selectedCall.call_timing.ended_at)}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Duration</small>
                      <Badge bg="info">
                        {calculateDuration(
                          selectedCall.call_timing.started_at,
                          selectedCall.call_timing.ended_at
                        )}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Status</small>
                      <Badge bg={selectedCall.call_success ? 'success' : 'danger'}>
                        {selectedCall.call_success ? 'Success' : 'Failed'}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Read Status</small>
                      <Badge bg={selectedCall.view_status ? 'success' : 'warning'}>
                        {selectedCall.view_status ? 'Read' : 'Unread'}
                      </Badge>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col xs={12}>
                      <small className="text-muted d-block">Conversation ID</small>
                      <code className="small">{selectedCall.conversation_id}</code>
                    </Col>
                    <Col xs={12}>
                      <small className="text-muted d-block">Agent ID</small>
                      <code className="small">{selectedCall.agent_id}</code>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Summaries Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:document-text-linear" width={20} height={20} className="me-2" />
                    Call Summary
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Brief Summary</small>
                    <p className="mb-0">{selectedCall.summaries.brief}</p>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-1">Detailed Summary</small>
                    <p className="mb-0">{selectedCall.summaries.detailed}</p>
                  </div>
                </Card.Body>
              </Card>

              {/* Questions Asked Card */}
              {selectedCall?.questions_asked && selectedCall.questions_asked.length > 0 && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <IconifyIcon icon="solar:chat-round-line-linear" width={20} height={20} className="me-2" />
                      Questions Asked During Call
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {selectedCall.questions_asked.map((question, idx) => (
                        <li key={idx}>{question}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}

              {/* Action Flag */}
              {selectedCall.action_flag && (
                <Card className="border-danger mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:danger-circle-linear" width={24} height={24} className="text-danger" />
                      <div>
                        <strong className="text-danger">Action Required</strong>
                        <p className="mb-0 small text-muted">This call requires follow-up action</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Recording Player */}
              {selectedCall.recording_link && (
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <IconifyIcon icon="solar:music-library-2-linear" width={20} height={20} className="me-2" />
                      Call Recording
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid">
                      <audio
                        controls
                        className="w-100"
                        src={selectedCall.recording_link}
                        onError={() => setAudioError('Failed to load audio')}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      {audioError && (
                        <div className="alert alert-danger mt-2 mb-0">
                          <small>{audioError}</small>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {openedFromComplaints && (
            <Button
              variant="outline-primary"
              onClick={handleBackToComplaints}
            >
              <IconifyIcon icon="solar:arrow-left-linear" width={18} height={18} className="me-2" />
              Back to Complaints
            </Button>
          )}
          <Button variant="secondary" onClick={() => {
            setShowDetailModal(false)
            setOpenedFromComplaints(false)
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />

      {/* Add CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  )
}

export default CallRecordsPage