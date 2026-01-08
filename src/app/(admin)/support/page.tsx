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

type SupportTicket = {
  _id: string
  org_id?: string | null
  org_name?: string
  created_by_user_id: string
  created_by_name?: string
  created_by_email?: string
  type: 'bug' | 'billing' | 'feature_request' | 'technical' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed'
  attachments?: {
    file_url: string
    file_name: string
  }[]
  internal_notes?: {
    note: string
    added_by_user_id: string
    added_by_name?: string
    created_at: string
  }[]
  created_at: string
  updated_at: string
  closed_at?: string | null
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    _id: 'ticket_001',
    org_id: 'org_001',
    org_name: 'TechCorp Solutions',
    created_by_user_id: 'user_001',
    created_by_name: 'John Smith',
    created_by_email: 'john.smith@techcorp.com',
    type: 'technical',
    priority: 'high',
    subject: 'Unable to view call transcripts',
    description: 'When I click on a call in the call logs, the transcript modal opens but shows a blank screen. This started happening yesterday after the latest update.',
    status: 'in_progress',
    attachments: [],
    internal_notes: [
      {
        note: 'Investigating the issue. Seems to be related to the new UI update.',
        added_by_user_id: 'admin_001',
        added_by_name: 'Support Team',
        created_at: '2024-12-18T14:20:00Z'
      }
    ],
    created_at: '2024-12-18T10:30:00Z',
    updated_at: '2024-12-18T14:20:00Z',
    closed_at: null
  },
  {
    _id: 'ticket_002',
    org_id: 'org_002',
    org_name: 'Dental Care Plus',
    created_by_user_id: 'user_002',
    created_by_name: 'Sarah Johnson',
    created_by_email: 'sarah@dentalcare.com',
    type: 'billing',
    priority: 'medium',
    subject: 'Question about monthly charges',
    description: 'I noticed my bill is higher this month. Can you help me understand what caused the increase? We had more calls than usual.',
    status: 'resolved',
    attachments: [],
    internal_notes: [
      {
        note: 'Explained the overage charges. Customer understood.',
        added_by_user_id: 'admin_002',
        added_by_name: 'Billing Team',
        created_at: '2024-12-16T11:30:00Z'
      }
    ],
    created_at: '2024-12-15T09:00:00Z',
    updated_at: '2024-12-16T11:30:00Z',
    closed_at: '2024-12-16T11:30:00Z'
  },
  {
    _id: 'ticket_003',
    org_id: 'org_003',
    org_name: 'Gourmet Delights Restaurant',
    created_by_user_id: 'user_003',
    created_by_name: 'Michael Chen',
    created_by_email: 'michael@gourmetdelights.com',
    type: 'feature_request',
    priority: 'low',
    subject: 'Add export to Excel feature',
    description: 'It would be great if we could export call logs directly to Excel format instead of just CSV. This would help with our reporting.',
    status: 'open',
    attachments: [],
    internal_notes: [],
    created_at: '2024-12-17T14:00:00Z',
    updated_at: '2024-12-17T14:00:00Z',
    closed_at: null
  },
  {
    _id: 'ticket_004',
    org_id: 'org_001',
    org_name: 'TechCorp Solutions',
    created_by_user_id: 'user_001',
    created_by_name: 'John Smith',
    created_by_email: 'john.smith@techcorp.com',
    type: 'bug',
    priority: 'urgent',
    subject: 'System not receiving calls',
    description: 'Our phone system is not receiving any calls since this morning. This is critical as we cannot serve our customers.',
    status: 'open',
    attachments: [],
    internal_notes: [],
    created_at: '2024-12-20T08:15:00Z',
    updated_at: '2024-12-20T08:15:00Z',
    closed_at: null
  },
  {
    _id: 'ticket_005',
    org_id: 'org_004',
    org_name: 'Style & Shine Salon',
    created_by_user_id: 'user_004',
    created_by_name: 'Emma Rodriguez',
    created_by_email: 'emma@styleshine.com',
    type: 'billing',
    priority: 'high',
    subject: 'Payment method update needed',
    description: 'Need to update our payment method. The current card is expiring soon.',
    status: 'waiting_on_user',
    attachments: [],
    internal_notes: [
      {
        note: 'Sent instructions for updating payment method via Stripe portal.',
        added_by_user_id: 'admin_002',
        added_by_name: 'Billing Team',
        created_at: '2024-12-19T10:00:00Z'
      }
    ],
    created_at: '2024-12-19T09:30:00Z',
    updated_at: '2024-12-19T10:00:00Z',
    closed_at: null
  },
  {
    _id: 'ticket_006',
    org_id: null,
    org_name: 'Platform Level',
    created_by_user_id: 'user_005',
    created_by_name: 'David Wilson',
    created_by_email: 'david@example.com',
    type: 'other',
    priority: 'low',
    subject: 'General inquiry about features',
    description: 'I am interested in learning more about the premium features before upgrading.',
    status: 'resolved',
    attachments: [],
    internal_notes: [
      {
        note: 'Provided feature comparison and pricing details.',
        added_by_user_id: 'admin_003',
        added_by_name: 'Sales Team',
        created_at: '2024-12-18T15:00:00Z'
      }
    ],
    created_at: '2024-12-18T14:00:00Z',
    updated_at: '2024-12-18T15:00:00Z',
    closed_at: '2024-12-18T15:00:00Z'
  }
]

