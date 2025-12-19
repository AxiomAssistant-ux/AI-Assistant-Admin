'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

type Appointment = {
  _id: string
  org_id: string
  call_id?: string | null
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  scheduled_at: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    _id: 'appt_001',
    org_id: 'org_001',
    call_id: 'call_abc123',
    customer_name: 'John Doe',
    customer_phone: '+1-555-0101',
    customer_email: 'john.doe@email.com',
    scheduled_at: '2024-12-25T10:00:00Z',
    status: 'scheduled',
    created_at: '2024-12-18T09:30:00Z',
    updated_at: '2024-12-18T09:30:00Z'
  },
  {
    _id: 'appt_002',
    org_id: 'org_001',
    call_id: 'call_def456',
    customer_name: 'Sarah Johnson',
    customer_phone: '+1-555-0102',
    customer_email: 'sarah.j@email.com',
    scheduled_at: '2024-12-24T14:30:00Z',
    status: 'scheduled',
    created_at: '2024-12-17T11:15:00Z',
    updated_at: '2024-12-18T08:20:00Z'
  },
  {
    _id: 'appt_003',
    org_id: 'org_001',
    call_id: null,
    customer_name: 'Michael Chen',
    customer_phone: '+1-555-0103',
    customer_email: null,
    scheduled_at: '2024-12-19T16:00:00Z',
    status: 'completed',
    created_at: '2024-12-16T14:30:00Z',
    updated_at: '2024-12-19T16:45:00Z'
  },
  {
    _id: 'appt_004',
    org_id: 'org_002',
    call_id: 'call_ghi789',
    customer_name: 'Emma Rodriguez',
    customer_phone: '+1-555-0104',
    customer_email: 'emma.r@email.com',
    scheduled_at: '2024-12-20T09:00:00Z',
    status: 'cancelled',
    created_at: '2024-12-18T15:20:00Z',
    updated_at: '2024-12-19T10:00:00Z'
  },
  {
    _id: 'appt_005',
    org_id: 'org_001',
    call_id: 'call_jkl012',
    customer_name: 'David Wilson',
    customer_phone: '+1-555-0105',
    customer_email: 'david.wilson@email.com',
    scheduled_at: '2024-12-26T11:00:00Z',
    status: 'scheduled',
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z'
  },
  {
    _id: 'appt_006',
    org_id: 'org_001',
    call_id: 'call_mno345',
    customer_name: 'Lisa Thompson',
    customer_phone: '+1-555-0106',
    customer_email: 'lisa.t@email.com',
    scheduled_at: '2024-12-23T15:30:00Z',
    status: 'completed',
    created_at: '2024-12-14T09:00:00Z',
    updated_at: '2024-12-23T16:00:00Z'
  }
]

