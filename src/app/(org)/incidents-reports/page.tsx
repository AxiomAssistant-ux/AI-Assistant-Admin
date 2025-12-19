'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

type Incident = {
  _id: string
  org_id: string
  call_id?: string | null
  title: string
  description?: string | null
  urgency: boolean
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  reported_by?: string | null
  resolved_at?: string | null
  created_at: string
  updated_at: string
}

const MOCK_INCIDENTS: Incident[] = [
  {
    _id: 'inc_001',
    org_id: 'org_001',
    call_id: 'call_abc123',
    title: 'Equipment malfunction in Room 3',
    description: 'Dental chair not functioning properly, motor making unusual noise',
    urgency: true,
    status: 'in_progress',
    assigned_to_user_id: 'user_001',
    assigned_role: 'maintenance',
    reported_by: 'Dr. Sarah Johnson',
    resolved_at: null,
    created_at: '2024-12-18T09:30:00Z',
    updated_at: '2024-12-18T10:15:00Z'
  },
  {
    _id: 'inc_002',
    org_id: 'org_002',
    call_id: 'call_def456',
    title: 'Safety hazard - Wet floor in kitchen area',
    description: 'Water leak from dishwasher causing slippery surface',
    urgency: true,
    status: 'pending',
    assigned_to_user_id: 'user_002',
    assigned_role: 'facilities',
    reported_by: 'Chef Michael',
    resolved_at: null,
    created_at: '2024-12-18T11:15:00Z',
    updated_at: '2024-12-18T11:15:00Z'
  },
  {
    _id: 'inc_003',
    org_id: 'org_001',
    call_id: null,
    title: 'AC unit not cooling properly',
    description: 'Reception area temperature too high, AC making strange sounds',
    urgency: false,
    status: 'completed',
    assigned_to_user_id: 'user_003',
    assigned_role: 'maintenance',
    reported_by: 'Receptionist Amy',
    resolved_at: '2024-12-18T16:30:00Z',
    created_at: '2024-12-17T14:30:00Z',
    updated_at: '2024-12-18T16:30:00Z'
  },
  {
    _id: 'inc_004',
    org_id: 'org_003',
    call_id: 'call_ghi789',
    title: 'Broken chair in waiting room',
    description: 'Chair leg broken, potential injury risk for patients',
    urgency: true,
    status: 'in_progress',
    assigned_to_user_id: null,
    assigned_role: 'facilities',
    reported_by: 'Nurse Linda',
    resolved_at: null,
    created_at: '2024-12-18T15:20:00Z',
    updated_at: '2024-12-18T15:45:00Z'
  },
  {
    _id: 'inc_005',
    org_id: 'org_001',
    call_id: 'call_jkl012',
    title: 'Computer system slow performance',
    description: 'Appointment booking system taking too long to load',
    urgency: false,
    status: 'pending',
    assigned_to_user_id: 'user_001',
    assigned_role: 'IT support',
    reported_by: 'Admin staff',
    resolved_at: null,
    created_at: '2024-12-17T10:00:00Z',
    updated_at: '2024-12-17T10:00:00Z'
  },
  {
    _id: 'inc_006',
    org_id: 'org_002',
    call_id: null,
    title: 'Fire alarm system malfunction',
    description: 'False alarms triggering every hour, needs inspection',
    urgency: true,
    status: 'in_progress',
    assigned_to_user_id: 'user_004',
    assigned_role: 'building management',
    reported_by: 'Security',
    resolved_at: null,
    created_at: '2024-12-18T08:00:00Z',
    updated_at: '2024-12-18T09:30:00Z'
  }
]

