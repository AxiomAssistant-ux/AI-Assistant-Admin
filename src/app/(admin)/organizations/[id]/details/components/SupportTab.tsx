'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    Modal,
    Row
} from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

type SupportTicket = {
    _id: string
    org_id: string
    created_by_user_id: string
    type: 'bug' | 'billing' | 'feature_request' | 'technical' | 'other'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    subject: string
    description: string
    status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed'
    created_at: string
    updated_at: string
    closed_at?: string
}

type OrganizationDetails = {
    _id: string
    company_name: string
}

type SupportTabProps = {
    organization: OrganizationDetails
    onRefresh: () => Promise<void>
}

// Mock support tickets data
const MOCK_TICKETS: SupportTicket[] = [
    {
        _id: 'ticket_001',
        org_id: 'org_001',
        created_by_user_id: 'user_001',
        type: 'technical',
        priority: 'high',
        subject: 'Agent not responding to calls',
        description: 'Our customer support agent has stopped responding to incoming calls since yesterday.',
        status: 'in_progress',
        created_at: '2024-12-18T10:30:00Z',
        updated_at: '2024-12-18T14:20:00Z'
    },
    {
        _id: 'ticket_002',
        org_id: 'org_001',
        created_by_user_id: 'user_001',
        type: 'billing',
        priority: 'medium',
        subject: 'Invoice clarification needed',
        description: 'We need clarification on the charges for additional minutes this month.',
        status: 'waiting_on_user',
        created_at: '2024-12-15T09:15:00Z',
        updated_at: '2024-12-16T11:30:00Z'
    },
    {
        _id: 'ticket_003',
        org_id: 'org_001',
        created_by_user_id: 'user_001',
        type: 'feature_request',
        priority: 'low',
        subject: 'Custom greeting messages',
        description: 'Would like to have the ability to set custom greeting messages for different time periods.',
        status: 'open',
        created_at: '2024-12-10T16:45:00Z',
        updated_at: '2024-12-10T16:45:00Z'
    },
    {
        _id: 'ticket_004',
        org_id: 'org_001',
        created_by_user_id: 'user_001',
        type: 'bug',
        priority: 'medium',
        subject: 'Dashboard metrics not updating',
        description: 'Call metrics on the dashboard are showing outdated information.',
        status: 'resolved',
        created_at: '2024-12-05T13:20:00Z',
        updated_at: '2024-12-08T10:15:00Z',
        closed_at: '2024-12-08T10:15:00Z'
    }
]

