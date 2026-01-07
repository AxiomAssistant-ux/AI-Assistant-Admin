'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { actionItemsApi, type ActionItem, type ActionItemsListParams } from '@/api/org/action-items'
import { appointmentsApi, type CreateAppointmentRequest } from '@/api/org/appointments'
import { ordersApi, type CreateOrderRequest } from '@/api/org/orders'
import { callLogsApi } from '@/api/org/call-logs'


const ActionItemsPage = () => {
  const { token, user, isAuthenticated } = useAuth()

  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

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

  const [confirmAppointmentModalOpen, setConfirmAppointmentModalOpen] = useState(false)
  const [confirmOrderModalOpen, setConfirmOrderModalOpen] = useState(false)
  const [confirmingItem, setConfirmingItem] = useState<ActionItem | null>(null)
  const [callLogData, setCallLogData] = useState<any>(null)
  const [loadingCallLog, setLoadingCallLog] = useState(false)
  const [submittingConfirm, setSubmittingConfirm] = useState(false)

  const [appointmentForm, setAppointmentForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    scheduled_at: ''
  })

  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    order_details: '',
    total_amount: '',
    currency: 'USD',
    delivery_time: '',
    special_instructions: ''
  })

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
      const params: ActionItemsListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
      }

      if (typeFilter !== 'all') params.type_filter = typeFilter as any
      if (statusFilter !== 'all') params.status_filter = statusFilter as any
      if (urgencyFilter === 'urgent') params.urgency_filter = 'high'
      else if (urgencyFilter === 'normal') params.urgency_filter = 'low'

      const response = await actionItemsApi.list(params)
      setActionItems(response.action_items)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load action items.')
      toast.error('Failed to load action items')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, typeFilter, statusFilter, urgencyFilter])

  useEffect(() => {
    fetchActionItems()
  }, [fetchActionItems])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const loadCallLogData = async (callId: string) => {
    setLoadingCallLog(true)
    try {
      const callLog = await callLogsApi.getById(callId)
      setCallLogData(callLog)
      return callLog
    } catch (err) {
      console.error('Failed to load call log:', err)
      toast.error('Failed to load call details')
      return null
    } finally {
      setLoadingCallLog(false)
    }
  }

  const handleConfirmAppointment = async (item: ActionItem) => {
    setConfirmingItem(item)
    setCallLogData(null)
    
    if (item.call_id) {
      const callLog = await loadCallLogData(item.call_id)
      if (callLog) {
        setAppointmentForm({
          customer_name: callLog.caller?.name || '',
          customer_phone: callLog.caller?.number || '',
          customer_email: callLog.caller?.email || '',
          scheduled_at: item.due_at ? new Date(item.due_at).toISOString().slice(0, 16) : ''
        })
      }
    } else {
      setAppointmentForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        scheduled_at: item.due_at ? new Date(item.due_at).toISOString().slice(0, 16) : ''
      })
    }
    
    setConfirmAppointmentModalOpen(true)
  }

  const handleConfirmOrder = async (item: ActionItem) => {
    setConfirmingItem(item)
    setCallLogData(null)
    
    if (item.call_id) {
      const callLog = await loadCallLogData(item.call_id)
      if (callLog) {
        setOrderForm({
          customer_name: callLog.caller?.name || '',
          customer_phone: callLog.caller?.number || '',
          customer_email: callLog.caller?.email || '',
          order_details: item.description || '',
          total_amount: '',
          currency: 'USD',
          delivery_time: item.due_at ? new Date(item.due_at).toISOString().slice(0, 16) : '',
          special_instructions: ''
        })
      }
    } else {
      setOrderForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        order_details: item.description || '',
        total_amount: '',
        currency: 'USD',
        delivery_time: item.due_at ? new Date(item.due_at).toISOString().slice(0, 16) : '',
        special_instructions: ''
      })
    }
    
    setConfirmOrderModalOpen(true)
  }

  const submitAppointment = async () => {
    if (!confirmingItem) return
    
    if (!appointmentForm.customer_name || !appointmentForm.customer_phone || !appointmentForm.scheduled_at) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmittingConfirm(true)
    try {
      const appointmentData: CreateAppointmentRequest = {
        call_id: confirmingItem.call_id || null,
        customer_name: appointmentForm.customer_name,
        customer_phone: appointmentForm.customer_phone,
        customer_email: appointmentForm.customer_email || null,
        scheduled_at: new Date(appointmentForm.scheduled_at).toISOString()
      }

      await appointmentsApi.create(appointmentData)
      
      // Mark action item as completed
      await actionItemsApi.update(confirmingItem.id, { status: 'completed' })
      
      toast.success('Appointment created successfully!')
      setConfirmAppointmentModalOpen(false)
      setConfirmingItem(null)
      setAppointmentForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        scheduled_at: ''
      })
      fetchActionItems()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create appointment')
    } finally {
      setSubmittingConfirm(false)
    }
  }

  const submitOrder = async () => {
    if (!confirmingItem) return
    
    if (!orderForm.customer_name || !orderForm.customer_phone || !orderForm.order_details) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmittingConfirm(true)
    try {
      const orderData: CreateOrderRequest = {
        call_id: confirmingItem.call_id || null,
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        customer_email: orderForm.customer_email || null,
        order_details: orderForm.order_details,
        total_amount: orderForm.total_amount ? parseFloat(orderForm.total_amount) : null,
        currency: orderForm.currency,
        urgency: confirmingItem.urgency === 'high' || confirmingItem.urgency === 'critical',
        assigned_role: confirmingItem.assigned_role || null,
        delivery_time: orderForm.delivery_time ? new Date(orderForm.delivery_time).toISOString() : null,
        special_instructions: orderForm.special_instructions || null
      }

      await ordersApi.create(orderData)
      
      // Mark action item as completed
      await actionItemsApi.update(confirmingItem.id, { status: 'completed' })
      
      toast.success('Order created successfully!')
      setConfirmOrderModalOpen(false)
      setConfirmingItem(null)
      setOrderForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        order_details: '',
        total_amount: '',
        currency: 'USD',
        delivery_time: '',
        special_instructions: ''
      })
      fetchActionItems()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create order')
    } finally {
      setSubmittingConfirm(false)
    }
  }

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
      await actionItemsApi.update(itemId, { status: newStatus })
      
      setActionItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem({ ...selectedItem, status: newStatus, updated_at: new Date().toISOString() })
      }
      
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleUrgencyToggle = async (itemId: string, currentUrgency: ActionItem['urgency']) => {
    const newUrgency = (currentUrgency === 'high' || currentUrgency === 'critical') ? 'low' : 'high'
    
    setUpdatingField({ itemId, field: 'urgency' })
    try {
      await actionItemsApi.update(itemId, { urgency: newUrgency })
      
      setActionItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, urgency: newUrgency, updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem({ ...selectedItem, urgency: newUrgency, updated_at: new Date().toISOString() })
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
      const newDueDate = new Date(dueDateValue).toISOString()
      await actionItemsApi.update(itemId, { due_at: newDueDate })
      
      setActionItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, due_at: newDueDate, updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem.id === itemId) {
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
      await actionItemsApi.update(itemId, { assigned_role: roleValue.trim() })
      
      setActionItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() } : item
      ))
      
      if (selectedItem && selectedItem.id === itemId) {
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

  const isUrgent = (urgency: ActionItem['urgency']) => {
    return urgency === 'high' || urgency === 'critical'
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
            onClick={() => updatingField?.itemId !== item.id && handleUrgencyToggle(item.id, item.urgency)}
            style={{ cursor: updatingField?.itemId === item.id ? 'not-allowed' : 'pointer' }}
            title="Click to toggle urgency"
          >
            <Badge
              bg={isUrgent(item.urgency) ? 'danger' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.itemId === item.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.itemId === item.id && updatingField.field === 'urgency' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="small">...</span>
                </>
              ) : (
                <>
                  {isUrgent(item.urgency) ? 'URGENT' : 'NORMAL'}
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
            onClick={() => updatingField?.itemId !== item.id && handleStatusToggle(item.id, item.status)}
            style={{ cursor: updatingField?.itemId === item.id ? 'not-allowed' : 'pointer' }}
            title="Click to cycle status"
          >
            <Badge
              bg={getStatusVariant(item.status)}
              className="text-capitalize d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.itemId === item.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.itemId === item.id && updatingField.field === 'status' ? (
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
        width: 200,
        align: 'center',
        sticky: 'right',
        render: (item) => (
          <div className="d-flex gap-1 justify-content-center">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => handleViewItem(item)}
              title="View details"
            >
              <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
            </Button>
            {item.type === 'appointment' && item.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline-success"
                onClick={() => handleConfirmAppointment(item)}
                title="Confirm Appointment"
              >
                <IconifyIcon icon="solar:calendar-mark-linear" width={16} height={16} />
              </Button>
            )}
            {item.type === 'order' && item.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline-info"
                onClick={() => handleConfirmOrder(item)}
                title="Confirm Order"
              >
                <IconifyIcon icon="solar:bag-check-linear" width={16} height={16} />
              </Button>
            )}
          </div>
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
            data={actionItems}
            rowKey={(item) => item.id}
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
              totalRecords: total,
              totalPages,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [10, 25, 50],
              startRecord: startIndex + 1,
              endRecord: Math.min(startIndex + pageSize, total)
            }}
            emptyState={{
              title: 'No action items found',
              description: 'Action items will appear here as they are created from calls.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      {/* View Modal */}
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
                  <div className="fw-medium font-monospace small">{selectedItem.id}</div>
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
                      onClick={() => handleUrgencyToggle(selectedItem.id, selectedItem.urgency)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to toggle"
                    >
                      <Badge
                        bg={isUrgent(selectedItem.urgency) ? 'danger' : 'secondary'}
                        className="d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.itemId === selectedItem.id && updatingField.field === 'urgency' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            <span className="small">Updating...</span>
                          </>
                        ) : (
                          <>
                            {isUrgent(selectedItem.urgency) ? 'URGENT' : 'NORMAL'}
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
                      onClick={() => handleStatusToggle(selectedItem.id, selectedItem.status)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to cycle status"
                    >
                      <Badge
                        bg={getStatusVariant(selectedItem.status)}
                        className="text-capitalize d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.itemId === selectedItem.id && updatingField.field === 'status' ? (
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
                          setEditingRole(selectedItem.id)
                          setRoleValue(selectedItem.assigned_role || '')
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingRole === selectedItem.id ? (
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
                        onClick={() => handleRoleSave(selectedItem.id)}
                        disabled={updatingField?.itemId === selectedItem.id}
                      >
                        {updatingField?.itemId === selectedItem.id && updatingField.field === 'assigned_role' ? (
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
                          setEditingDueDate(selectedItem.id)
                          setDueDateValue(formatDateInput(selectedItem.due_at))
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingDueDate === selectedItem.id ? (
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
                        onClick={() => handleDueDateSave(selectedItem.id)}
                        disabled={updatingField?.itemId === selectedItem.id}
                      >
                        {updatingField?.itemId === selectedItem.id && updatingField.field === 'due_at' ? (
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
              {selectedItem.type === 'appointment' && selectedItem.status !== 'completed' && (
                <>
                  <hr />
                  <Button variant="success" onClick={() => handleConfirmAppointment(selectedItem)} className="w-100">
                    <IconifyIcon icon="solar:calendar-mark-linear" width={18} height={18} className="me-2" />
                    Confirm Appointment
                  </Button>
                </>
              )}
              {selectedItem.type === 'order' && selectedItem.status !== 'completed' && (
                <>
                  <hr />
                  <Button variant="info" onClick={() => handleConfirmOrder(selectedItem)} className="w-100">
                    <IconifyIcon icon="solar:bag-check-linear" width={18} height={18} className="me-2" />
                    Confirm Order
                  </Button>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Appointment Modal */}
      <Modal show={confirmAppointmentModalOpen} onHide={() => setConfirmAppointmentModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingCallLog ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Loading call details...</p>
            </div>
          ) : (
            <Form>
              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Customer Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={appointmentForm.customer_name}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_name: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Phone <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={appointmentForm.customer_phone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={appointmentForm.customer_email}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Scheduled Date & Time <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={appointmentForm.scheduled_at}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, scheduled_at: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmAppointmentModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={submitAppointment} disabled={submittingConfirm || loadingCallLog}>
            {submittingConfirm ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Creating...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:calendar-mark-linear" width={18} height={18} className="me-2" />
                Create Appointment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Order Modal */}
      <Modal show={confirmOrderModalOpen} onHide={() => setConfirmOrderModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingCallLog ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Loading call details...</p>
            </div>
          ) : (
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={orderForm.customer_name}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Phone <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={orderForm.customer_phone}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Customer Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={orderForm.customer_email}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Order Details <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={orderForm.order_details}
                      onChange={(e) => setOrderForm({ ...orderForm, order_details: e.target.value })}
                      placeholder="Enter order details"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={orderForm.total_amount}
                      onChange={(e) => setOrderForm({ ...orderForm, total_amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      value={orderForm.currency}
                      onChange={(e) => setOrderForm({ ...orderForm, currency: e.target.value })}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="PKR">PKR</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Delivery Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={orderForm.delivery_time}
                      onChange={(e) => setOrderForm({ ...orderForm, delivery_time: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Special Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={orderForm.special_instructions}
                      onChange={(e) => setOrderForm({ ...orderForm, special_instructions: e.target.value })}
                      placeholder="Any special instructions..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmOrderModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={submitOrder} disabled={submittingConfirm || loadingCallLog}>
            {submittingConfirm ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Creating...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:bag-check-linear" width={18} height={18} className="me-2" />
                Create Order
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ActionItemsPage