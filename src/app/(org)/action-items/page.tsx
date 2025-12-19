'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

type ActionItem = {
  _id: string
  org_id: string
  call_id?: string | null
  type: 'appointment' | 'order' | 'incident' | 'follow_up' | 'task'
  title: string
  description?: string | null
  urgency: boolean
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  due_at?: string | null
  created_at: string
  updated_at: string
}

const MOCK_ACTION_ITEMS: ActionItem[] = [
  {
    _id: 'action_001',
    org_id: 'org_001',
    call_id: 'call_abc123',
    type: 'appointment',
    title: 'Schedule follow-up appointment for John Doe',
    description: 'Patient needs follow-up checkup in 2 weeks',
    urgency: true,
    status: 'pending',
    assigned_to_user_id: 'user_001',
    assigned_role: 'receptionist',
    due_at: '2024-12-25T10:00:00Z',
    created_at: '2024-12-18T09:30:00Z',
    updated_at: '2024-12-18T09:30:00Z'
  },
  {
    _id: 'action_002',
    org_id: 'org_002',
    call_id: 'call_def456',
    type: 'order',
    title: 'Process catering order for corporate event',
    description: 'Large order for 50 people, vegetarian and non-vegetarian options',
    urgency: true,
    status: 'in_progress',
    assigned_to_user_id: 'user_002',
    assigned_role: 'chef',
    due_at: '2024-12-20T14:00:00Z',
    created_at: '2024-12-17T11:15:00Z',
    updated_at: '2024-12-18T08:20:00Z'
  },
  {
    _id: 'action_003',
    org_id: 'org_001',
    call_id: null,
    type: 'follow_up',
    title: 'Follow up with patient about lab results',
    description: 'Lab results are ready, need to inform patient',
    urgency: false,
    status: 'completed',
    assigned_to_user_id: 'user_003',
    assigned_role: 'nurse',
    due_at: '2024-12-19T16:00:00Z',
    created_at: '2024-12-16T14:30:00Z',
    updated_at: '2024-12-18T10:45:00Z'
  },
  {
    _id: 'action_004',
    org_id: 'org_003',
    call_id: 'call_ghi789',
    type: 'incident',
    title: 'Equipment malfunction reported',
    description: 'Dental chair in Room 3 not functioning properly',
    urgency: true,
    status: 'in_progress',
    assigned_to_user_id: null,
    assigned_role: 'maintenance',
    due_at: '2024-12-19T09:00:00Z',
    created_at: '2024-12-18T15:20:00Z',
    updated_at: '2024-12-18T15:20:00Z'
  },
  {
    _id: 'action_005',
    org_id: 'org_001',
    call_id: 'call_jkl012',
    type: 'task',
    title: 'Update patient records',
    description: 'Add new insurance information to patient file',
    urgency: false,
    status: 'pending',
    assigned_to_user_id: 'user_001',
    assigned_role: 'admin',
    due_at: null,
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z'
  }
]

