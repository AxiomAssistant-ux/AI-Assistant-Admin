'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { ordersApi, type Order, type OrdersListParams } from '@/api/org/orders'
import { useFeatureGuard } from '@/hooks/useFeatureGuard'

const OrdersPage = () => {
  useFeatureGuard()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingField, setUpdatingField] = useState<{ orderId: string; field: string } | null>(null)

  const [editingDelivery, setEditingDelivery] = useState<string | null>(null)
  const [deliveryValue, setDeliveryValue] = useState('')

  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [roleValue, setRoleValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, urgencyFilter])

  const fetchOrders = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const params: OrdersListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
      }

      if (statusFilter !== 'all') params.status_filter = statusFilter as any
      if (urgencyFilter === 'urgent') params.urgency_filter = true
      else if (urgencyFilter === 'normal') params.urgency_filter = false

      const response = await ordersApi.list(params)
      setOrders(response.orders)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load orders.')
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, statusFilter, urgencyFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusToggle = useCallback(async (orderId: string, currentStatus: Order['status']) => {
    const statusFlow: Record<Order['status'], Order['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'cancelled',
      cancelled: 'pending'
    }
    const newStatus = statusFlow[currentStatus]

    setUpdatingField({ orderId, field: 'status' })
    try {
      await ordersApi.update(orderId, { status: newStatus })
      
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order
      ))
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, updated_at: new Date().toISOString() })
      }
      
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingField(null)
    }
  },[])

  const handleUrgencyToggle = useCallback(async (orderId: string, currentUrgency: boolean) => {
    setUpdatingField({ orderId, field: 'urgency' })
    try {
      await ordersApi.update(orderId, { urgency: !currentUrgency })
      
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, urgency: !currentUrgency, updated_at: new Date().toISOString() } : order
      ))
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, urgency: !currentUrgency, updated_at: new Date().toISOString() })
      }
      
      toast.success('Urgency updated successfully')
    } catch (err) {
      toast.error('Failed to update urgency')
    } finally {
      setUpdatingField(null)
    }
  },[])

  const handleDeliverySave = async (orderId: string) => {
    if (!deliveryValue) {
      setEditingDelivery(null)
      return
    }

    setUpdatingField({ orderId, field: 'delivery_time' })
    try {
      const newDelivery = new Date(deliveryValue).toISOString()
      await ordersApi.update(orderId, { delivery_time: newDelivery })
      
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, delivery_time: newDelivery, updated_at: new Date().toISOString() } : order
      ))
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, delivery_time: newDelivery, updated_at: new Date().toISOString() })
      }
      
      toast.success('Delivery time updated successfully')
      setEditingDelivery(null)
    } catch (err) {
      toast.error('Failed to update delivery time')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleRoleSave = async (orderId: string) => {
    if (!roleValue.trim()) {
      setEditingRole(null)
      return
    }

    setUpdatingField({ orderId, field: 'assigned_role' })
    try {
      await ordersApi.update(orderId, { assigned_role: roleValue.trim() })
      
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() } : order
      ))
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, assigned_role: roleValue.trim(), updated_at: new Date().toISOString() })
      }
      
      toast.success('Assigned role updated successfully')
      setEditingRole(null)
    } catch (err) {
      toast.error('Failed to update assigned role')
    } finally {
      setUpdatingField(null)
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
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

  const formatCurrency = (amount?: number | null, currency?: string) => {
    if (!amount) return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'in_progress': return 'info'
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
          { label: 'Pending', value: 'pending' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' }
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

  const columns: DataTableColumn<Order>[] = useMemo(
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
        minWidth: 200,
        render: (order) => (
          <div>
            <div className="fw-semibold">{order.customer_name}</div>
            <div className="text-muted small">{order.customer_phone}</div>
          </div>
        )
      },
      {
        key: 'order_details',
        header: 'Order Details',
        minWidth: 250,
        render: (order) => (
          <div>
            <div className="fw-medium">
              {order.order_details.substring(0, 60)}
              {order.order_details.length > 60 ? '...' : ''}
            </div>
            {order.total_amount && (
              <div className="text-success fw-semibold small">
                {formatCurrency(order.total_amount, order.currency)}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'urgency',
        header: 'Urgency',
        width: 110,
        render: (order) => (
          <div
            onClick={() => updatingField?.orderId !== order.id && handleUrgencyToggle(order.id, order.urgency)}
            style={{ cursor: updatingField?.orderId === order.id ? 'not-allowed' : 'pointer' }}
            title="Click to toggle urgency"
          >
            <Badge
              bg={order.urgency ? 'danger' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.orderId === order.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.orderId === order.id && updatingField.field === 'urgency' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span className="small">...</span>
                </>
              ) : (
                <>
                  {order.urgency ? 'URGENT' : 'NORMAL'}
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
        render: (order) => (
          <div
            onClick={() => updatingField?.orderId !== order.id && handleStatusToggle(order.id, order.status)}
            style={{ cursor: updatingField?.orderId === order.id ? 'not-allowed' : 'pointer' }}
            title="Click to cycle status"
          >
            <Badge
              bg={getStatusVariant(order.status)}
              className="text-capitalize d-inline-flex align-items-center gap-1"
              style={{
                cursor: updatingField?.orderId === order.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {updatingField?.orderId === order.id && updatingField.field === 'status' ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Updating...
                </>
              ) : (
                <>
                  {order.status.replace('_', ' ')}
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
        render: (order) => (
          order.assigned_role ? (
            <Badge bg="light" text="dark" className="text-capitalize">
              {order.assigned_role}
            </Badge>
          ) : (
            <span className="text-muted">Unassigned</span>
          )
        )
      },
      {
        key: 'delivery_time',
        header: 'Delivery Time',
        width: 180,
        render: (order) => formatDate(order.delivery_time)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 100,
        align: 'center',
        sticky: 'right',
        render: (order) => (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleViewOrder(order)}
            title="View details"
          >
            <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
          </Button>
        )
      }
    ],
    [updatingField, startIndex, handleStatusToggle, handleUrgencyToggle]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Orders</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Orders</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="orders-table"
            title="All Orders"
            description="Manage customer orders received through calls or online."
            columns={columns}
            data={orders}
            rowKey={(order) => order.id}
            loading={loading}
            error={error}
            onRetry={fetchOrders}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search by customer or order details...'
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
              title: 'No orders found',
              description: 'Orders will appear here as they are placed.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Order ID</label>
                  <div className="fw-medium font-monospace small">{selectedOrder.id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Call ID</label>
                  <div className="fw-medium font-monospace small">{selectedOrder.call_id || '—'}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Urgency</label>
                  <div>
                    <div
                      onClick={() => handleUrgencyToggle(selectedOrder.id, selectedOrder.urgency)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to toggle"
                    >
                      <Badge
                        bg={selectedOrder.urgency ? 'danger' : 'secondary'}
                        className="d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.orderId === selectedOrder.id && updatingField.field === 'urgency' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            <span className="small">Updating...</span>
                          </>
                        ) : (
                          <>
                            {selectedOrder.urgency ? 'URGENT' : 'NORMAL'}
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
                      onClick={() => handleStatusToggle(selectedOrder.id, selectedOrder.status)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title="Click to cycle status"
                    >
                      <Badge
                        bg={getStatusVariant(selectedOrder.status)}
                        className="text-capitalize d-inline-flex align-items-center gap-1"
                        style={{ cursor: 'pointer' }}
                      >
                        {updatingField?.orderId === selectedOrder.id && updatingField.field === 'status' ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {selectedOrder.status.replace('_', ' ')}
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
                          setEditingRole(selectedOrder.id)
                          setRoleValue(selectedOrder.assigned_role || '')
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingRole === selectedOrder.id ? (
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
                        onClick={() => handleRoleSave(selectedOrder.id)}
                        disabled={updatingField?.orderId === selectedOrder.id}
                      >
                        {updatingField?.orderId === selectedOrder.id && updatingField.field === 'assigned_role' ? (
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
                    <div>{selectedOrder.assigned_role || '—'}</div>
                  )}
                </Col>
                <Col md={12}>
                  <label className="text-muted small d-flex align-items-center justify-content-between">
                    <span>Delivery Time</span>
                    {!editingDelivery && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => {
                          setEditingDelivery(selectedOrder.id)
                          setDeliveryValue(formatDateInput(selectedOrder.delivery_time))
                        }}
                      >
                        <IconifyIcon icon="solar:pen-linear" width={14} height={14} />
                      </Button>
                    )}
                  </label>
                  {editingDelivery === selectedOrder.id ? (
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="datetime-local"
                        size="sm"
                        value={deliveryValue}
                        onChange={(e) => setDeliveryValue(e.target.value)}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDeliverySave(selectedOrder.id)}
                        disabled={updatingField?.orderId === selectedOrder.id}
                      >
                        {updatingField?.orderId === selectedOrder.id && updatingField.field === 'delivery_time' ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <IconifyIcon icon="solar:check-circle-linear" width={16} height={16} />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingDelivery(null)}
                      >
                        <IconifyIcon icon="solar:close-circle-linear" width={16} height={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="fw-medium">{formatDate(selectedOrder.delivery_time)}</div>
                  )}
                </Col>
                {selectedOrder.total_amount && (
                  <Col md={12}>
                    <label className="text-muted small">Total Amount</label>
                    <div className="fw-semibold fs-5 text-success">
                      {formatCurrency(selectedOrder.total_amount, selectedOrder.currency)}
                    </div>
                  </Col>
                )}
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Customer Information</label>
                <div className="mt-2">
                  <div className="fw-semibold fs-5">{selectedOrder.customer_name}</div>
                  <div className="text-muted">
                    <IconifyIcon icon="solar:phone-linear" width={16} height={16} className="me-1" />
                    {selectedOrder.customer_phone}
                  </div>
                  {selectedOrder.customer_email && (
                    <div className="text-muted">
                      <IconifyIcon icon="solar:letter-linear" width={16} height={16} className="me-1" />
                      {selectedOrder.customer_email}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Order Details</label>
                <p className="mb-0 fw-medium">{selectedOrder.order_details}</p>
              </div>
              {selectedOrder.special_instructions && (
                <div className="mb-3">
                  <label className="text-muted small">Special Instructions</label>
                  <p className="mb-0">{selectedOrder.special_instructions}</p>
                </div>
              )}
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Created At</label>
                  <div>{formatDate(selectedOrder.created_at)}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedOrder.updated_at)}</div>
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

export default OrdersPage