const AdminSupportTicketsPage = () => {
  const router = useRouter()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [orgFilter, setOrgFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null)

  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, typeFilter, priorityFilter, orgFilter])

  const fetchTickets = useCallback(async () => {
    if (!token || !isAdmin) return
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setTickets(MOCK_TICKETS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load support tickets.')
    } finally {
      setLoading(false)
    }
  }, [token, isAdmin])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const organizations = useMemo(() => {
    const orgs = new Set<string>()
    tickets.forEach(ticket => {
      if (ticket.org_name) {
        orgs.add(ticket.org_name)
      }
    })
    return Array.from(orgs).sort()
  }, [tickets])

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        !debouncedSearch ||
        ticket.subject.toLowerCase().includes(debouncedSearch) ||
        ticket.description.toLowerCase().includes(debouncedSearch) ||
        (ticket.org_name ?? '').toLowerCase().includes(debouncedSearch) ||
        (ticket.created_by_name ?? '').toLowerCase().includes(debouncedSearch)

      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
      const matchesType = typeFilter === 'all' || ticket.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
      const matchesOrg = orgFilter === 'all' || ticket.org_name === orgFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesOrg
    })
  }, [tickets, debouncedSearch, statusFilter, typeFilter, priorityFilter, orgFilter])

  const totalRecords = filteredTickets.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusChange = async (ticketId: string, newStatus: SupportTicket['status']) => {
    setUpdatingTicketId(ticketId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updates: Partial<SupportTicket> = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      }
      
      if (newStatus === 'closed' || newStatus === 'resolved') {
        updates.closed_at = new Date().toISOString()
      }
      
      setTickets(prev => prev.map(ticket =>
        ticket._id === ticketId ? { ...ticket, ...updates } : ticket
      ))
      
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, ...updates })
      }
      
      toast.success('Ticket status updated successfully')
    } catch (err) {
      toast.error('Failed to update ticket status')
    } finally {
      setUpdatingTicketId(null)
    }
  }

  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedTicket) return

    setAddingNote(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const newNote = {
        note: noteText.trim(),
        added_by_user_id: user?._id || 'admin',
        added_by_name: user?.name || 'Admin',
        created_at: new Date().toISOString()
      }

      const updatedTicket = {
        ...selectedTicket,
        internal_notes: [...(selectedTicket.internal_notes || []), newNote],
        updated_at: new Date().toISOString()
      }

      setTickets(prev => prev.map(ticket =>
        ticket._id === selectedTicket._id ? updatedTicket : ticket
      ))
      
      setSelectedTicket(updatedTicket)
      setNoteText('')
      setNoteModalOpen(false)
      toast.success('Note added successfully')
    } catch (err) {
      toast.error('Failed to add note')
    } finally {
      setAddingNote(false)
    }
  }

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setViewModalOpen(true)
  }

  const handleViewOrganization = useCallback((orgId: string | null) => {
    if (orgId) {
      router.push(`/organizations/${orgId}/details`)
    }
  },[router])

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
        width: 3
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
        width: 3
      },
      {
        id: 'priority-filter',
        label: 'Priority',
        type: 'select',
        value: priorityFilter === 'all' ? '' : priorityFilter,
        options: [
          { label: 'All priorities', value: '' },
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Urgent', value: 'urgent' }
        ],
        onChange: (value) => setPriorityFilter(value || 'all'),
        onClear: () => setPriorityFilter('all'),
        width: 3
      },
      {
        id: 'org-filter',
        label: 'Organization',
        type: 'select',
        value: orgFilter === 'all' ? '' : orgFilter,
        options: [
          { label: 'All organizations', value: '' },
          ...organizations.map(org => ({ label: org, value: org }))
        ],
        onChange: (value) => setOrgFilter(value || 'all'),
        onClear: () => setOrgFilter('all'),
        width: 3
      }
    ],
    [statusFilter, typeFilter, priorityFilter, orgFilter, organizations]
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
        key: 'ticket_info',
        header: 'Ticket',
        minWidth: 280,
        render: (ticket) => (
          <div>
            <div className="fw-semibold">{ticket.subject}</div>
            <small className="text-muted d-block">ID: {ticket._id}</small>
            <small className="text-muted d-block">
              By: {ticket.created_by_name || 'Unknown'}
            </small>
          </div>
        )
      },
      {
        key: 'organization',
        header: 'Organization',
        width: 200,
        render: (ticket) => (
          <div>
            <div className="fw-medium">{ticket.org_name || 'Platform Level'}</div>
            {ticket.org_id && (
              <Button
                size="sm"
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => handleViewOrganization(ticket.org_id!)}
              >
                <IconifyIcon icon="solar:arrow-right-linear" width={14} height={14} className="me-1" />
                View Details
              </Button>
            )}
          </div>
        )
      },
      {
        key: 'type',
        header: 'Type',
        width: 140,
        render: (ticket) => (
          <Badge bg={getTypeVariant(ticket.type)} className="text-capitalize">
            {ticket.type.replace('_', ' ')}
          </Badge>
        )
      },
      {
        key: 'priority',
        header: 'Priority',
        width: 110,
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
        width: 160,
        render: (ticket) => formatDate(ticket.created_at)
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
    [startIndex, handleViewOrganization]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-2">Support Tickets Management</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">AI Assistant</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Support Tickets</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="admin-support-tickets-table"
            title="All Support Tickets"
            description="View and manage support tickets from all organizations."
            columns={columns}
            data={paginatedTickets}
            rowKey={(ticket) => ticket._id}
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
                placeholder: 'Search tickets, organizations, or users...'
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
              title: 'No support tickets',
              description: 'No support tickets have been created yet.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Support Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Ticket ID</label>
                  <div className="fw-medium font-monospace small">{selectedTicket._id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Status</label>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={getStatusVariant(selectedTicket.status)} className="text-capitalize">
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                    <Form.Select
                      size="sm"
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value as SupportTicket['status'])}
                      disabled={updatingTicketId === selectedTicket._id}
                      style={{ width: 'auto' }}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_on_user">Waiting on User</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </Form.Select>
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
                <label className="text-muted small d-flex align-items-center justify-content-between">
                  <span>Organization</span>
                  {selectedTicket.org_id && (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleViewOrganization(selectedTicket.org_id!)}
                      className="d-inline-flex align-items-center gap-1"
                    >
                      <IconifyIcon icon="solar:buildings-linear" width={14} height={14} />
                      View Organization
                    </Button>
                  )}
                </label>
                <div className="fw-semibold fs-5">{selectedTicket.org_name || 'Platform Level'}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Created By</label>
                <div className="fw-medium">{selectedTicket.created_by_name || 'Unknown'}</div>
                {selectedTicket.created_by_email && (
                  <div className="text-muted small">{selectedTicket.created_by_email}</div>
                )}
              </div>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Subject</label>
                <h5>{selectedTicket.subject}</h5>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Description</label>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</p>
              </div>
              <hr />
              <div className="mb-3">
                <label className="text-muted small d-flex align-items-center justify-content-between">
                  <span>Internal Notes ({selectedTicket.internal_notes?.length || 0})</span>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => setNoteModalOpen(true)}
                    className="d-inline-flex align-items-center gap-1"
                  >
                    <IconifyIcon icon="solar:add-circle-linear" width={14} height={14} />
                    Add Note
                  </Button>
                </label>
                {selectedTicket.internal_notes && selectedTicket.internal_notes.length > 0 ? (
                  <div className="mt-2">
                    {selectedTicket.internal_notes.map((note, index) => (
                      <div key={index} className="border rounded p-3 mb-2 bg-body-tertiary">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="fw-medium">{note.added_by_name || 'Admin'}</div>
                          <small className="text-muted">{formatDate(note.created_at)}</small>
                        </div>
                        <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>{note.note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted text-center py-3 border rounded">
                    No internal notes yet
                  </div>
                )}
              </div>
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedTicket.updated_at)}</div>
                </Col>
                {selectedTicket.closed_at && (
                  <Col md={6}>
                    <label className="text-muted small">Closed At</label>
                    <div>{formatDate(selectedTicket.closed_at)}</div>
                  </Col>
                )}
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

      <Modal show={noteModalOpen} onHide={() => setNoteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Internal Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your internal note here..."
            />
            <Form.Text className="text-muted">
              Internal notes are only visible to admin users.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="link" onClick={() => setNoteModalOpen(false)} disabled={addingNote}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddNote}
            disabled={addingNote || !noteText.trim()}
            className="d-inline-flex align-items-center gap-2"
          >
            {addingNote && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
            Add Note
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminSupportTicketsPage


export const dynamic = 'force-dynamic'