const AppointmentsPage = () => {
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [updatingField, setUpdatingField] = useState<{ apptId: string; field: string } | null>(null)

  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [scheduleValue, setScheduleValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter])

  const fetchAppointments = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setAppointments(MOCK_APPOINTMENTS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load appointments.')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesSearch =
        !debouncedSearch ||
        appt.customer_name.toLowerCase().includes(debouncedSearch) ||
        appt.customer_phone.toLowerCase().includes(debouncedSearch) ||
        (appt.customer_email ?? '').toLowerCase().includes(debouncedSearch)

      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [appointments, debouncedSearch, statusFilter])

  const totalRecords = filteredAppointments.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusToggle = async (apptId: string, currentStatus: Appointment['status']) => {
    const statusFlow: Record<Appointment['status'], Appointment['status']> = {
      scheduled: 'completed',
      completed: 'cancelled',
      cancelled: 'scheduled'
    }
    const newStatus = statusFlow[currentStatus]

    setUpdatingField({ apptId, field: 'status' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAppointments(prev => prev.map(appt =>
        appt._id === apptId ? { ...appt, status: newStatus, updated_at: new Date().toISOString() } : appt
      ))
      
      if (selectedAppointment && selectedAppointment._id === apptId) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus, updated_at: new Date().toISOString() })
      }
      
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleScheduleSave = async (apptId: string) => {
    if (!scheduleValue) {
      setEditingSchedule(null)
      return
    }

    setUpdatingField({ apptId, field: 'scheduled_at' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newSchedule = new Date(scheduleValue).toISOString()
      
      setAppointments(prev => prev.map(appt =>
        appt._id === apptId ? { ...appt, scheduled_at: newSchedule, updated_at: new Date().toISOString() } : appt
      ))
      
      if (selectedAppointment && selectedAppointment._id === apptId) {
        setSelectedAppointment({ ...selectedAppointment, scheduled_at: newSchedule, updated_at: new Date().toISOString() })
      }
      
      toast.success('Schedule updated successfully')
      setEditingSchedule(null)
    } catch (err) {
      toast.error('Failed to update schedule')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleViewAppointment = (appt: Appointment) => {
    setSelectedAppointment(appt)
    setViewModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  const formatDateInput = (dateString: string) => {
    return dateString.slice(0, 16)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary'
      case 'completed': return 'success'
      case 'cancelled': return 'danger'
      default: return 'secondary'
    }
  }

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'status-filter',
        label: 'Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'All statuses', value: '' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' }
        ],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 4
      }
    ],
    [statusFilter]
  )

  const columns: DataTableColumn<Appointment>[] = useMemo(
    () => [
      {
        key: 'serial',
        header: '#',
        width: 60,
        render: (_, { rowIndex }) => <span className="text-muted">{startIndex + rowIndex + 1}</span>
      },
      {
        key: 'customer',
        header: 'Customer',
        minWidth: 220,
        render: (appt) => (
          <div>
            <div className="fw-semibold">{appt.customer_name}</div>
            <div className="text-muted small">{appt.customer_phone}</div>
            {appt.customer_email && (
              <div className="text-muted small">{appt.customer_email}</div>
            )}
          </div>
        )
      },
      {
        key: 'scheduled_at',
        header: 'Scheduled Time',
        width: 180,
        render: (appt) => formatDate(appt.scheduled_at)
      },
      {
        key: 'status',
        header: 'Status',
        width: 150,
        render: (appt) => (
          <div
            onClick={() => updatingField?.apptId !== appt._id && handleStatusToggle(appt._id, appt.status)}
            style={{ cursor: updatingField?.apptId === appt._id ? 'not-allowed' : 'pointer' }}
            title="Click to cycle status"
          >
            <Badge
              bg={getStatusVariant(appt.status)}
              className="text-capitalize d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.apptId === appt._id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.apptId === appt._id && updatingField.field === 'status' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Updating...
                </>
              ) : (
                <>
                  {appt.status}
                  <IconifyIcon icon="solar:alt-arrow-right-linear" width={12} height={12} />
                </>
              )}
            </Badge>
          </div>
        )
      },
      {
        key: 'call_id',
        header: 'Call ID',
        width: 160,
        render: (appt) => (
          <span className="font-monospace small">{appt.call_id || '—'}</span>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        width: 160,
        render: (appt) => formatDate(appt.created_at)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 100,
        align: 'center',
        sticky: 'right',
        render: (appt) => (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleViewAppointment(appt)}
            title="View details"
          >
            <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
          </Button>
        )
      }
    ],
    [updatingField, startIndex]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Appointments</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Appointments</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="appointments-table"
            title="All Appointments"
            description="Manage customer appointments scheduled through calls or manually."
            columns={columns}
            data={paginatedAppointments}
            rowKey={(appt) => appt._id}
            loading={loading}
            error={error}
            onRetry={fetchAppointments}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search by customer name, phone, or email...'
              },
              filters: toolbarFilters
            }}
            pagination={{
              currentPage,
              pageSize,
              totalRecords,
              totalPages,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [10, 25, 50],
              startRecord: startIndex + 1,
              endRecord: Math.min(startIndex + pageSize, totalRecords)
            }}
            emptyState={{
              title: 'No appointments found',
              description: 'Appointments will appear here as they are scheduled.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Appointment ID</label>
                  <div className="fw-medium font-monospace small">{selectedAppointment._id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Call ID</label>
                  <div className="fw-medium font-monospace small">{selectedAppointment.call_id || '—'}</div>
                </Col>
                <Col md={12}>
                  <label className="text-muted small">Status</label>
                  <div>
                    <div
                      onClick={() => handleStatusToggle(selectedAppointment._id, selectedAppointment.status)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to cycle status"
                    >
                      <Badge
                        bg={getStatusVariant(selectedAppointment.status)}
                        className="text-capitalize d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.apptId === selectedAppointment._id && updatingField.field === 'status' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {selectedAppointment.status}
                            <IconifyIcon icon="solar:alt-arrow-right-linear" width={12} height={12} />
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <label className="text-muted small d-flex align-items-center justify-content-between">
                    <span>Scheduled Time</span>
                    {!editingSchedule && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => {
                          setEditingSchedule(selectedAppointment._id)
                          setScheduleValue(formatDateInput(selectedAppointment.scheduled_at))
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingSchedule === selectedAppointment._id ? (
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="datetime-local"
                        size="sm"
                        value={scheduleValue}
                        onChange={(e) => setScheduleValue(e.target.value)}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleScheduleSave(selectedAppointment._id)}
                        disabled={updatingField?.apptId === selectedAppointment._id}
                      >
                        {updatingField?.apptId === selectedAppointment._id && updatingField.field === 'scheduled_at' ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <IconifyIcon icon="solar:check-circle-linear" width={16} height={16} />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingSchedule(null)}
                      >
                        <IconifyIcon icon="solar:close-circle-linear" width={16} height={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="fw-medium">{formatDate(selectedAppointment.scheduled_at)}</div>
                  )}
                </Col>
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Customer Information</label>
                <div className="mt-2">
                  <div className="fw-semibold fs-5">{selectedAppointment.customer_name}</div>
                  <div className="text-muted">
                    <IconifyIcon icon="solar:phone-linear" width={16} height={16} className="me-1" />
                    {selectedAppointment.customer_phone}
                  </div>
                  {selectedAppointment.customer_email && (
                    <div className="text-muted">
                      <IconifyIcon icon="solar:letter-linear" width={16} height={16} className="me-1" />
                      {selectedAppointment.customer_email}
                    </div>
                  )}
                </div>
              </div>
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Created At</label>
                  <div>{formatDate(selectedAppointment.created_at)}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedAppointment.updated_at)}</div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AppointmentsPage