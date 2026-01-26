'use client'

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Badge, Button, Col, Form, Modal, Row, Spinner, Card, Dropdown } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { actionItemsApi, type ActionItem, type ActionItemsListParams } from '@/api/org/action-items'
import { orgUsersApi, type OrgUser } from '@/api/org/users'
import { appointmentsApi, type CreateAppointmentRequest } from '@/api/org/appointments'
import { ordersApi, type CreateOrderRequest } from '@/api/org/orders'
import { callLogsApi } from '@/api/org/call-logs'
import { useRealtimeRefresh } from '@/hooks/useRealtimeRefresh'

// Custom Status Dropdown Component
const StatusDropdown = ({
  currentStatus,
  onStatusChange,
  isUpdating = false,
  disabled = false
}: {
  currentStatus: ActionItem['status']
  onStatusChange: (newStatus: ActionItem['status']) => void
  isUpdating?: boolean
  disabled?: boolean
}) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: 'solar:clock-circle-bold',
      color: '#dc3545',
      bgColor: '#fff5f5'
    },
    in_progress: {
      label: 'In-Progress',
      icon: 'solar:settings-bold',
      color: '#fd7e14',
      bgColor: '#fff8f0'
    },
    completed: {
      label: 'Done',
      icon: 'solar:check-circle-bold',
      color: '#198754',
      bgColor: '#f0fdf4'
    },
    dismissed: {
      label: 'Cancelled',
      icon: 'solar:close-circle-bold',
      color: '#6c757d',
      bgColor: '#f8f9fa'
    }
  }

  const current = statusConfig[currentStatus]

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="light"
        disabled={disabled || isUpdating}
        bsPrefix="dropdown-toggle-no-caret"
        style={{
          backgroundColor: current.bgColor,
          border: `1.5px solid ${current.color}`,
          color: current.color,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          minWidth: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        {isUpdating ? (
          <>
            <Spinner size="sm" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon={current.icon} width={16} height={16} />
              <span>{current.label}</span>
            </div>
          </>
        )}
        <IconifyIcon icon="solar:alt-arrow-down-bold" />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '180px' }}>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Dropdown.Item
            key={status}
            onClick={() => onStatusChange(status as ActionItem['status'])}
            active={currentStatus === status}
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: currentStatus === status ? 600 : 400
            }}
          >
            <IconifyIcon
              icon={config.icon}
              width={18}
              height={18}
              style={{ color: config.color }}
            />
            <span>{config.label}</span>
            {currentStatus === status && (
              <IconifyIcon
                icon="solar:check-circle-bold"
                width={16}
                height={16}
                className="ms-auto"
                style={{ color: config.color }}
              />
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

const ActionItemsPage = () => {
  const { token, user, isAuthenticated } = useAuth()

  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [updatingField, setUpdatingField] = useState<{ itemId: string; field: string } | null>(null)

  const [editingDueDate, setEditingDueDate] = useState<string | null>(null)
  const [dueDateValue, setDueDateValue] = useState('')

  const [editingAssignment, setEditingAssignment] = useState<string | null>(null)
  const [assignmentUserId, setAssignmentUserId] = useState('')

  const [confirmAppointmentModalOpen, setConfirmAppointmentModalOpen] = useState(false)
  const [confirmOrderModalOpen, setConfirmOrderModalOpen] = useState(false)
  const [confirmingItem, setConfirmingItem] = useState<ActionItem | null>(null)
  const [callLogData, setCallLogData] = useState<any>(null)
  const [loadingCallLog, setLoadingCallLog] = useState(false)
  const [submittingConfirm, setSubmittingConfirm] = useState(false)

  const [pendingUrgentCount, setPendingUrgentCount] = useState(0)

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

  // Fetch organization users
  const fetchOrgUsers = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoadingUsers(true)
    try {
      const response = await orgUsersApi.list({ limit: 100, status_filter: 'active' })
      setOrgUsers(response.users)
    } catch (err) {
      console.error('Failed to fetch org users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchOrgUsers()
  }, [fetchOrgUsers])

  const fetchPendingUrgentCount = useCallback(async () => {
    if (!token || !isAuthenticated) return

    try {
      const res = await actionItemsApi.getPendingUrgentCount()
      const count = res.pending_urgent_count || 0

      setPendingUrgentCount(count)

      window.dispatchEvent(new CustomEvent('pendingUrgentActionItemsUpdated', {
        detail: { count }
      }))
    } catch (err) {
      console.error("Failed to fetch pending urgent count")
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchPendingUrgentCount()
  }, [fetchPendingUrgentCount])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, typeFilter, statusFilter, urgencyFilter, assignedFilter])


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
      if (assignedFilter === 'me') {
        params.assigned_to_me = true
      } else if (assignedFilter !== 'all') {
        params.assigned_to_user_id = assignedFilter as any
      }


      const response = await actionItemsApi.list(params)
      setActionItems(response.action_items)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load action items.')
      toast.error('Failed to load action items')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, typeFilter, statusFilter, urgencyFilter, assignedFilter])


  useEffect(() => {
    fetchActionItems()
  }, [fetchActionItems])

  // useRealtimeRefresh(fetchActionItems)
  useRealtimeRefresh(fetchActionItems, ['call_logs_refresh'])

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

  const handleConfirmAppointment = useCallback(async (item: ActionItem) => {
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
  }, [])

  const handleConfirmOrder = useCallback(async (item: ActionItem) => {
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
  }, [])

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
      fetchPendingUrgentCount()
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
      fetchPendingUrgentCount()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create order')
    } finally {
      setSubmittingConfirm(false)
    }
  }

  const handleStatusChange = useCallback(async (item: ActionItem, newStatus: ActionItem['status']) => {
    setUpdatingStatusId(item.id)
    try {
      await actionItemsApi.update(item.id, { status: newStatus })
      await fetchPendingUrgentCount()

      setActionItems(prev => prev.map(i =>
        i.id === item.id ? { ...i, status: newStatus, updated_at: new Date().toISOString() } : i
      ))

      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem({ ...selectedItem, status: newStatus, updated_at: new Date().toISOString() })
      }

      window.dispatchEvent(new CustomEvent('actionItemChanged'))
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatusId(null)
    }
  }, [selectedItem, fetchPendingUrgentCount])

  const handleUrgencyToggle = useCallback(async (itemId: string, currentUrgency: ActionItem['urgency']) => {
    const newUrgency = (currentUrgency === 'high' || currentUrgency === 'critical') ? 'low' : 'high'

    setUpdatingField({ itemId, field: 'urgency' })
    try {
      await actionItemsApi.update(itemId, { urgency: newUrgency })
      await fetchPendingUrgentCount()

      setActionItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, urgency: newUrgency, updated_at: new Date().toISOString() } : item
      ))

      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem({ ...selectedItem, urgency: newUrgency, updated_at: new Date().toISOString() })
      }

      window.dispatchEvent(new CustomEvent('actionItemChanged'))
      toast.success('Priority updated successfully')
    } catch (err) {
      toast.error('Failed to update priority')
    } finally {
      setUpdatingField(null)
    }
  }, [selectedItem, fetchPendingUrgentCount])

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

  const handleAssignmentSave = async (itemId: string) => {
    if (!assignmentUserId) {
      setEditingAssignment(null)
      return
    }

    setUpdatingField({ itemId, field: 'assigned_to_user_id' })
    try {
      await actionItemsApi.update(itemId, { assigned_to_user_id: assignmentUserId })

      const assignedUser = orgUsers.find(u => u.id === assignmentUserId)

      setActionItems(prev => prev.map(item =>
        item.id === itemId ? {
          ...item,
          assigned_to_user_id: assignmentUserId,
          assigned_role: assignedUser?.name || null,
          updated_at: new Date().toISOString()
        } : item
      ))

      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem({
          ...selectedItem,
          assigned_to_user_id: assignmentUserId,
          assigned_role: assignedUser?.name || null,
          updated_at: new Date().toISOString()
        })
      }

      toast.success('Assignment updated successfully')
      setEditingAssignment(null)
    } catch (err) {
      toast.error('Failed to update assignment')
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

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'appointment':
        return { label: 'Schedule Meeting', icon: 'solar:calendar-mark-bold', color: '#0d6efd', bgColor: '#e7f1ff' }
      case 'order':
        return { label: 'Process Order', icon: 'solar:bag-check-bold', color: '#198754', bgColor: '#d1f4e0' }
      case 'incident':
        return { label: 'Handle Issue', icon: 'solar:danger-triangle-bold', color: '#dc3545', bgColor: '#ffe5e5' }
      case 'follow_up':
        return { label: 'Follow Up', icon: 'solar:phone-calling-bold', color: '#0d6efd', bgColor: '#e7f1ff' }
      case 'task':
        return { label: 'General Task', icon: 'solar:checklist-bold', color: '#6c757d', bgColor: '#e2e3e5' }
      default:
        return { label: type, icon: 'solar:checklist-bold', color: '#6c757d', bgColor: '#e2e3e5' }
    }
  }

  const isUrgent = (urgency: ActionItem['urgency']) => {
    return urgency === 'high' || urgency === 'critical'
  }

  const getUserName = (userId: string | null | undefined) => {
    if (!userId) return null
    const user = orgUsers.find(u => u.id === userId)
    return user?.name || null
  }

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'type-filter',
        label: 'Task Type',
        type: 'select',
        value: typeFilter === 'all' ? '' : typeFilter,
        options: [
          { label: 'All Types', value: '' },
          { label: 'Schedule Meeting', value: 'appointment' },
          { label: 'Process Order', value: 'order' },
          { label: 'Handle Issue', value: 'incident' },
          { label: 'Follow Up', value: 'follow_up' },
          { label: 'General Task', value: 'task' }
        ],
        onChange: (value) => setTypeFilter(value || 'all'),
        onClear: () => setTypeFilter('all'),
        width: 3
      },
      {
        id: 'status-filter',
        label: 'Progress',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'All Progress', value: '' },
          { label: 'To Do', value: 'pending' },
          { label: 'Working On It', value: 'in_progress' },
          { label: 'Done', value: 'completed' },
          { label: 'Cancelled', value: 'dismissed' }
        ],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 3
      },
      {
        id: 'urgency-filter',
        label: 'Priority',
        type: 'select',
        value: urgencyFilter === 'all' ? '' : urgencyFilter,
        options: [
          { label: 'All Priorities', value: '' },
          { label: 'High Priority', value: 'urgent' },
          { label: 'Normal', value: 'normal' }
        ],
        onChange: (value) => setUrgencyFilter(value || 'all'),
        onClear: () => setUrgencyFilter('all'),
        width: 3
      },
      {
        id: 'assigned-filter',
        label: 'Assigned To',
        type: 'select',
        value: assignedFilter === 'all' ? '' : assignedFilter,
        options: [
          { label: 'All Members', value: '' },
          { label: 'Assigned To Me', value: 'me' },
          ...orgUsers.map((u) => ({
            label: `${u.name} (${u.email})`,
            value: u.id
          }))
        ],
        onChange: (value) => setAssignedFilter(value || 'all'),
        onClear: () => setAssignedFilter('all'),
        width: 3
      }
    ],
    [typeFilter, statusFilter, urgencyFilter, assignedFilter, orgUsers]
  )

  const columns: DataTableColumn<ActionItem>[] = useMemo(
    () => [
      {
        key: 'serial',
        header: '#',
        width: 60,
        render: (_, { rowIndex }) => <span className="text-muted fw-semibold">{startIndex + rowIndex + 1}</span>
      },
      {
        key: 'title',
        header: 'Task Details',
        minWidth: 280,
        render: (item) => {
          return (
            <div>
              <div className="fw-semibold mb-1" style={{ fontSize: '0.95rem' }}>{item.title}</div>
              {item.description && (
                <small className="text-muted d-block" style={{ lineHeight: '1.4' }}>
                  {item.description.substring(0, 80)}
                  {item.description.length > 80 ? '...' : ''}
                </small>
              )}
            </div>
          )
        }
      },
      {
        key: 'urgency',
        header: 'Priority',
        width: 130,
        align: 'left',
        render: (item) => (
          <div
            onClick={() => updatingField?.itemId !== item.id && handleUrgencyToggle(item.id, item.urgency)}
            style={{ cursor: updatingField?.itemId === item.id ? 'not-allowed' : 'pointer' }}
            title="Click to change priority"
          >
            <Badge
              bg={isUrgent(item.urgency) ? 'danger' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.itemId === item.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.75rem',
                padding: '0.5rem 0.75rem'
              }}
            >
              {updatingField?.itemId === item.id && updatingField.field === 'urgency' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="small">...</span>
                </>
              ) : (
                <>
                  <IconifyIcon
                    icon={isUrgent(item.urgency) ? 'solar:danger-circle-bold' : 'solar:check-circle-bold'}
                    width={14}
                    height={14}
                  />
                  {isUrgent(item.urgency) ? 'High' : 'Normal'}
                  <IconifyIcon icon="solar:refresh-linear" width={12} height={12} />
                </>
              )}
            </Badge>
          </div>
        )
      },
      {
        key: 'type',
        header: 'Type',
        width: 150,
        align: 'left',
        sticky: 'right',
        render: (item) => {
          const typeConfig = getTypeConfig(item.type)
          return (
            <div className="d-flex align-items-center gap-1">
              <div
                style={{
                  backgroundColor: typeConfig.bgColor,
                  color: typeConfig.color,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <IconifyIcon icon={typeConfig.icon} width={14} height={14} />
                {typeConfig.label}
              </div>
            </div>
          )
        }
      },
      {
        key: 'status',
        header: 'Progress',
        width: 180,
        align: 'left',
        sticky: 'right',
        render: (item) => (
          <StatusDropdown
            currentStatus={item.status}
            onStatusChange={(newStatus) => handleStatusChange(item, newStatus)}
            isUpdating={updatingStatusId === item.id}
          />
        )
      },
      {
        key: 'assigned',
        header: 'Team Member',
        width: 160,
        render: (item) => {
          const assignedUserName = getUserName(item.assigned_to_user_id) || item.assigned_role
          return assignedUserName ? (
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:user-bold" width={16} height={16} className="text-primary" />
              <Badge bg="light" text="dark" className="text-capitalize" style={{ fontSize: '0.8rem' }}>
                {assignedUserName}
              </Badge>
            </div>
          ) : (
            <span className="text-muted fst-italic small">Not assigned</span>
          )
        }
      },
      {
        key: 'due_at',
        header: 'Deadline',
        width: 180,
        render: (item) => {
          if (!item.due_at) return <span className="text-muted small">—</span>

          const dueDate = new Date(item.due_at)
          const now = new Date()
          const isOverdue = dueDate < now && item.status !== 'completed'
          const isDueSoon = dueDate > now && (dueDate.getTime() - now.getTime()) < 24 * 60 * 60 * 1000

          return (
            <div>
              <div className="small fw-semibold" style={{ color: isOverdue ? '#dc3545' : isDueSoon ? '#fd7e14' : '#6c757d' }}>
                {formatDate(item.due_at)}
              </div>
              {isOverdue && item.status !== 'completed' && (
                <Badge bg="danger" className="mt-1" style={{ fontSize: '0.7rem' }}>
                  <IconifyIcon icon="solar:danger-circle-bold" width={12} height={12} className="me-1" />
                  Overdue
                </Badge>
              )}
              {isDueSoon && item.status !== 'completed' && (
                <Badge bg="warning" className="mt-1" style={{ fontSize: '0.7rem' }}>
                  <IconifyIcon icon="solar:clock-circle-bold" width={12} height={12} className="me-1" />
                  Due Soon
                </Badge>
              )}
            </div>
          )
        }
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'left',
        sticky: 'right',
        render: (item) => (
          <div className="d-flex gap-2 justify-content-left">
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleViewItem(item)}
              title="View Full Details"
              style={{ borderRadius: '8px' }}
            >
              <IconifyIcon icon="solar:eye-bold" width={16} height={16} />
            </Button>
            {item.type === 'appointment' && item.status !== 'completed' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleConfirmAppointment(item)}
                title="Schedule This Meeting"
                style={{ borderRadius: '8px' }}
              >
                <IconifyIcon icon="solar:calendar-mark-bold" width={16} height={16} />
              </Button>
            )}
            {item.type === 'order' && item.status !== 'completed' && (
              <Button
                size="sm"
                variant="info"
                onClick={() => handleConfirmOrder(item)}
                title="Process This Order"
                style={{ borderRadius: '8px' }}
              >
                <IconifyIcon icon="solar:bag-check-bold" width={16} height={16} />
              </Button>
            )}
          </div>
        )
      }
    ],
    [updatingField, updatingStatusId, startIndex, handleStatusChange, handleConfirmAppointment, handleConfirmOrder, handleUrgencyToggle, orgUsers, getUserName]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Actions Items</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Tasks</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="">
        <Col xs={12}>
          <DataTable
            id="action-items-table"
            title="Actions Items"
            description="Track and manage all tasks from calls and team requests in one place"
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
                placeholder: 'Search tasks by name or description...'
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
              title: 'No tasks found',
              description: 'New tasks will appear here as they are created from calls and requests.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      {/* View Modal - Enhanced */}
      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedItem && (
            <>
              {/* Status at Top */}
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted d-block mb-2">Current Progress</small>
                  <StatusDropdown
                    currentStatus={selectedItem.status}
                    onStatusChange={(newStatus) => handleStatusChange(selectedItem, newStatus)}
                    isUpdating={updatingStatusId === selectedItem.id}
                  />
                </div>
                <div className="text-end">
                  <small className="text-muted d-block mb-1">Priority Level</small>
                  <div
                    onClick={() => handleUrgencyToggle(selectedItem.id, selectedItem.urgency)}
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                    title="Click to change"
                  >
                    <Badge
                      bg={isUrgent(selectedItem.urgency) ? 'danger' : 'secondary'}
                      className="d-inline-flex align-items-center gap-1"
                      style={{ cursor: 'pointer', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      {updatingField?.itemId === selectedItem.id && updatingField.field === 'urgency' ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" />
                          <span className="small">Updating...</span>
                        </>
                      ) : (
                        <>
                          <IconifyIcon
                            icon={isUrgent(selectedItem.urgency) ? 'solar:danger-circle-bold' : 'solar:check-circle-bold'}
                            width={16}
                            height={16}
                          />
                          {isUrgent(selectedItem.urgency) ? 'High Priority' : 'Normal Priority'}
                          <IconifyIcon icon="solar:refresh-linear" width={12} height={12} />
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Task Info Card */}
              <Card className="mb-3 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:document-text-bold" width={20} height={20} className="text-primary" />
                    Task Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col xs={12}>
                      <small className="text-muted d-block mb-1">Task Name</small>
                      <h5 className="mb-0">{selectedItem.title}</h5>
                    </Col>
                    <Col xs={12}>
                      <small className="text-muted d-block mb-2">Description</small>
                      <p className="mb-0 p-3 bg-light rounded" style={{ lineHeight: '1.6' }}>
                        {selectedItem.description || 'No description provided'}
                      </p>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block mb-1">Task Type</small>
                      {(() => {
                        const typeConfig = getTypeConfig(selectedItem.type)
                        return (
                          <div
                            style={{
                              backgroundColor: typeConfig.bgColor,
                              color: typeConfig.color,
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <IconifyIcon icon={typeConfig.icon} width={18} height={18} />
                            {typeConfig.label}
                          </div>
                        )
                      })()}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Assignment & Deadline Card */}
              <Card className="mb-3 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:calendar-bold" width={20} height={20} className="text-primary" />
                    Assignment & Deadline
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={12}>
                      <label className="text-muted small d-flex align-items-center justify-content-between">
                        <span>Team Member Assigned</span>
                        {!editingAssignment && (
                          <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-decoration-none"
                            onClick={() => {
                              setEditingAssignment(selectedItem.id)
                              setAssignmentUserId(selectedItem.assigned_to_user_id || '')
                            }}
                          >
                            <IconifyIcon icon="solar:pen-bold" width={14} height={14} />
                          </Button>
                        )}
                      </label>
                      {editingAssignment === selectedItem.id ? (
                        <div className="d-flex gap-2">
                          <Form.Select
                            size="sm"
                            value={assignmentUserId}
                            onChange={(e) => setAssignmentUserId(e.target.value)}
                            disabled={loadingUsers}
                          >
                            <option value="">Select team member...</option>
                            {orgUsers.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </option>
                            ))}
                          </Form.Select>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAssignmentSave(selectedItem.id)}
                            disabled={updatingField?.itemId === selectedItem.id || !assignmentUserId}
                            style={{ borderRadius: '8px' }}
                          >
                            {updatingField?.itemId === selectedItem.id && updatingField.field === 'assigned_to_user_id' ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingAssignment(null)}
                            style={{ borderRadius: '8px' }}
                          >
                            <IconifyIcon icon="solar:close-circle-bold" width={16} height={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          {selectedItem.assigned_to_user_id || selectedItem.assigned_role ? (
                            <>
                              <IconifyIcon icon="solar:user-bold" width={18} height={18} className="text-primary" />
                              <strong>{getUserName(selectedItem.assigned_to_user_id) || selectedItem.assigned_role}</strong>
                            </>
                          ) : (
                            <span className="text-muted fst-italic">Not assigned to anyone yet</span>
                          )}
                        </div>
                      )}
                    </Col>
                    <Col md={12}>
                      <label className="text-muted small d-flex align-items-center justify-content-between">
                        <span>Due Date & Time</span>
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
                            <IconifyIcon icon="solar:pen-bold" width={14} height={14} />
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
                            style={{ borderRadius: '8px' }}
                          >
                            {updatingField?.itemId === selectedItem.id && updatingField.field === 'due_at' ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingDueDate(null)}
                            style={{ borderRadius: '8px' }}
                          >
                            <IconifyIcon icon="solar:close-circle-bold" width={16} height={16} />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {selectedItem.due_at ? (
                            <strong>{formatDate(selectedItem.due_at)}</strong>
                          ) : (
                            <span className="text-muted fst-italic">No deadline set</span>
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Timeline Card */}
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <h6 className="mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:clock-circle-bold" width={20} height={20} className="text-primary" />
                    Timeline
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <small className="text-muted d-block mb-1">Created</small>
                      <strong className="small">{formatDate(selectedItem.created_at)}</strong>
                    </Col>
                    <Col md={6}>
                      <small className="text-muted d-block mb-1">Last Updated</small>
                      <strong className="small">{formatDate(selectedItem.updated_at)}</strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              {selectedItem.type === 'appointment' && selectedItem.status !== 'completed' && (
                <>
                  <hr className="my-4" />
                  <Button
                    variant="success"
                    onClick={() => handleConfirmAppointment(selectedItem)}
                    className="w-100"
                    size="lg"
                    style={{ borderRadius: '8px' }}
                  >
                    <IconifyIcon icon="solar:calendar-mark-bold" width={20} height={20} className="me-2" />
                    Schedule This Meeting
                  </Button>
                </>
              )}
              {selectedItem.type === 'order' && selectedItem.status !== 'completed' && (
                <>
                  <hr className="my-4" />
                  <Button
                    variant="info"
                    onClick={() => handleConfirmOrder(selectedItem)}
                    className="w-100"
                    size="lg"
                    style={{ borderRadius: '8px' }}
                  >
                    <IconifyIcon icon="solar:bag-check-bold" width={20} height={20} className="me-2" />
                    Process This Order
                  </Button>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setViewModalOpen(false)} style={{ borderRadius: '8px' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Appointment Modal */}
      <Modal show={confirmAppointmentModalOpen} onHide={() => setConfirmAppointmentModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Schedule Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {loadingCallLog ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3">Loading customer details...</p>
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
                    <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={appointmentForm.customer_phone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={appointmentForm.customer_email}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_email: e.target.value })}
                      placeholder="Enter email (optional)"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Meeting Date & Time <span className="text-danger">*</span></Form.Label>
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
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setConfirmAppointmentModalOpen(false)} style={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button variant="success" onClick={submitAppointment} disabled={submittingConfirm || loadingCallLog} style={{ borderRadius: '8px' }}>
            {submittingConfirm ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Scheduling...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:calendar-mark-bold" width={18} height={18} className="me-2" />
                Schedule Meeting
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Order Modal */}
      <Modal show={confirmOrderModalOpen} onHide={() => setConfirmOrderModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Process Order</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {loadingCallLog ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3">Loading customer details...</p>
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
                    <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={orderForm.customer_phone}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={orderForm.customer_email}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })}
                      placeholder="Enter email (optional)"
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
                      placeholder="What did the customer order?"
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
                    <Form.Label>Delivery Date & Time</Form.Label>
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
                      placeholder="Any special delivery or preparation instructions..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setConfirmOrderModalOpen(false)} style={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button variant="info" onClick={submitOrder} disabled={submittingConfirm || loadingCallLog} style={{ borderRadius: '8px' }}>
            {submittingConfirm ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Processing...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:bag-check-bold" width={18} height={18} className="me-2" />
                Process Order
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ActionItemsPage

export const dynamic = 'force-dynamic'