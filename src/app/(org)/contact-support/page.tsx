'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { supportApi, type SupportTicket, type SupportTicketsListParams, type CreateSupportTicketRequest } from '@/api/org/support'

type TicketFormState = {
  type: SupportTicket['type']
  priority: SupportTicket['priority']
  subject: string
  description: string
}

const DEFAULT_FORM_STATE: TicketFormState = {
  type: 'technical',
  priority: 'medium',
  subject: '',
  description: ''
}

const ContactSupportPage = () => {
  const { token, user, isAuthenticated } = useAuth()

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const [formState, setFormState] = useState<TicketFormState>(DEFAULT_FORM_STATE)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TicketFormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, typeFilter])

  const fetchTickets = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const params: SupportTicketsListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
      }

      if (statusFilter !== 'all') params.status_filter = statusFilter as any
      if (typeFilter !== 'all') params.type_filter = typeFilter as any

      const response = await supportApi.list(params)
      setTickets(response.tickets)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load support tickets.')
      toast.error('Failed to load support tickets')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, statusFilter, typeFilter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof TicketFormState]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof TicketFormState, string>> = {}

    if (!formState.subject.trim()) {
      nextErrors.subject = 'Subject is required.'
    }

    if (!formState.description.trim()) {
      nextErrors.description = 'Description is required.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return
    if (!token || !isAuthenticated || !user) {
      toast.error('You must be logged in to create a support ticket.')
      return
    }

    setSubmitting(true)
    try {
      const requestData: CreateSupportTicketRequest = {
        type: formState.type,
        priority: formState.priority,
        subject: formState.subject.trim(),
        description: formState.description.trim(),
      }

      await supportApi.create(requestData)
      toast.success('Support ticket created successfully')
      setCreateModalOpen(false)
      setFormState(DEFAULT_FORM_STATE)
      setFormErrors({})
      fetchTickets()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || 'Unable to create support ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'primary'
      case 'in_progress': return 'info'
      case 'waiting_on_user': return 'warning'
      case 'resolved': return 'success'
      case 'closed': return 'secondary'
      default: return 'secondary'
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'success'
      case 'medium': return 'info'
      case 'high': return 'warning'
      case 'urgent': return 'danger'
      default: return 'secondary'
    }
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'bug': return 'danger'
      case 'billing': return 'warning'
      case 'feature_request': return 'info'
      case 'technical': return 'primary'
      case 'other': return 'secondary'
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
          { label: 'Open', value: 'open' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Waiting on User', value: 'waiting_on_user' },
          { label: 'Resolved', value: 'resolved' },
          { label: 'Closed', value: 'closed' }
        ],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 4
      },
      {
        id: 'type-filter',
        label: 'Type',
        type: 'select',
        value: typeFilter === 'all' ? '' : typeFilter,
        options: [
          { label: 'All types', value: '' },
          { label: 'Bug', value: 'bug' },
          { label: 'Billing', value: 'billing' },
          { label: 'Feature Request', value: 'feature_request' },
          { label: 'Technical', value: 'technical' },
          { label: 'Other', value: 'other' }
        ],
        onChange: (value) => setTypeFilter(value || 'all'),
        onClear: () => setTypeFilter('all'),
        width: 4
      }
    ],
    [statusFilter, typeFilter]
  )

  const columns: DataTableColumn<SupportTicket>[] = useMemo(
    () => [
      {
        key: 'serial',
        header: '#',
        width: 60,
        render: (_, { rowIndex }) => <span className="text-muted">{startIndex + rowIndex + 1}</span>
      },
      {
        key: 'subject',
        header: 'Subject',
        minWidth: 300,
        render: (ticket) => (
          <div>
            <div className="fw-semibold">{ticket.subject}</div>
            <small className="text-muted d-block">
              Ticket ID: {ticket.id}
            </small>
          </div>
        )
      },
      {
        key: 'type',
        header: 'Type',
        width: 150,
        render: (ticket) => (
          <Badge bg={getTypeVariant(ticket.type)} className="text-capitalize">
            {ticket.type.replace('_', ' ')}
          </Badge>
        )
      },
      {
        key: 'priority',
        header: 'Priority',
        width: 120,
        render: (ticket) => (
          <Badge bg={getPriorityVariant(ticket.priority)} className="text-uppercase">
            {ticket.priority}
          </Badge>
        )
      },
      {
        key: 'status',
        header: 'Status',
        width: 150,
        render: (ticket) => (
          <Badge bg={getStatusVariant(ticket.status)} className="text-capitalize">
            {ticket.status.replace('_', ' ')}
          </Badge>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        width: 180,
        render: (ticket) => formatDate(ticket.created_at)
      },
      {
        key: 'updated_at',
        header: 'Last Updated',
        width: 180,
        render: (ticket) => formatDate(ticket.updated_at)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 100,
        align: 'center',
        sticky: 'right',
        render: (ticket) => (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleViewTicket(ticket)}
            title="View details"
          >
            <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
          </Button>
        )
      }
    ],
    [startIndex]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-2">Contact Support</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">AI Assistant</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Support</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className="">
        <Col lg={4} className="mb-3">
          <Card className="h-100">
            <CardBody className="text-center">
              <IconifyIcon icon="solar:letter-linear" width={48} height={48} className="text-primary mb-3" />
              <h5>Email Support</h5>
              <p className="text-muted small">Send us an email and we will get back to you within 24 hours.</p>
              <div className="fw-semibold mb-2">support@voiceassistant.com</div>
              <a href="mailto:support@voiceassistant.com" className="btn btn-outline-primary btn-sm">
                <IconifyIcon icon="solar:letter-linear" width={16} height={16} className="me-1" />
                Send Email
              </a>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card className="h-100">
            <CardBody className="text-center">
              <IconifyIcon icon="solar:phone-calling-linear" width={48} height={48} className="text-success mb-3" />
              <h5>Phone Support</h5>
              <p className="text-muted small">Call us during business hours for immediate assistance.</p>
              <div className="fw-semibold mb-1">+1 (555) 123-4567</div>
              <div className="text-muted small mb-2">Mon-Fri 9AM-6PM EST</div>
              <a href="tel:+15551234567" className="btn btn-outline-success btn-sm">
                <IconifyIcon icon="solar:phone-calling-linear" width={16} height={16} className="me-1" />
                Call Now
              </a>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card className="h-100">
            <CardBody className="text-center">
              <IconifyIcon icon="solar:chat-round-linear" width={48} height={48} className="text-info mb-3" />
              <h5>Live Chat</h5>
              <p className="text-muted small">Chat with our support team in real-time.</p>
              <div className="mb-2">
                <Badge bg="success" className="me-2">
                  <span className="badge-dot bg-white me-1"></span>
                  Online
                </Badge>
              </div>
              <div className="text-muted small mb-2">Mon-Fri 9AM-6PM EST</div>
              <Button variant="outline-info" size="sm" disabled>
                <IconifyIcon icon="solar:chat-round-linear" width={16} height={16} className="me-1" />
                Start Chat
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <CardTitle as="h5">Quick Help</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="mb-2">Before contacting support, try these solutions:</p>
              <ul className="mb-0">
                <li>Check the FAQ section for common solutions</li>
                <li>Verify your agent configuration in Agent Settings</li>
                <li>Ensure your phone number is properly set up</li>
                <li>Check if the system is online and operational</li>
                <li>Review recent call logs for any error messages</li>
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <DataTable
            id="support-tickets-table"
            title="My Support Tickets"
            description="Track and manage your support requests."
            columns={columns}
            data={tickets}
            rowKey={(ticket) => ticket.id}
            loading={loading}
            error={error}
            onRetry={fetchTickets}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search tickets...'
              },
              filters: toolbarFilters,
              extra: (
                <Button
                  variant="primary"
                  onClick={() => setCreateModalOpen(true)}
                  className="d-inline-flex align-items-center gap-2"
                >
                  <IconifyIcon icon="solar:add-circle-bold" width={18} height={18} />
                  New Ticket
                </Button>
              )
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
              title: 'No support tickets',
              description: 'You haven\'t created any support tickets yet. Click "New Ticket" to get started.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      <Modal show={createModalOpen} onHide={() => setCreateModalOpen(false)} size="lg" centered backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Support Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="ticket-type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" value={formState.type} onChange={handleFieldChange}>
                    <option value="technical">Technical</option>
                    <option value="bug">Bug Report</option>
                    <option value="billing">Billing</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="ticket-priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select name="priority" value={formState.priority} onChange={handleFieldChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="ticket-subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    name="subject"
                    value={formState.subject}
                    onChange={handleFieldChange}
                    isInvalid={Boolean(formErrors.subject)}
                    placeholder="Brief description of your issue"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.subject}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="ticket-description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    value={formState.description}
                    onChange={handleFieldChange}
                    isInvalid={Boolean(formErrors.description)}
                    placeholder="Please provide as much detail as possible about your issue..."
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="link" onClick={() => setCreateModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting} className="d-inline-flex align-items-center gap-2">
              {submitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
              Create Ticket
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Ticket ID</label>
                  <div className="fw-medium font-monospace small">{selectedTicket.id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Status</label>
                  <div>
                    <Badge bg={getStatusVariant(selectedTicket.status)} className="text-capitalize">
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </Col>
                <Col md={4}>
                  <label className="text-muted small">Type</label>
                  <div>
                    <Badge bg={getTypeVariant(selectedTicket.type)} className="text-capitalize">
                      {selectedTicket.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </Col>
                <Col md={4}>
                  <label className="text-muted small">Priority</label>
                  <div>
                    <Badge bg={getPriorityVariant(selectedTicket.priority)} className="text-uppercase">
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </Col>
                <Col md={4}>
                  <label className="text-muted small">Created</label>
                  <div className="small">{formatDate(selectedTicket.created_at)}</div>
                </Col>
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Subject</label>
                <h5>{selectedTicket.subject}</h5>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Description</label>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</p>
              </div>
              {selectedTicket.closed_at && (
                <>
                  <hr />
                  <Row className="g-3">
                    <Col md={6}>
                      <label className="text-muted small">Last Updated</label>
                      <div>{formatDate(selectedTicket.updated_at)}</div>
                    </Col>
                    <Col md={6}>
                      <label className="text-muted small">Closed At</label>
                      <div>{formatDate(selectedTicket.closed_at)}</div>
                    </Col>
                  </Row>
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
    </>
  )
}

export default ContactSupportPage

export const dynamic = 'force-dynamic'