const ActionItemsPage = () => {
  const router = useRouter()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [actionItems, setActionItems] = useState<ActionItem[]>(MOCK_ACTION_ITEMS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null)
  const [updatingField, setUpdatingField] = useState<{ itemId: string; field: string } | null>(null)

  const [editingDueDate, setEditingDueDate] = useState<string | null>(null)
  const [dueDateValue, setDueDateValue] = useState('')

  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [roleValue, setRoleValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, typeFilter, statusFilter, urgencyFilter])

  const fetchActionItems = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setActionItems(MOCK_ACTION_ITEMS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load action items.')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchActionItems()
  }, [fetchActionItems])

  const filteredActionItems = useMemo(() => {
    return actionItems.filter((item) => {
      const matchesSearch =
        !debouncedSearch ||
        item.title.toLowerCase().includes(debouncedSearch) ||
        (item.description ?? '').toLowerCase().includes(debouncedSearch)

      const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesUrgency = 
        urgencyFilter === 'all' || 
        (urgencyFilter === 'urgent' && item.urgency) ||
        (urgencyFilter === 'normal' && !item.urgency)

      return matchesSearch && matchesType && matchesStatus && matchesUrgency
    })
  }, [actionItems, debouncedSearch, typeFilter, statusFilter, urgencyFilter])

  const totalRecords = filteredActionItems.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedActionItems = filteredActionItems.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusToggle = async (itemId: string, currentStatus: ActionItem['status']) => {
    const statusFlow: Record<ActionItem['status'], ActionItem['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'dismissed',
      dismissed: 'pending'
    }
    const newStatus = statusFlow[currentStatus]

    setUpdatingField({ itemId, field: 'status' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setActionItems(prev => prev.map(item =>
        item._id === itemId ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem._id === itemId) {
        setSelectedItem({ ...selectedItem, status: newStatus, updated_at: new Date().toISOString() })
      }
      
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleUrgencyToggle = async (itemId: string, currentUrgency: boolean) => {
    setUpdatingField({ itemId, field: 'urgency' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setActionItems(prev => prev.map(item =>
        item._id === itemId ? { ...item, urgency: !currentUrgency, updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem._id === itemId) {
        setSelectedItem({ ...selectedItem, urgency: !currentUrgency, updated_at: new Date().toISOString() })
      }
      
      toast.success('Urgency updated successfully')
    } catch (err) {
      toast.error('Failed to update urgency')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleDueDateSave = async (itemId: string) => {
    if (!dueDateValue) {
      setEditingDueDate(null)
      return
    }

    setUpdatingField({ itemId, field: 'due_at' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newDueDate = new Date(dueDateValue).toISOString()
      
      setActionItems(prev => prev.map(item =>
        item._id === itemId ? { ...item, due_at: newDueDate, updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem._id === itemId) {
        setSelectedItem({ ...selectedItem, due_at: newDueDate, updated_at: new Date().toISOString() })
      }
      
      toast.success('Due date updated successfully')
      setEditingDueDate(null)
    } catch (err) {
      toast.error('Failed to update due date')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleRoleSave = async (itemId: string) => {
    if (!roleValue.trim()) {
      setEditingRole(null)
      return
    }

    setUpdatingField({ itemId, field: 'assigned_role' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setActionItems(prev => prev.map(item =>
        item._id === itemId ? { ...item, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem._id === itemId) {
        setSelectedItem({ ...selectedItem, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() })
      }
      
      toast.success('Assigned role updated successfully')
      setEditingRole(null)
    } catch (err) {
      toast.error('Failed to update assigned role')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleViewItem = (item: ActionItem) => {
    setSelectedItem(item)
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

  const formatDateInput = (dateString?: string | null) => {
    if (!dateString) return ''
    return dateString.slice(0, 16)
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'appointment': return 'primary'
      case 'order': return 'success'
      case 'incident': return 'danger'
      case 'follow_up': return 'info'
      case 'task': return 'secondary'
      default: return 'secondary'
    }
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
        id: 'type-filter',
        label: 'Type',
        type: 'select',
        value: typeFilter === 'all' ? '' : typeFilter,
        options: [
          { label: 'All types', value: '' },
          { label: 'Appointment', value: 'appointment' },
          { label: 'Order', value: 'order' },
          { label: 'Incident', value: 'incident' },
          { label: 'Follow Up', value: 'follow_up' },
          { label: 'Task', value: 'task' }
        ],
        onChange: (value) => setTypeFilter(value || 'all'),
        onClear: () => setTypeFilter('all'),
        width: 3
      },
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
        width: 3
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
        width: 3
      }
    ],
    [typeFilter, statusFilter, urgencyFilter]
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
        header: 'Action Item',
        minWidth: 250,
        render: (item) => (
          <div>
            <div className="fw-semibold">{item.title}</div>
            {item.description && (
              <small className="text-muted d-block">
                {item.description.substring(0, 60)}
                {item.description.length > 60 ? '...' : ''}
              </small>
            )}
          </div>
        )
      },
      {
        key: 'type',
        header: 'Type',
        width: 130,
        render: (item) => (
          <Badge bg={getTypeVariant(item.type)} className="text-capitalize">
            {item.type.replace('_', ' ')}
          </Badge>
        )
      },
      {
        key: 'urgency',
        header: 'Urgency',
        width: 110,
        render: (item) => (
          <div
            onClick={() => updatingField?.itemId !== item._id && handleUrgencyToggle(item._id, item.urgency)}
            style={{ cursor: updatingField?.itemId === item._id ? 'not-allowed' : 'pointer' }}
            title="Click to toggle urgency"
          >
            <Badge
              bg={item.urgency ? 'danger' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.itemId === item._id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.itemId === item._id && updatingField.field === 'urgency' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="small">...</span>
                </>
              ) : (
                <>
                  {item.urgency ? 'URGENT' : 'NORMAL'}
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
        render: (item) => (
          <div
            onClick={() => updatingField?.itemId !== item._id && handleStatusToggle(item._id, item.status)}
            style={{ cursor: updatingField?.itemId === item._id ? 'not-allowed' : 'pointer' }}
            title="Click to cycle status"
          >
            <Badge
              bg={getStatusVariant(item.status)}
              className="text-capitalize d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.itemId === item._id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.itemId === item._id && updatingField.field === 'status' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Updating...
                </>
              ) : (
                <>
                  {item.status.replace('_', ' ')}
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
        render: (item) => (
          item.assigned_role ? (
            <Badge bg="light" text="dark" className="text-capitalize">
              {item.assigned_role}
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
        render: (item) => formatDate(item.due_at)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 100,
        align: 'center',
        sticky: 'right',
        render: (item) => (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleViewItem(item)}
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
              <h4 className="mb-2">Action Items</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Action Items</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="action-items-table"
            title="All Action Items"
            description="Track and manage action items generated from calls and manual entries."
            columns={columns}
            data={paginatedActionItems}
            rowKey={(item) => item._id}
            loading={loading}
            error={error}
            onRetry={fetchActionItems}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search action items...'
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
              title: 'No action items found',
              description: 'Action items will appear here as they are created from calls.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Action Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Item ID</label>
                  <div className="fw-medium font-monospace small">{selectedItem._id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Call ID</label>
                  <div className="fw-medium font-monospace small">{selectedItem.call_id || '—'}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Type</label>
                  <div>
                    <Badge bg={getTypeVariant(selectedItem.type)} className="text-capitalize">
                      {selectedItem.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Urgency</label>
                  <div>
                    <div
                      onClick={() => handleUrgencyToggle(selectedItem._id, selectedItem.urgency)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to toggle"
                    >
                      <Badge
                        bg={selectedItem.urgency ? 'danger' : 'secondary'}
                        className="d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.itemId === selectedItem._id && updatingField.field === 'urgency' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            <span className="small">Updating...</span>
                          </>
                        ) : (
                          <>
                            {selectedItem.urgency ? 'URGENT' : 'NORMAL'}
                            <IconifyIcon icon="solar:refresh-linear" width={12} height={12} />
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <label className="text-muted small">Status</label>
                  <div>
                    <div
                      onClick={() => handleStatusToggle(selectedItem._id, selectedItem.status)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to cycle status"
                    >
                      <Badge
                        bg={getStatusVariant(selectedItem.status)}
                        className="text-capitalize d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.itemId === selectedItem._id && updatingField.field === 'status' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {selectedItem.status.replace('_', ' ')}
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
                          setEditingRole(selectedItem._id)
                          setRoleValue(selectedItem.assigned_role || '')
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingRole === selectedItem._id ? (
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
                        onClick={() => handleRoleSave(selectedItem._id)}
                        disabled={updatingField?.itemId === selectedItem._id}
                      >
                        {updatingField?.itemId === selectedItem._id && updatingField.field === 'assigned_role' ? (
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
                    <div>{selectedItem.assigned_role || '—'}</div>
                  )}
                </Col>
                <Col md={12}>
                  <label className="text-muted small d-flex align-items-center justify-content-between">
                    <span>Due Date</span>
                    {!editingDueDate && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => {
                          setEditingDueDate(selectedItem._id)
                          setDueDateValue(formatDateInput(selectedItem.due_at))
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingDueDate === selectedItem._id ? (
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="datetime-local"
                        size="sm"
                        value={dueDateValue}
                        onChange={(e) => setDueDateValue(e.target.value)}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDueDateSave(selectedItem._id)}
                        disabled={updatingField?.itemId === selectedItem._id}
                      >
                        {updatingField?.itemId === selectedItem._id && updatingField.field === 'due_at' ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <IconifyIcon icon="solar:check-circle-linear" width={16} height={16} />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingDueDate(null)}
                      >
                        <IconifyIcon icon="solar:close-circle-linear" width={16} height={16} />
                      </Button>
                    </div>
                  ) : (
                    <div>{formatDate(selectedItem.due_at)}</div>
                  )}
                </Col>
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Title</label>
                <h5>{selectedItem.title}</h5>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Description</label>
                <p className="mb-0">{selectedItem.description || 'No description provided'}</p>
              </div>
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Created At</label>
                  <div>{formatDate(selectedItem.created_at)}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedItem.updated_at)}</div>
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

export default ActionItemsPage