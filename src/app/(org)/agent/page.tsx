'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Spinner, Alert } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

// Types
interface Agent {
    id: string
    name: string
    provider: 'retell' | 'elevenlabs'
    phone_number: string
    language: string
    voice_name: string
    status: 'active' | 'inactive' | 'maintenance'
    created_at: string
    updated_at: string
}

interface KnowledgeBase {
    id: string
    agent_id: string
    name: string
    description: string
    file_name: string
    file_size: number
    file_type: string
    enabled: boolean
    created_at: string
    updated_at: string
}

interface CustomizationRequest {
    business_type: string
    primary_use_case: string
    desired_tone: string
    voice_preference: string
    conversation_behavior: string
    knowledge_usage: string
    welcome_message: string
    additional_notes: string
}

const AgentPage = () => {
    const { token, isAuthenticated } = useAuth()

    // Agent state
    const [agent, setAgent] = useState<Agent | null>(null)
    const [loadingAgent, setLoadingAgent] = useState(false)
    const [agentError, setAgentError] = useState<string | null>(null)

    // Knowledge base state
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
    const [loadingKnowledge, setLoadingKnowledge] = useState(false)

    // Customization modal state
    const [showCustomizationModal, setShowCustomizationModal] = useState(false)
    const [submittingCustomization, setSubmittingCustomization] = useState(false)
    const [customizationForm, setCustomizationForm] = useState<CustomizationRequest>({
        business_type: '',
        primary_use_case: '',
        desired_tone: 'professional',
        voice_preference: '',
        conversation_behavior: '',
        knowledge_usage: 'moderate',
        welcome_message: '',
        additional_notes: ''
    })


    // Add knowledge modal state
    const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false)
    const [submittingKnowledge, setSubmittingKnowledge] = useState(false)
    const [knowledgeForm, setKnowledgeForm] = useState({
        name: '',
        description: '',
        file: null as File | null
    })
    const [fileError, setFileError] = useState<string | null>(null)

    // Delete confirmation state
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingKnowledge, setDeletingKnowledge] = useState<KnowledgeBase | null>(null)

    // Fetch agent
    const fetchAgent = useCallback(async () => {
        if (!token || !isAuthenticated) return

        setLoadingAgent(true)
        setAgentError(null)

        try {
            // Mock API call - replace with actual endpoint
            // const response = await agentApi.getOrganizationAgent()

            // Mock data for demonstration
            await new Promise(resolve => setTimeout(resolve, 500))
            const mockAgent: Agent = {
                id: 'agent_123',
                name: 'Customer Support AI',
                provider: 'retell',
                phone_number: '+1 (555) 123-4567',
                language: 'en-US',
                voice_name: 'Professional Female',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            setAgent(mockAgent)
        } catch (err: any) {
            setAgentError(err?.response?.data?.detail || 'Failed to load agent')
            toast.error('Failed to load agent details')
        } finally {
            setLoadingAgent(false)
        }
    }, [token, isAuthenticated])

    // Fetch knowledge bases
    const fetchKnowledgeBases = useCallback(async () => {
        if (!token || !isAuthenticated || !agent) return

        setLoadingKnowledge(true)

        try {
            // Mock API call - replace with actual endpoint
            // const response = await knowledgeApi.list(agent.id)

            await new Promise(resolve => setTimeout(resolve, 300))
            const mockKnowledge: KnowledgeBase[] = [
                {
                    id: 'kb_1',
                    agent_id: agent.id,
                    name: 'Product Catalog',
                    description: 'Complete product information and specifications',
                    file_name: 'product_catalog.pdf',
                    file_size: 2456789,
                    file_type: 'application/pdf',
                    enabled: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'kb_2',
                    agent_id: agent.id,
                    name: 'FAQ Document',
                    description: 'Frequently asked questions and answers',
                    file_name: 'faq.txt',
                    file_size: 145678,
                    file_type: 'text/plain',
                    enabled: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]
            setKnowledgeBases(mockKnowledge)
        } catch (err) {
            console.error('Failed to load knowledge bases:', err)
        } finally {
            setLoadingKnowledge(false)
        }
    }, [token, isAuthenticated, agent])

    useEffect(() => {
        fetchAgent()
    }, [fetchAgent])

    useEffect(() => {
        if (agent) {
            fetchKnowledgeBases()
        }
    }, [fetchKnowledgeBases, agent])

    // Handle copy phone number
    const handleCopyPhone = () => {
        if (agent?.phone_number) {
            navigator.clipboard.writeText(agent.phone_number)
            toast.success('Phone number copied to clipboard')
        }
    }

    // Handle customization request submit
    const handleCustomizationSubmit = async () => {
        if (!customizationForm.business_type || !customizationForm.primary_use_case) {
            toast.error('Please fill in all required fields')
            return
        }

        setSubmittingCustomization(true)

        try {
            // Mock API call - replace with actual endpoint
            // await agentApi.requestCustomization(customizationForm)

            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success('Customization request submitted successfully! Our team will review it shortly.')
            setShowCustomizationModal(false)
            setCustomizationForm({
                business_type: '',
                primary_use_case: '',
                desired_tone: 'professional',
                voice_preference: '',
                conversation_behavior: '',
                welcome_message: '',
                knowledge_usage: 'moderate',
                additional_notes: ''
            })
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to submit customization request')
        } finally {
            setSubmittingCustomization(false)
        }
    }

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
            setFileError('Invalid file type. Only PDF, TXT, and DOCX files are allowed.')
            return
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            setFileError('File size exceeds 10MB limit.')
            return
        }

        setFileError(null)
        setKnowledgeForm(prev => ({ ...prev, file }))
    }

    // Handle add knowledge base
    const handleAddKnowledge = async () => {
        if (!knowledgeForm.name || !knowledgeForm.description || !knowledgeForm.file) {
            toast.error('Please fill in all required fields')
            return
        }

        setSubmittingKnowledge(true)

        try {
            // Mock API call - replace with actual endpoint
            // const formData = new FormData()
            // formData.append('name', knowledgeForm.name)
            // formData.append('description', knowledgeForm.description)
            // formData.append('file', knowledgeForm.file)
            // await knowledgeApi.create(agent!.id, formData)

            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success('Knowledge base added successfully!')
            setShowAddKnowledgeModal(false)
            setKnowledgeForm({ name: '', description: '', file: null })
            setFileError(null)
            fetchKnowledgeBases()
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to add knowledge base')
        } finally {
            setSubmittingKnowledge(false)
        }
    }

    // Handle toggle knowledge base
    const handleToggleKnowledge = async (kb: KnowledgeBase) => {
        try {
            // Mock API call - replace with actual endpoint
            // await knowledgeApi.toggle(kb.id, !kb.enabled)

            await new Promise(resolve => setTimeout(resolve, 300))

            setKnowledgeBases(prev =>
                prev.map(item =>
                    item.id === kb.id ? { ...item, enabled: !item.enabled } : item
                )
            )
            toast.success(`Knowledge base ${!kb.enabled ? 'enabled' : 'disabled'} successfully`)
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to update knowledge base')
        }
    }

    // Handle delete knowledge base
    const handleDeleteKnowledge = async () => {
        if (!deletingKnowledge) return

        try {
            // Mock API call - replace with actual endpoint
            // await knowledgeApi.delete(deletingKnowledge.id)

            await new Promise(resolve => setTimeout(resolve, 500))

            setKnowledgeBases(prev => prev.filter(kb => kb.id !== deletingKnowledge.id))
            toast.success('Knowledge base deleted successfully')
            setShowDeleteModal(false)
            setDeletingKnowledge(null)
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to delete knowledge base')
        }
    }

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active': return 'success'
            case 'inactive': return 'secondary'
            case 'maintenance': return 'warning'
            default: return 'secondary'
        }
    }

    // Get provider badge variant
    const getProviderVariant = (provider: string) => {
        switch (provider) {
            case 'retell': return 'primary'
            case 'elevenlabs': return 'info'
            default: return 'secondary'
        }
    }

    if (!isAuthenticated) {
        return (
            <Row>
                <Col xs={12}>
                    <div className="text-center py-5">
                        <p>Please sign in to view agent details.</p>
                        <Link href="/auth/sign-in">
                            <Button variant="primary">Sign In</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        )
    }

    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h4 className="mb-2">AI Agent</h4>
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link href="/">AI Assistant</Link>
                                </li>
                                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                                    <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                                </div>
                                <li className="breadcrumb-item active">Agent</li>
                            </ol>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setShowCustomizationModal(true)}
                            disabled={loadingAgent}
                        >
                            <IconifyIcon icon="solar:settings-linear" width={18} height={18} className="me-2" />
                            Request Customization
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Agent Details */}
            <Row className="mt-4">
                <Col xs={12}>
                    {loadingAgent ? (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="text-muted mt-3 mb-0">Loading agent details...</p>
                            </Card.Body>
                        </Card>
                    ) : agentError ? (
                        <Card className="border-danger">
                            <Card.Body className="text-center py-5">
                                <IconifyIcon icon="solar:danger-circle-linear" width={48} height={48} className="text-danger mb-3" />
                                <h5 className="text-danger">Failed to Load Agent</h5>
                                <p className="text-muted mb-3">{agentError}</p>
                                <Button variant="primary" onClick={fetchAgent}>
                                    <IconifyIcon icon="solar:refresh-linear" width={18} height={18} className="me-2" />
                                    Retry
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : agent ? (
                        <Card>
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <IconifyIcon icon="solar:user-speak-rounded-linear" width={24} height={24} className="me-2" />
                                        Agent Details
                                    </h5>
                                    <Badge bg={getStatusVariant(agent.status)} className="text-capitalize px-3 py-2">
                                        {agent.status}
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <label className="text-muted small d-block mb-1">Agent Name</label>
                                        <h5 className="mb-0">{agent.name}</h5>
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-muted small d-block mb-1">Provider</label>
                                        <Badge bg={getProviderVariant(agent.provider)} className="text-uppercase px-3 py-2">
                                            {agent.provider}
                                        </Badge>
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-muted small d-block mb-1">Phone Number</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <code className="bg-light px-2 py-1 rounded">{agent.phone_number}</code>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={handleCopyPhone}
                                                title="Copy to clipboard"
                                            >
                                                <IconifyIcon icon="solar:copy-linear" width={16} height={16} />
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-muted small d-block mb-1">Language</label>
                                        <div className="fw-medium">{agent.language}</div>
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-muted small d-block mb-1">Voice Name</label>
                                        <div className="fw-medium">{agent.voice_name}</div>
                                    </Col>
                                    <Col md={6}>
                                        <label className="text-muted small d-block mb-1">Agent ID</label>
                                        <code className="small">{agent.id}</code>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : null}
                </Col>
            </Row>

            {/* Knowledge Base Section */}
            {agent && (
                <Row className="mt-4">
                    <Col xs={12}>
                        <Card>
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <IconifyIcon icon="solar:book-linear" width={24} height={24} className="me-2" />
                                        Knowledge Base
                                    </h5>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setShowAddKnowledgeModal(true)}
                                    >
                                        <IconifyIcon icon="solar:add-circle-linear" width={18} height={18} className="me-2" />
                                        Add Knowledge
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {loadingKnowledge ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" variant="primary" size="sm" />
                                        <p className="text-muted mt-2 mb-0 small">Loading knowledge bases...</p>
                                    </div>
                                ) : knowledgeBases.length === 0 ? (
                                    <div className="text-center py-4">
                                        <IconifyIcon icon="solar:book-linear" width={48} height={48} className="text-muted mb-3" />
                                        <h6 className="text-muted">No Knowledge Bases</h6>
                                        <p className="text-muted small mb-3">Add knowledge bases to enhance your agent capabilities</p>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => setShowAddKnowledgeModal(true)}
                                        >
                                            <IconifyIcon icon="solar:add-circle-linear" width={18} height={18} className="me-2" />
                                            Add First Knowledge Base
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {knowledgeBases.map((kb) => (
                                            <Card key={kb.id} className="shadow-none border">
                                                <Card.Body>
                                                    <Row className="align-items-center">
                                                        <Col md={6}>
                                                            <div className="d-flex align-items-start gap-3">
                                                                <div className="p-2 bg-light rounded">
                                                                    <IconifyIcon
                                                                        icon={
                                                                            kb.file_type === 'application/pdf'
                                                                                ? 'solar:document-linear'
                                                                                : 'solar:file-text-linear'
                                                                        }
                                                                        width={24}
                                                                        height={24}
                                                                        className="text-primary"
                                                                    />
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <h6 className="mb-1">{kb.name}</h6>
                                                                    <p className="text-muted small mb-2">{kb.description}</p>
                                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                        <Badge bg="light" text="dark" className="font-monospace">
                                                                            {kb.file_name}
                                                                        </Badge>
                                                                        <Badge bg="light" text="dark">
                                                                            {formatFileSize(kb.file_size)}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="d-flex justify-content-md-end align-items-center gap-2 mt-3 mt-md-0">
                                                                <Form.Check
                                                                    type="switch"
                                                                    id={`switch-${kb.id}`}
                                                                    label={kb.enabled ? 'Enabled' : 'Disabled'}
                                                                    checked={kb.enabled}
                                                                    onChange={() => handleToggleKnowledge(kb)}
                                                                />
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setDeletingKnowledge(kb)
                                                                        setShowDeleteModal(true)
                                                                    }}
                                                                    title="Delete knowledge base"
                                                                >
                                                                    <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Customization Request Modal */}
            <Modal
                show={showCustomizationModal}
                onHide={() => setShowCustomizationModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Request Agent Customization</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <p className="text-muted mb-4">
                        Submit a customization request for your AI agent. Our team will review and implement your preferences.
                    </p> */}
                    <Alert variant="info" className="d-flex align-items-start">
                        <IconifyIcon icon="solar:info-circle-bold" width={20} height={20} className="me-2 mt-1" />
                        <div>
                            <strong>Note:</strong> Your customization request will be reviewed by our team.
                            Changes will be applied manually after approval, typically within 24-48 hours.
                        </div>
                    </Alert>
                    <Form>
                        <Row className="g-3">
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Business Type <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        value={customizationForm.business_type}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, business_type: e.target.value })
                                        }
                                        placeholder="e.g., Restaurant, Healthcare, E-commerce"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Primary Use Case <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={customizationForm.primary_use_case}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, primary_use_case: e.target.value })
                                        }
                                        placeholder="Describe how you plan to use the AI agent"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Desired Tone</Form.Label>
                                    <Form.Select
                                        value={customizationForm.desired_tone}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, desired_tone: e.target.value })
                                        }
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="friendly">Friendly</option>
                                        <option value="casual">Casual</option>
                                        <option value="formal">Formal</option>
                                        <option value="empathetic">Empathetic</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Agent Call Welcome Message
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={customizationForm.welcome_message}
                                        onChange={(e) =>
                                            setCustomizationForm({
                                                ...customizationForm,
                                                welcome_message: e.target.value
                                            })
                                        }
                                        placeholder="e.g., Hi, thank you for calling Acme Support. How can I help you today?"
                                    />
                                    <Form.Text className="text-muted">
                                        This message will be used as the agent’s greeting at the start of each call.
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Knowledge Usage Preference</Form.Label>
                                    <Form.Select
                                        value={customizationForm.knowledge_usage}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, knowledge_usage: e.target.value })
                                        }
                                    >
                                        <option value="minimal">Minimal - Stick to basics</option>
                                        <option value="moderate">Moderate - Balance knowledge</option>
                                        <option value="extensive">Extensive - Use all available knowledge</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Voice Preference</Form.Label>
                                    <Form.Control
                                        value={customizationForm.voice_preference}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, voice_preference: e.target.value })
                                        }
                                        placeholder="e.g., Male British accent, Young female voice"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Conversation Behavior Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={customizationForm.conversation_behavior}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, conversation_behavior: e.target.value })
                                        }
                                        placeholder="Describe how the agent should handle conversations, e.g., asking follow-up questions, handling objections"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Additional Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={customizationForm.additional_notes}
                                        onChange={(e) =>
                                            setCustomizationForm({ ...customizationForm, additional_notes: e.target.value })
                                        }
                                        placeholder="Any other specific requirements or preferences"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCustomizationModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCustomizationSubmit}
                        disabled={submittingCustomization}
                    >
                        {submittingCustomization ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <IconifyIcon icon="solar:check-circle-linear" width={18} height={18} className="me-2" />
                                Submit Request
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Knowledge Modal */}
            <Modal
                show={showAddKnowledgeModal}
                onHide={() => {
                    setShowAddKnowledgeModal(false)
                    setKnowledgeForm({ name: '', description: '', file: null })
                    setFileError(null)
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Knowledge Base</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="g-3">
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        value={knowledgeForm.name}
                                        onChange={(e) =>
                                            setKnowledgeForm({ ...knowledgeForm, name: e.target.value })
                                        }
                                        placeholder="e.g., Product Catalog"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Description <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={knowledgeForm.description}
                                        onChange={(e) =>
                                            setKnowledgeForm({ ...knowledgeForm, description: e.target.value })
                                        }
                                        placeholder="Brief description of the knowledge base content"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>
                                        File <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".pdf,.txt,.docx"
                                        onChange={handleFileSelect}
                                        isInvalid={!!fileError}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {fileError}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Supported formats: PDF, TXT, DOCX (Max 10MB)
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            {knowledgeForm.file && (
                                <Col xs={12}>
                                    <div className="p-3 bg-light rounded">
                                        <div className="d-flex align-items-center gap-2">
                                            <IconifyIcon icon="solar:file-check-linear" width={20} height={20} className="text-success" />
                                            <div className="flex-grow-1">
                                                <div className="fw-medium small">{knowledgeForm.file.name}</div>
                                                <div className="text-muted small">{formatFileSize(knowledgeForm.file.size)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowAddKnowledgeModal(false)
                            setKnowledgeForm({ name: '', description: '', file: null })
                            setFileError(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddKnowledge}
                        disabled={submittingKnowledge || !knowledgeForm.file}
                    >
                        {submittingKnowledge ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <IconifyIcon icon="solar:upload-linear" width={18} height={18} className="me-2" />
                                Add Knowledge Base
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false)
                    setDeletingKnowledge(null)
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center py-3">
                        <IconifyIcon icon="solar:danger-circle-linear" width={64} height={64} className="text-danger mb-3" />
                        <h5>Delete Knowledge Base?</h5>
                        <p className="text-muted mb-0">
                            Are you sure you want to delete <strong>{deletingKnowledge?.name}</strong>? This action cannot be undone.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowDeleteModal(false)
                            setDeletingKnowledge(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteKnowledge}>
                        <IconifyIcon icon="solar:trash-bin-trash-linear" width={18} height={18} className="me-2" />
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AgentPage