const IncidentsPage = () => {
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [updatingField, setUpdatingField] = useState<{ incidentId: string; field: string } | null>(null)

  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [roleValue, setRoleValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, urgencyFilter])

  const fetchIncidents = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setIncidents(MOCK_INCIDENTS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load incidents.')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        !debouncedSearch ||
        incident.title.toLowerCase().includes(debouncedSearch) ||
        (incident.description ?? '').toLowerCase().includes(debouncedSearch) ||
        (incident.reported_by ?? '').toLowerCase().includes(debouncedSearch)

      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
      const matchesUrgency = 
        urgencyFilter === 'all' || 
        (urgencyFilter === 'urgent' && incident.urgency) ||
        (urgencyFilter === 'normal' && !incident.urgency)

      return matchesSearch && matchesStatus && matchesUrgency
    })
  }, [incidents, debouncedSearch, statusFilter, urgencyFilter])

  const totalRecords = filteredIncidents.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusToggle = async (incidentId: string, currentStatus: Incident['status']) => {
    const statusFlow: Record<Incident['status'], Incident['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'dismissed',
      dismissed: 'pending'
    }
    const newStatus = statusFlow[currentStatus]

    setUpdatingField({ incidentId, field: 'status' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updates: Partial<Incident> = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      }
      
      if (newStatus === 'completed') {
        updates.resolved_at = new Date().toISOString()
      }
      
      setIncidents(prev => prev.map(incident =>
        incident._id === incidentId ? { ...incident, ...updates } : incident
      ))
      
      if (selectedIncident && selectedIncident._id === incidentId) {
        setSelectedIncident({ ...selectedIncident, ...updates })
      }
      
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleUrgencyToggle = async (incidentId: string, currentUrgency: boolean) => {
    setUpdatingField({ incidentId, field: 'urgency' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIncidents(prev => prev.map(incident =>
        incident._id === incidentId ? { ...incident, urgency: !currentUrgency, updated_at: new Date().toISOString() } : incident
      ))
      
      if (selectedIncident && selectedIncident._id === incidentId) {
        setSelectedIncident({ ...selectedIncident, urgency: !currentUrgency, updated_at: new Date().toISOString() })
      }
      
      toast.success('Urgency updated successfully')
    } catch (err) {
      toast.error('Failed to update urgency')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleRoleSave = async (incidentId: string) => {
    if (!roleValue.trim()) {
      setEditingRole(null)
      return
    }

    setUpdatingField({ incidentId, field: 'assigned_role' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIncidents(prev => prev.map(incident =>
        incident._id === incidentId ? { ...incident, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() } : incident
      ))
      
      if (selectedIncident && selectedIncident._id === incidentId) {
        setSelectedIncident({ ...selectedIncident, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() })
      }
      
      toast.success('Assigned role updated successfully')
      setEditingRole(null)
    } catch (err) {
      toast.error('Failed to update assigned role')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident)
    setViewModalOpen(true)
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'in_progress': return 'info'
      case 'completed': return 'success'
      case 'dismissed': return 'secondary'
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
          { label: 'Pending', value: 'pending' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Completed', value: 'completed' },
          { label: 'Dismissed', value: 'dismissed' }
        ],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 4
      },
      {
        id: 'urgency-filter',
        label: 'Urgency',
        type: 'select',
        value: urgencyFilter === 'all' ? '' : urgencyFilter,
        options: [
          { label: 'All urgencies', value: '' },
          { label: 'Urgent', value: 'urgent' },
          { label: 'Normal', value: 'normal' }
        ],
        onChange: (value) => setUrgencyFilter(value || 'all'),
        onClear: () => setUrgencyFilter('all'),
        width: 4
      }
    ],
    [statusFilter, urgencyFilter]
  )

  const columns: DataTableColumn<Incident>[] = useMemo(
    () => [
      {
        key: 'serial',
        header: '#',
        width: 60,
        // render: (_, index) => <span className="text-muted">{startIndex + index + 1}</span>
        render: (_, { rowIndex }) => <span className="text-muted">{startIndex + rowIndex + 1}</span>
      },
      {
        key: 'title',
        header: 'Incident',
        minWidth: 250,
        render: (incident) => (
          <div>
            <div className="fw-semibold">{incident.title}</div>
            {incident.description && (
              <small className="text-muted d-block">
                {incident.description.substring(0, 60)}
                {incident.description.length > 60 ? '...' : ''}
              </small>
            )}
            {incident.reported_by && (
              <small className="text-muted d-block">
                <IconifyIcon icon="solar:user-linear" width={12} height={12} className="me-1" />
                Reported by: {incident.reported_by}
              </small>
            )}
          </div>
        )
      },
      {
        key: 'urgency',
        header: 'Urgency',
        width: 110,
        render: (incident) => (
          <div
            onClick={() => updatingField?.incidentId !== incident._id && handleUrgencyToggle(incident._id, incident.urgency)}
            style={{ cursor: updatingField?.incidentId === incident._id ? 'not-allowed' : 'pointer' }}
            title="Click to toggle urgency"
          >
            <Badge
              bg={incident.urgency ? 'danger' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.incidentId === incident._id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.incidentId === incident._id && updatingField.field === 'urgency' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="small">...</span>
                </>
              ) : (
                <>
                  {incident.urgency ? 'URGENT' : 'NORMAL'}
                  <IconifyIcon icon="solar:refresh-linear" width={12} height={12} />
                </>
              )}
            </Badge>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        width: 150,
        render: (incident) => (
          <div
            onClick={() => updatingField?.incidentId !== incident._id && handleStatusToggle(incident._id, incident.status)}
            style={{ cursor: updatingField?.incidentId === incident._id ? 'not-allowed' : 'pointer' }}
            title="Click to cycle status"
          >
            <Badge
              bg={getStatusVariant(incident.status)}
              className="text-capitalize d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.incidentId === incident._id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.incidentId === incident._id && updatingField.field === 'status' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Updating...
                </>
              ) : (
                <>
                  {incident.status.replace('_', ' ')}
                  <IconifyIcon icon="solar:alt-arrow-right-linear" width={12} height={12} />
                </>
              )}
            </Badge>
          </div>
        )
      },
      {
        key: 'assigned',
        header: 'Assigned To',
        width: 160,
        render: (incident) => (
          incident.assigned_role ? (
            <Badge bg="light" text="dark" className="text-capitalize">
              {incident.assigned_role}
            </Badge>
          ) : (
            <span className="text-muted">Unassigned</span>
          )
        )
      },
      {
        key: 'resolved_at',
        header: 'Resolved',
        width: 160,
        render: (incident) => formatDate(incident.resolved_at)
      },
      {
        key: 'created_at',
        header: 'Reported',
        width: 160,
        render: (incident) => formatDate(incident.created_at)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 100,
        align: 'center',
        sticky: 'right',
        render: (incident) => (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleViewIncident(incident)}
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
              <h4 className="mb-2">Incident Reports</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Incidents</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="incidents-table"
            title="All Incidents"
            description="Track and manage incident reports from calls and staff reports."
            columns={columns}
            data={paginatedIncidents}
            rowKey={(incident) => incident._id}
            loading={loading}
            error={error}
            onRetry={fetchIncidents}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search incidents...'
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
              title: 'No incidents found',
              description: 'Incident reports will appear here as they are logged.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Incident Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIncident && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Incident ID</label>
                  <div className="fw-medium font-monospace small">{selectedIncident._id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Call ID</label>
                  <div className="fw-medium font-monospace small">{selectedIncident.call_id || '—'}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Urgency</label>
                  <div>
                    <div
                      onClick={() => handleUrgencyToggle(selectedIncident._id, selectedIncident.urgency)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to toggle"
                    >
                      <Badge
                        bg={selectedIncident.urgency ? 'danger' : 'secondary'}
                        className="d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.incidentId === selectedIncident._id && updatingField.field === 'urgency' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            <span className="small">Updating...</span>
                          </>
                        ) : (
                          <>
                            {selectedIncident.urgency ? 'URGENT' : 'NORMAL'}
                            <IconifyIcon icon="solar:refresh-linear" width={12} height={12} />
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Status</label>
                  <div>
                    <div
                      onClick={() => handleStatusToggle(selectedIncident._id, selectedIncident.status)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to cycle status"
                    >
                      <Badge
                        bg={getStatusVariant(selectedIncident.status)}
                        className="text-capitalize d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.incidentId === selectedIncident._id && updatingField.field === 'status' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {selectedIncident.status.replace('_', ' ')}
                            <IconifyIcon icon="solar:alt-arrow-right-linear" width={12} height={12} />
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <label className="text-muted small d-flex align-items-center justify-content-between">
                    <span>Assigned Role</span>
                    {!editingRole && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => {
                          setEditingRole(selectedIncident._id)
                          setRoleValue(selectedIncident.assigned_role || '')
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingRole === selectedIncident._id ? (
                    <div className="d-flex gap-2">
                      <Form.Control
                        size="sm"
                        value={roleValue}
                        onChange={(e) => setRoleValue(e.target.value)}
                        placeholder="Enter role"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleRoleSave(selectedIncident._id)}
                        disabled={updatingField?.incidentId === selectedIncident._id}
                      >
                        {updatingField?.incidentId === selectedIncident._id && updatingField.field === 'assigned_role' ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <IconifyIcon icon="solar:check-circle-linear" width={16} height={16} />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingRole(null)}
                      >
                        <IconifyIcon icon="solar:close-circle-linear" width={16} height={16} />
                      </Button>
                    </div>
                  ) : (
                    <div>{selectedIncident.assigned_role || '—'}</div>
                  )}
                </Col>
                {selectedIncident.reported_by && (
                  <Col md={12}>
                    <label className="text-muted small">Reported By</label>
                    <div className="fw-medium">{selectedIncident.reported_by}</div>
                  </Col>
                )}
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Title</label>
                <h5>{selectedIncident.title}</h5>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Description</label>
                <p className="mb-0">{selectedIncident.description || 'No description provided'}</p>
              </div>
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Reported At</label>
                  <div>{formatDate(selectedIncident.created_at)}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Resolved At</label>
                  <div>{formatDate(selectedIncident.resolved_at)}</div>
                </Col>
                <Col md={12}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedIncident.updated_at)}</div>
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

export default IncidentsPage