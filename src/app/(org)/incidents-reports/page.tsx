'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { actionItemsApi, type ActionItem, type ActionItemsListParams } from '@/api/org/action-items'

import { useFeatureGuard } from '@/hooks/useFeatureGuard'

const IncidentsPage = () => {
  useFeatureGuard()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [incidents, setIncidents] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<ActionItem | null>(null)
  const [updatingField, setUpdatingField] = useState<{ incidentId: string; field: string } | null>(null)

  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [roleValue, setRoleValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter])

  const fetchIncidents = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const params: ActionItemsListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
        type_filter: 'incident', // Always filter for incidents only
        urgency_filter: 'high', // Always filter for urgent incidents only
      }

      if (statusFilter !== 'all') params.status_filter = statusFilter as any

      const response = await actionItemsApi.list(params)
      setIncidents(response.action_items)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load incidents.')
      toast.error('Failed to load incidents')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, statusFilter])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusToggle = async (incidentId: string, currentStatus: ActionItem['status']) => {
    const statusFlow: Record<ActionItem['status'], ActionItem['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'dismissed',
      dismissed: 'pending'
    }
    const newStatus = statusFlow[currentStatus]

    setUpdatingField({ incidentId, field: 'status' })
    try {
      await actionItemsApi.update(incidentId, { status: newStatus })
      
      setIncidents(prev => prev.map(incident =>
        incident.id === incidentId ? { ...incident, status: newStatus, updated_at: new Date().toISOString() } : incident
      ))
      
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident({ ...selectedIncident, status: newStatus, updated_at: new Date().toISOString() })
      }
      
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleUrgencyToggle = async (incidentId: string, currentUrgency: ActionItem['urgency']) => {
    const newUrgency = (currentUrgency === 'high' || currentUrgency === 'critical') ? 'low' : 'high'
    
    setUpdatingField({ incidentId, field: 'urgency' })
    try {
      await actionItemsApi.update(incidentId, { urgency: newUrgency })
      
      setIncidents(prev => prev.map(incident =>
        incident.id === incidentId ? { ...incident, urgency: newUrgency, updated_at: new Date().toISOString() } : incident
      ))
      
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident({ ...selectedIncident, urgency: newUrgency, updated_at: new Date().toISOString() })
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
      await actionItemsApi.update(incidentId, { assigned_role: roleValue.trim() })
      
      setIncidents(prev => prev.map(incident =>
        incident.id === incidentId ? { ...incident, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() } : incident
      ))
      
      if (selectedIncident && selectedIncident.id === incidentId) {
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

  const handleViewIncident = (incident: ActionItem) => {
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

  const isUrgent = (urgency: ActionItem['urgency']) => {
    return urgency === 'high' || urgency === 'critical'
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
      }
    ],
    [statusFilter]
  )

  const columns: DataTableColumn<ActionItem>[] = useMemo(
    () => [
      {
        key: 'serial',
        header: '#',
        width: 60,
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
          </div>
        )
      },
      {
        key: 'urgency',
        header: 'Urgency',
        width: 110,
        render: (incident) => (
          <div
            onClick={() => updatingField?.incidentId !== incident.id && handleUrgencyToggle(incident.id, incident.urgency)}
            style={{ cursor: updatingField?.incidentId === incident.id ? 'not-allowed' : 'pointer' }}
            title="Click to toggle urgency"
          >
            <Badge
              bg={isUrgent(incident.urgency) ? 'danger' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.incidentId === incident.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.incidentId === incident.id && updatingField.field === 'urgency' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="small">...</span>
                </>
              ) : (
                <>
                  {isUrgent(incident.urgency) ? 'URGENT' : 'NORMAL'}
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
            onClick={() => updatingField?.incidentId !== incident.id && handleStatusToggle(incident.id, incident.status)}
            style={{ cursor: updatingField?.incidentId === incident.id ? 'not-allowed' : 'pointer' }}
            title="Click to cycle status"
          >
            <Badge
              bg={getStatusVariant(incident.status)}
              className="text-capitalize d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.incidentId === incident.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.incidentId === incident.id && updatingField.field === 'status' ? (
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
        key: 'due_at',
        header: 'Due Date',
        width: 160,
        render: (incident) => formatDate(incident.due_at)
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
            data={incidents}
            rowKey={(incident) => incident.id}
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
              totalRecords: total,
              totalPages,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [10, 25, 50],
              startRecord: startIndex + 1,
              endRecord: Math.min(startIndex + pageSize, total)
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
                  <div className="fw-medium font-monospace small">{selectedIncident.id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Call ID</label>
                  <div className="fw-medium font-monospace small">{selectedIncident.call_id || '—'}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Urgency</label>
                  <div>
                    <div
                      onClick={() => handleUrgencyToggle(selectedIncident.id, selectedIncident.urgency)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to toggle"
                    >
                      <Badge
                        bg={isUrgent(selectedIncident.urgency) ? 'danger' : 'secondary'}
                        className="d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.incidentId === selectedIncident.id && updatingField.field === 'urgency' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            <span className="small">Updating...</span>
                          </>
                        ) : (
                          <>
                            {isUrgent(selectedIncident.urgency) ? 'URGENT' : 'NORMAL'}
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
                      onClick={() => handleStatusToggle(selectedIncident.id, selectedIncident.status)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to cycle status"
                    >
                      <Badge
                        bg={getStatusVariant(selectedIncident.status)}
                        className="text-capitalize d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.incidentId === selectedIncident.id && updatingField.field === 'status' ? (
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
                          setEditingRole(selectedIncident.id)
                          setRoleValue(selectedIncident.assigned_role || '')
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingRole === selectedIncident.id ? (
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
                        onClick={() => handleRoleSave(selectedIncident.id)}
                        disabled={updatingField?.incidentId === selectedIncident.id}
                      >
                        {updatingField?.incidentId === selectedIncident.id && updatingField.field === 'assigned_role' ? (
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
                  <label className="text-muted small">Due Date</label>
                  <div>{formatDate(selectedIncident.due_at)}</div>
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