const SupportTab: React.FC<SupportTabProps> = ({ organization, onRefresh }) => {
    const { token } = useAuth()
    const [tickets, setTickets] = useState<SupportTicket[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [noteModalOpen, setNoteModalOpen] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<'all' | SupportTicket['status']>('all')

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true)
            try {
                // TODO: Replace with actual API call
                // const response = await supportApi.getTicketsByOrg(token, organization._id)
                // if (response.error) throw new Error(response.error)
                // setTickets(response.data)

                await new Promise(resolve => setTimeout(resolve, 500))
                setTickets(MOCK_TICKETS)
            } catch (err) {
                toast.error('Failed to load support tickets')
            } finally {
                setLoading(false)
            }
        }

        fetchTickets()
    }, [organization._id, token])

    const handleUpdateStatus = async (ticketId: string, newStatus: SupportTicket['status']) => {
        setUpdatingTicketId(ticketId)
        try {
            // TODO: Replace with actual API call
            // const response = await supportApi.updateTicketStatus(token, ticketId, newStatus)
            // if (response.error) throw new Error(response.error)

            await new Promise(resolve => setTimeout(resolve, 800))

            setTickets(prev => prev.map(ticket =>
                ticket._id === ticketId
                    ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
                    : ticket
            ))

            toast.success('Ticket status updated successfully')
            onRefresh()
        } catch (err) {
            toast.error('Failed to update ticket status')
        } finally {
            setUpdatingTicketId(null)
        }
    }

    const handleAddNote = async () => {
        if (!selectedTicket || !noteText.trim()) return

        try {
            // TODO: Replace with actual API call
            // const response = await supportApi.addNote(token, selectedTicket._id, noteText)
            // if (response.error) throw new Error(response.error)

            await new Promise(resolve => setTimeout(resolve, 500))

            toast.success('Internal note added successfully')
            setNoteModalOpen(false)
            setNoteText('')
            setSelectedTicket(null)
        } catch (err) {
            toast.error('Failed to add note')
        }
    }

    const handleViewTicket = (ticket: SupportTicket) => {
        setSelectedTicket(ticket)
        setViewModalOpen(true)
    }

    const handleOpenNoteModal = (ticket: SupportTicket) => {
        setSelectedTicket(ticket)
        setNoteModalOpen(true)
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

    const getStatusVariant = (status: SupportTicket['status']) => {
        switch (status) {
            case 'open':
                return 'primary'
            case 'in_progress':
                return 'info'
            case 'waiting_on_user':
                return 'warning'
            case 'resolved':
                return 'success'
            case 'closed':
                return 'secondary'
            default:
                return 'secondary'
        }
    }

    const getPriorityVariant = (priority: SupportTicket['priority']) => {
        switch (priority) {
            case 'low':
                return 'success'
            case 'medium':
                return 'warning'
            case 'high':
                return 'danger'
            case 'urgent':
                return 'danger'
            default:
                return 'secondary'
        }
    }

    const getTypeIcon = (type: SupportTicket['type']) => {
        switch (type) {
            case 'bug':
                return 'solar:bug-linear'
            case 'billing':
                return 'solar:card-linear'
            case 'feature_request':
                return 'solar:star-linear'
            case 'technical':
                return 'solar:settings-linear'
            default:
                return 'solar:info-circle-linear'
        }
    }

    const filteredTickets = statusFilter === 'all'
        ? tickets
        : tickets.filter(t => t.status === statusFilter)

    const ticketStats = {
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        waitingOnUser: tickets.filter(t => t.status === 'waiting_on_user').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Stats Cards */}
            <Row className="mb-3">
                <Col md={6} lg={3}>
                    <Card className="border-start border-primary border-3">
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted mb-1">Open</p>
                                    <h4 className="mb-0">{ticketStats.open}</h4>
                                </div>
                                <IconifyIcon icon="solar:inbox-linear" width={32} height={32} className="text-primary" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-start border-info border-3">
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted mb-1">In Progress</p>
                                    <h4 className="mb-0">{ticketStats.inProgress}</h4>
                                </div>
                                <IconifyIcon icon="solar:settings-linear" width={32} height={32} className="text-info" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-start border-warning border-3">
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted mb-1">Waiting</p>
                                    <h4 className="mb-0">{ticketStats.waitingOnUser}</h4>
                                </div>
                                <IconifyIcon icon="solar:clock-circle-linear" width={32} height={32} className="text-warning" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-start border-success border-3">
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted mb-1">Resolved</p>
                                    <h4 className="mb-0">{ticketStats.resolved}</h4>
                                </div>
                                <IconifyIcon icon="solar:check-circle-linear" width={32} height={32} className="text-success" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Support Actions */}
            <Card className="mb-4 border-0 shadow-sm">
                <CardHeader className="bg-transparent border-0 pb-0">
                    <CardTitle as="h5" className="mb-0">
                        Quick Actions
                    </CardTitle>
                    <small className="text-muted">
                        Perform common support operations quickly
                    </small>
                </CardHeader>

                <CardBody>
                    <Row className="g-3">
                        {[
                            {
                                title: 'Contact Customer',
                                desc: 'Reach out via chat or call',
                                icon: 'solar:chat-round-line-linear',
                                color: 'primary',
                            },
                            {
                                title: 'Flag for Review',
                                desc: 'Escalate ticket internally',
                                icon: 'solar:danger-triangle-linear',
                                color: 'warning',
                            },
                            {
                                title: 'Activity Log',
                                desc: 'View ticket history',
                                icon: 'solar:notes-linear',
                                color: 'info',
                            },
                            {
                                title: 'Send Email',
                                desc: 'Email ticket update',
                                icon: 'solar:letter-linear',
                                color: 'success',
                            },
                        ].map((action) => (
                            <Col md={6} lg={3} key={action.title}>
                                <div
                                    className="h-100 p-3 rounded border d-flex gap-3 align-items-start cursor-pointer"
                                    style={{
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = 'translateY(-3px)')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = 'translateY(0)')
                                    }
                                >
                                    <div
                                        className={`rounded-circle bg-${action.color} bg-opacity-10 text-${action.color} d-flex align-items-center justify-content-center`}
                                        style={{ width: 40, height: 40 }}
                                    >
                                        <IconifyIcon icon={action.icon} width={20} height={20} />
                                    </div>

                                    <div>
                                        <div className="fw-semibold">{action.title}</div>
                                        <small className="text-muted">{action.desc}</small>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>


            {/* Tickets Table */}
            <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                    <CardTitle as="h5" className="mb-0">Support Tickets</CardTitle>
                    <Form.Select
                        style={{ width: 'auto' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_on_user">Waiting on User</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </Form.Select>
                </CardHeader>
                <CardBody className="p-0">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-5">
                            <IconifyIcon icon="solar:inbox-linear" width={64} height={64} className="text-muted mb-3" />
                            <h5>No Support Tickets</h5>
                            <p className="text-muted">This organization has no support tickets yet</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }}></th>
                                        <th>Subject</th>
                                        <th>Type</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTickets.map((ticket) => (
                                        <tr key={ticket._id}>
                                            <td className="text-center">
                                                <IconifyIcon
                                                    icon={getTypeIcon(ticket.type)}
                                                    width={24}
                                                    height={24}
                                                    className="text-muted"
                                                />
                                            </td>
                                            <td>
                                                <div className="fw-medium">{ticket.subject}</div>
                                                <small className="text-muted">
                                                    {ticket.description.substring(0, 60)}
                                                    {ticket.description.length > 60 ? '...' : ''}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg="light" text="dark" className="text-capitalize">
                                                    {ticket.type.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge
                                                    bg={getPriorityVariant(ticket.priority)}
                                                    className="text-uppercase"
                                                >
                                                    {ticket.priority}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div
                                                    onClick={() => updatingTicketId !== ticket._id && handleUpdateStatus(
                                                        ticket._id,
                                                        ticket.status === 'open' ? 'in_progress' :
                                                            ticket.status === 'in_progress' ? 'resolved' :
                                                                ticket.status === 'resolved' ? 'closed' :
                                                                    'open'
                                                    )}
                                                    style={{ cursor: updatingTicketId === ticket._id ? 'not-allowed' : 'pointer' }}
                                                    title="Click to update status"
                                                >
                                                    <Badge
                                                        bg={getStatusVariant(ticket.status)}
                                                        className="text-capitalize"
                                                        style={{
                                                            transition: 'all 0.2s ease',
                                                            cursor: updatingTicketId === ticket._id ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {updatingTicketId === ticket._id ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1" role="status" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                {ticket.status.replace('_', ' ')}
                                                                <IconifyIcon
                                                                    icon="solar:alt-arrow-right-linear"
                                                                    width={12}
                                                                    height={12}
                                                                    className="ms-1"
                                                                />
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td>{formatDate(ticket.created_at)}</td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-secondary"
                                                        onClick={() => handleViewTicket(ticket)}
                                                        title="View details"
                                                    >
                                                        <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleOpenNoteModal(ticket)}
                                                        title="Add note"
                                                    >
                                                        <IconifyIcon icon="solar:notes-linear" width={16} height={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* View Ticket Modal */}
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
                                    <div className="fw-medium">{selectedTicket._id}</div>
                                </Col>
                                <Col md={6}>
                                    <label className="text-muted small">Created</label>
                                    <div>{formatDate(selectedTicket.created_at)}</div>
                                </Col>
                                <Col md={4}>
                                    <label className="text-muted small">Type</label>
                                    <div>
                                        <Badge bg="light" text="dark" className="text-capitalize">
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
                                    <label className="text-muted small">Status</label>
                                    <div>
                                        <Badge bg={getStatusVariant(selectedTicket.status)} className="text-capitalize">
                                            {selectedTicket.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <div className="mb-3">
                                <label className="text-muted small">Subject</label>
                                <h5>{selectedTicket.subject}</h5>
                            </div>
                            <div>
                                <label className="text-muted small">Description</label>
                                <p className="mb-0">{selectedTicket.description}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Note Modal */}
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
                            placeholder="Add internal notes about this ticket..."
                        />
                        <Form.Text className="text-muted">
                            This note will only be visible to administrators
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="link" onClick={() => setNoteModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddNote}
                        disabled={!noteText.trim()}
                    >
                        Add Note
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SupportTab

export const dynamic = 'force-dynamic'
