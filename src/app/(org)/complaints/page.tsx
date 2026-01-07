'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Card, Form, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/useAuthContext'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import { toast } from 'react-toastify'
import { complaintsApi, type Complaint, type ComplaintsListParams, type ComplaintSeverity, type ComplaintStatus } from '@/api/org/complaints'
import { callLogsApi, type CallLog } from '@/api/org/call-logs'
import { locationsApi, type Location } from '@/api/org/locations'
import { useFeatureGuard } from '@/hooks/useFeatureGuard'

const ComplaintsPage = () => {
  useFeatureGuard()
  const { token, isAuthenticated } = useAuth()
  const router = useRouter()

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Location state
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | ComplaintSeverity>('all')
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Call log modal state
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null)
  const [showCallLogModal, setShowCallLogModal] = useState(false)
  const [loadingCallLog, setLoadingCallLog] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

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
  }, [debouncedSearch, statusFilter, severityFilter, selectedLocationIds])

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
      console.log('Locations loaded:', response.locations)
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

  // Fetch complaints
  const fetchComplaints = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params: ComplaintsListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
      }

      if (debouncedSearch) {
        params.search = debouncedSearch
      }

      if (statusFilter !== 'all') {
        params.status_filter = statusFilter
      }

      if (severityFilter !== 'all') {
        params.severity_filter = severityFilter
      }

      if (selectedLocationIds.length > 0) {
        params.location_ids = selectedLocationIds
      }

      console.log('Fetching complaints with params:', params)

      const response = await complaintsApi.list(params)

      console.log('Complaints received:', response.complaints.length)

      setComplaints(response.complaints)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to fetch complaints')
      toast.error('Failed to load complaints')
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch, statusFilter, severityFilter, selectedLocationIds])

  useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Handle view details
  const handleViewDetails = useCallback((complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setShowDetailModal(true)
  }, [])

  // Handle view related call log
  const handleViewCallLog = useCallback(async (callLogId: string) => {
    if (!token || !isAuthenticated) return

    setLoadingCallLog(true)
    setAudioError(null)
    
    try {
      const callLog = await callLogsApi.getById(callLogId)
      setShowDetailModal(false)
      setSelectedCallLog(callLog)
      setShowCallLogModal(true)
      // Keep complaint modal open in background
    } catch (err: any) {
      toast.error('Failed to load call log details')
      console.error('Failed to fetch call log:', err)
    } finally {
      setLoadingCallLog(false)
    }
  }, [token, isAuthenticated])

  // Navigate to call records page with specific call log
  const handleNavigateToCallLog = useCallback((callLogId: string) => {
    // Close modals
    setShowDetailModal(false)
    setShowCallLogModal(false)
    
    // Navigate to call records page
    // The call records page will need to handle opening the modal via URL params or state
    router.push(`/call-records?openCallId=${callLogId}`)
  }, [router])

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

  // Calculate duration
  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    const durationMs = endTime - startTime
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  // Get severity badge color
  const getSeverityBadgeColor = (severity?: string): string => {
    switch (severity) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'open': return 'danger'
      case 'in_progress': return 'warning'
      case 'resolved': return 'success'
      case 'closed': return 'secondary'
      default: return 'secondary'
    }
  }

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
    setSeverityFilter('all')
    setSelectedLocationIds([])
    setCurrentPage(1)
  }

  // Check if filters are dirty
  const filtersDirty =
    statusFilter !== 'all' ||
    severityFilter !== 'all' ||
    selectedLocationIds.length > 0

  // Table columns
  const dataTableColumns: DataTableColumn<Complaint>[] = useMemo(
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
        key: 'customer',
        header: 'Customer',
        minWidth: 200,
        render: (complaint) => (
          <div>
            <div className="fw-semibold">{complaint.customer.customer_name || 'N/A'}</div>
            {complaint.customer.contact_phone && (
              <small className="text-muted d-block">{complaint.customer.contact_phone}</small>
            )}
            {complaint.customer.contact_email && (
              <small className="text-muted d-block">{complaint.customer.contact_email}</small>
            )}
          </div>
        )
      },
      {
        key: 'store_info',
        header: 'Store Info',
        minWidth: 150,
        render: (complaint) => (
          <div>
            {complaint.store.store_location && (
              <div className="small">
                <strong>{complaint.store.store_location}</strong>
              </div>
            )}
            {complaint.store.store_number && (
              <Badge bg="secondary" className="mt-1">
                Store #{complaint.store.store_number}
              </Badge>
            )}
            {!complaint.store.store_number && !complaint.store.store_location && (
              <span className="text-muted fst-italic">N/A</span>
            )}
          </div>
        )
      },
      {
        key: 'complaint_type',
        header: 'Type',
        minWidth: 150,
        render: (complaint) => (
          <div>
            <div className="small fw-semibold">{complaint.complaint_type || 'N/A'}</div>
            {complaint.receipt_status && (
              <Badge bg="info" className="mt-1">
                Receipt: {complaint.receipt_status}
              </Badge>
            )}
          </div>
        )
      },
      {
        key: 'description',
        header: 'Description',
        minWidth: 300,
        render: (complaint) => (
          <div
            className="text-truncate"
            style={{ maxWidth: '300px' }}
            title={complaint.complaint_description || ''}
          >
            {complaint.complaint_description || 'No description'}
          </div>
        )
      },
      {
        key: 'severity',
        header: 'Severity',
        width: 120,
        align: 'center',
        render: (complaint) => (
          <Badge bg={getSeverityBadgeColor(complaint.complaint_severity)}>
            {complaint.complaint_severity?.toUpperCase() || 'N/A'}
          </Badge>
        )
      },
      {
        key: 'status',
        header: 'Status',
        width: 120,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (complaint) => (
          <Badge bg={getStatusBadgeColor(complaint.status)}>
            {complaint.status.replace('_', ' ').toUpperCase()}
          </Badge>
        )
      },
      {
        key: 'escalation',
        header: 'Escalation',
        width: 120,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (complaint) => (
          <Badge bg={complaint.escalation.manager_callback_needed ? 'danger' : 'secondary'}>
            {complaint.escalation.manager_callback_needed ? 'Required' : 'None'}
          </Badge>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        minWidth: 180,
        render: (complaint) => (
          <div className="small">{formatDateTime(complaint.created_at)}</div>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 100,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (complaint) => (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewDetails(complaint)}
            title="View Details"
          >
            <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
          </Button>
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
        label: 'Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'All', value: '' },
          { label: 'Open', value: 'open' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Resolved', value: 'resolved' },
          { label: 'Closed', value: 'closed' }
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
        id: 'severity-filter',
        label: 'Severity',
        type: 'select',
        value: severityFilter === 'all' ? '' : severityFilter,
        options: [
          { label: 'All', value: '' },
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' }
        ],
        onChange: (value) => {
          setSeverityFilter((value || 'all') as any)
          setCurrentPage(1)
        },
        onClear: severityFilter !== 'all' ? () => {
          setSeverityFilter('all')
          setCurrentPage(1)
        } : undefined,
        width: 4
      }
    ],
    [statusFilter, severityFilter]
  )

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
            <p>Please sign in to view complaints.</p>
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
            <div>
              <h4 className="mb-2">Complaints</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Complaints</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="complaints-table"
            title="Complaints"
            description="Track and manage customer complaints with location filtering"
            columns={dataTableColumns}
            data={complaints}
            rowKey={(complaint) => complaint.id}
            loading={loading}
            error={error}
            onRetry={fetchComplaints}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search by customer name, phone, email, or description...',
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
                    className="btn shadow-sm border w-100 d-flex justify-content-between"
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
              title: 'No Complaints Found',
              description: debouncedSearch
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no complaints available at this time.'
            }}
          />
        </Col>
      </Row>

      {/* Complaint Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <>
              {/* Customer Info Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:user-linear" width={20} height={20} className="me-2" />
                    Customer Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <small className="text-muted d-block">Name</small>
                      <strong>{selectedComplaint.customer.customer_name || '—'}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Phone</small>
                      <strong>{selectedComplaint.customer.contact_phone || '—'}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Email</small>
                      <strong>{selectedComplaint.customer.contact_email || '—'}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Callback Confirmed</small>
                      <Badge bg={selectedComplaint.customer.callback_phone_confirmed ? 'success' : 'secondary'}>
                        {selectedComplaint.customer.callback_phone_confirmed ? 'Yes' : 'No'}
                      </Badge>
                    </Col>
                    {selectedComplaint.customer.mailing_address && (
                      <Col xs={12}>
                        <small className="text-muted d-block">Mailing Address</small>
                        <strong>{selectedComplaint.customer.mailing_address}</strong>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {/* Store Info Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:shop-linear" width={20} height={20} className="me-2" />
                    Store Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    {selectedComplaint.store.store_number && (
                      <Col md={6}>
                        <small className="text-muted d-block">Store Number</small>
                        <strong>#{selectedComplaint.store.store_number}</strong>
                      </Col>
                    )}
                    {selectedComplaint.store.store_location && (
                      <Col md={6}>
                        <small className="text-muted d-block">Location</small>
                        <Badge bg="secondary" className="px-2 py-1">
                          {selectedComplaint.store.store_location}
                        </Badge>
                      </Col>
                    )}
                    {selectedComplaint.store.store_phone && (
                      <Col md={6}>
                        <small className="text-muted d-block">Store Phone</small>
                        <strong>{selectedComplaint.store.store_phone}</strong>
                      </Col>
                    )}
                    {selectedComplaint.store.store_address && (
                      <Col md={6}>
                        <small className="text-muted d-block">Store Address</small>
                        <strong>{selectedComplaint.store.store_address}</strong>
                      </Col>
                    )}
                    {selectedComplaint.store.store_zip_code && (
                      <Col md={6}>
                        <small className="text-muted d-block">Zip Code</small>
                        <strong>{selectedComplaint.store.store_zip_code}</strong>
                      </Col>
                    )}
                    <Col md={6}>
                      <small className="text-muted d-block">Customer At Store</small>
                      <Badge bg={selectedComplaint.store.customer_at_store ? 'success' : 'secondary'}>
                        {selectedComplaint.store.customer_at_store ? 'Yes' : 'No'}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Complaint Details Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:document-text-linear" width={20} height={20} className="me-2" />
                    Complaint Details
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <small className="text-muted d-block">Type</small>
                      <strong>{selectedComplaint.complaint_type || 'N/A'}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Severity</small>
                      <Badge bg={getSeverityBadgeColor(selectedComplaint.complaint_severity)}>
                        {selectedComplaint.complaint_severity?.toUpperCase() || 'N/A'}
                      </Badge>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Receipt Status</small>
                      <strong>{selectedComplaint.receipt_status || 'N/A'}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Delivery Method</small>
                      <strong>{selectedComplaint.delivery_method || 'N/A'}</strong>
                    </Col>
                    <Col xs={12}>
                      <small className="text-muted d-block mb-1">Description</small>
                      <p className="mb-0">{selectedComplaint.complaint_description || 'No description provided'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Resolution Card */}
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:check-circle-linear" width={20} height={20} className="me-2" />
                    Resolution
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    {selectedComplaint.resolution.voucher_type && (
                      <Col md={6}>
                        <small className="text-muted d-block">Voucher Type</small>
                        <strong>{selectedComplaint.resolution.voucher_type}</strong>
                      </Col>
                    )}
                    {selectedComplaint.resolution.voucher_value && (
                      <Col md={6}>
                        <small className="text-muted d-block">Voucher Value</small>
                        <strong>{selectedComplaint.resolution.voucher_value}</strong>
                      </Col>
                    )}
                    <Col md={6}>
                      <small className="text-muted d-block">Immediate Replacement</small>
                      <Badge bg={selectedComplaint.resolution.immediate_replacement_offered ? 'success' : 'secondary'}>
                        {selectedComplaint.resolution.immediate_replacement_offered ? 'Offered' : 'Not Offered'}
                      </Badge>
                    </Col>
                    {selectedComplaint.resolution.replacement_details && (
                      <Col xs={12}>
                        <small className="text-muted d-block mb-1">Replacement Details</small>
                        <p className="mb-0">{selectedComplaint.resolution.replacement_details}</p>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {/* Escalation Card */}
              {selectedComplaint.escalation.manager_callback_needed && (
                <Card className="border-danger mb-3">
                  <Card.Header className="bg-danger bg-opacity-10">
                    <h6 className="mb-0 text-danger">
                      <IconifyIcon icon="solar:danger-circle-linear" width={20} height={20} className="me-2" />
                      Manager Escalation Required
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      {selectedComplaint.escalation.callback_timeline && (
                        <Col md={6}>
                          <small className="text-muted d-block">Callback Timeline</small>
                          <strong>{selectedComplaint.escalation.callback_timeline}</strong>
                        </Col>
                      )}
                      {selectedComplaint.escalation.callback_reasons && selectedComplaint.escalation.callback_reasons.length > 0 && (
                        <Col xs={12}>
                          <small className="text-muted d-block mb-1">Callback Reasons</small>
                          <ul className="mb-0">
                            {selectedComplaint.escalation.callback_reasons.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* Status & Metadata Card */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <IconifyIcon icon="solar:info-circle-linear" width={20} height={20} className="me-2" />
                    Status & Metadata
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <small className="text-muted d-block">Status</small>
                      <Badge bg={getStatusBadgeColor(selectedComplaint.status)}>
                        {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Created</small>
                      <strong className="small">{formatDateTime(selectedComplaint.created_at)}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Updated</small>
                      <strong className="small">{formatDateTime(selectedComplaint.updated_at)}</strong>
                    </Col>
                    <Col xs={12}>
                      <small className="text-muted d-block">Call Log ID</small>
                      <code className="small">{selectedComplaint.call_log_id}</code>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Call Log Link Button - Prominent at Top */}
              <Card className="mb-3 border-primary">
                <Card.Body className="d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h6 className="mb-1">
                      <IconifyIcon icon="solar:phone-calling-linear" width={20} height={20} className="me-2" />
                      Related Call Log
                    </h6>
                    <small className="text-muted">View the original call that generated this complaint</small>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleViewCallLog(selectedComplaint.call_log_id)}
                    disabled={loadingCallLog}
                  >
                    {loadingCallLog ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <IconifyIcon icon="solar:eye-linear" width={18} height={18} className="me-2" />
                        View Call Log
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Call Log Detail Modal */}
      <Modal
        show={showCallLogModal}
        onHide={() => setShowCallLogModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Call Log Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCallLog && (
            <>
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
                      <strong>{selectedCallLog.caller.name}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Phone</small>
                      <strong>{selectedCallLog.caller.number}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Email</small>
                      <strong>{selectedCallLog.caller.email || '—'}</strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Store Info Card */}
              {(selectedCallLog.store_number || selectedCallLog.store_location) && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <IconifyIcon icon="solar:shop-linear" width={20} height={20} className="me-2" />
                      Store Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      {selectedCallLog.store_number && (
                        <Col md={6}>
                          <small className="text-muted d-block">Store Number</small>
                          <strong>#{selectedCallLog.store_number}</strong>
                        </Col>
                      )}
                      {selectedCallLog.store_location && (
                        <Col md={6}>
                          <small className="text-muted d-block">Location</small>
                          <Badge bg="secondary" className="px-2 py-1">
                            {selectedCallLog.store_location}
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
                      <strong>{formatDateTime(selectedCallLog.call_timing.started_at)}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block">Ended At</small>
                      <strong>{formatDateTime(selectedCallLog.call_timing.ended_at)}</strong>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Duration</small>
                      <Badge bg="info">
                        {calculateDuration(
                          selectedCallLog.call_timing.started_at,
                          selectedCallLog.call_timing.ended_at
                        )}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Status</small>
                      <Badge bg={selectedCallLog.call_success ? 'success' : 'danger'}>
                        {selectedCallLog.call_success ? 'Success' : 'Failed'}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Read Status</small>
                      <Badge bg={selectedCallLog.view_status ? 'success' : 'warning'}>
                        {selectedCallLog.view_status ? 'Read' : 'Unread'}
                      </Badge>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col xs={12}>
                      <small className="text-muted d-block">Conversation ID</small>
                      <code className="small">{selectedCallLog.conversation_id}</code>
                    </Col>
                    <Col xs={12}>
                      <small className="text-muted d-block">Agent ID</small>
                      <code className="small">{selectedCallLog.agent_id}</code>
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
                    <p className="mb-0">{selectedCallLog.summaries.brief}</p>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-1">Detailed Summary</small>
                    <p className="mb-0">{selectedCallLog.summaries.detailed}</p>
                  </div>
                </Card.Body>
              </Card>

              {/* Questions Asked Card */}
              {selectedCallLog?.questions_asked && selectedCallLog.questions_asked.length > 0 && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <IconifyIcon icon="solar:chat-round-line-linear" width={20} height={20} className="me-2" />
                      Questions Asked During Call
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {selectedCallLog.questions_asked.map((question, idx) => (
                        <li key={idx}>{question}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}

              {/* Action Flag */}
              {selectedCallLog.action_flag && (
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
              {selectedCallLog.recording_link && (
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
                        src={selectedCallLog.recording_link}
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
          <Button 
            variant="secondary" 
            onClick={() => setShowCallLogModal(false)}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleNavigateToCallLog(selectedCallLog!.id)}
          >
            <IconifyIcon icon="solar:arrow-right-linear" width={18} height={18} className="me-2" />
            Go to Call Records Page
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  )
}

export default ComplaintsPage