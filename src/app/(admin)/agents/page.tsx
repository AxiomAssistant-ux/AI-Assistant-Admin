'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { adminAgentApi } from '@/lib/admin-agent-api'
import type { AdminAgent, AssignmentFilter, CreateAgentPayload } from '@/types/admin-agent'
import { toast } from 'react-toastify'

const matchesSearch = (agent: AdminAgent, term: string) => {
  const id = (agent.agent_id || agent.id || '').toLowerCase()
  const name = (agent.name || '').toLowerCase()
  const languages = [
    agent.default_language,
    ...(agent.additional_languages ?? [])
  ]
    .filter(Boolean)
    .join(',')
    .toLowerCase()
  const assigned = (agent.assigned_users ?? []).join(',').toLowerCase()

  return (
    id.includes(term) ||
    name.includes(term) ||
    languages.includes(term) ||
    assigned.includes(term)
  )
}

const matchesAssignment = (agent: AdminAgent, assignment: AssignmentFilter) => {
  if (assignment === 'all') return true
  const hasAssignedUsers = Boolean(agent.assigned_users && agent.assigned_users.length > 0)
  return assignment === 'assigned' ? hasAssignedUsers : !hasAssignedUsers
}

const getAgentIdentifier = (agent?: AdminAgent | null) => agent?.agent_id || agent?.id || ''

const buildEditFormState = (agent: AdminAgent): EditFormState => ({
  // Basic fields
  name: agent.name || '',
  tags: (agent.tags || []).join(', '),

  // Agent config
  prompt: agent.conversation_config?.agent?.prompt?.prompt || '',
  llm: agent.conversation_config?.agent?.prompt?.llm || '',
  language: agent.conversation_config?.agent?.language || '',
  firstMessage: agent.conversation_config?.agent?.first_message || '',
  temperature: agent.conversation_config?.agent?.prompt?.temperature?.toString() || '',
  maxTokens: agent.conversation_config?.agent?.prompt?.max_tokens?.toString() || '',

  // TTS config
  voiceId: agent.conversation_config?.tts?.voice_id || '',
  ttsModelId: agent.conversation_config?.tts?.model_id || '',
  stability: agent.conversation_config?.tts?.stability?.toString() || '',
  speed: agent.conversation_config?.tts?.speed?.toString() || '',
  similarityBoost: agent.conversation_config?.tts?.similarity_boost?.toString() || '',

  // Platform settings
  recordCalls: agent.platform_settings?.record_calls || false,
  debug: agent.platform_settings?.debug || false
})

type AgentActionMode = 'view' | 'edit'

type EditFormState = {
  // Basic fields
  name: string
  tags: string

  // Agent config
  prompt: string
  llm: string
  language: string
  firstMessage: string
  temperature: string
  maxTokens: string

  // TTS config
  voiceId: string
  ttsModelId: string
  stability: string
  speed: string
  similarityBoost: string

  // Platform settings
  recordCalls: boolean
  debug: boolean
}

const initialEditFormState: EditFormState = {
  name: '',
  tags: '',
  prompt: '',
  llm: '',
  language: '',
  firstMessage: '',
  temperature: '',
  maxTokens: '',
  voiceId: '',
  ttsModelId: '',
  stability: '',
  speed: '',
  similarityBoost: '',
  recordCalls: false,
  debug: false
}

const AgentsPage = () => {
  const { token, isAuthenticated, user, isLoading } = useAuth()
  const [agents, setAgents] = useState<AdminAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  const [selectedAgent, setSelectedAgent] = useState<AdminAgent | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [fetchingAgentId, setFetchingAgentId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>(initialEditFormState)
  const [editFormErrors, setEditFormErrors] = useState<Partial<Record<keyof EditFormState, string>>>({})
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
  const [activeActionMode, setActiveActionMode] = useState<AgentActionMode | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, assignmentFilter, pageSize])

  const fetchAgents = useCallback(async () => {
    if (!token || !isAuthenticated || user?.role !== 'admin') {
      setAgents([])
      setTotalRecords(0)
      return
    }

    setLoading(true)
    setError(null)

    const response = await adminAgentApi.getAllAgents(token, {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      search: debouncedSearch || undefined,
      assignment: assignmentFilter !== 'all' ? assignmentFilter : undefined
    })

    if (response.error || !response.data) {
      setError(response.error || 'Failed to load agents')
      setAgents([])
      setTotalRecords(0)
      setLoading(false)
      return
    }

    const payload = response.data
    const isLegacyResponse = Array.isArray(payload)

    if (isLegacyResponse) {
      const legacyList = payload as AdminAgent[]
      let filteredList = legacyList

      if (debouncedSearch) {
        const term = debouncedSearch.toLowerCase()
        filteredList = filteredList.filter((agent) => matchesSearch(agent, term))
      }

      if (assignmentFilter !== 'all') {
        filteredList = filteredList.filter((agent) => matchesAssignment(agent, assignmentFilter))
      }

      const total = filteredList.length
      const startIndex = (currentPage - 1) * pageSize

      if (startIndex >= total && total > 0) {
        const lastPage = Math.max(1, Math.ceil(total / pageSize))
        setCurrentPage(lastPage)
        setLoading(false)
        return
      }

      const pagedItems = filteredList.slice(startIndex, startIndex + pageSize)
      setAgents(pagedItems)
      setTotalRecords(total)
      setLoading(false)
      return
    }

    const dataObject = (payload as { items?: AdminAgent[]; total?: number }) ?? {}
    const items = Array.isArray(dataObject.items) ? dataObject.items : []
    const total = typeof dataObject.total === 'number' ? dataObject.total : items.length

    if (items.length === 0 && total > 0 && currentPage > 1) {
      const lastPage = Math.max(1, Math.ceil(total / pageSize))
      setCurrentPage(lastPage)
      setLoading(false)
      return
    }

    setAgents(items)
    setTotalRecords(total)
    setLoading(false)
  }, [token, isAuthenticated, user?.role, currentPage, pageSize, debouncedSearch, assignmentFilter])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const handleAgentAction = useCallback(
    async (agent: AdminAgent, mode: AgentActionMode) => {
      if (!token || !isAuthenticated || user?.role !== 'admin') {
        toast.error('You are not authorized to manage agents.')
        return
      }
      const agentId = getAgentIdentifier(agent)
      if (!agentId) {
        toast.error('Agent identifier is missing.')
        return
      }

      setFetchingAgentId(agentId)
      setActiveActionMode(mode)
      setEditFormErrors({})

      try {
        const response = await adminAgentApi.getAgent(token, agentId)
        if (response.error || !response.data) {
          toast.error(response.error || 'Failed to load agent details.')
          return
        }

        setSelectedAgent(response.data)
        if (mode === 'view') {
          setViewModalOpen(true)
        } else {
          setEditForm(buildEditFormState(response.data))
          setEditModalOpen(true)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load agent.')
      } finally {
        setFetchingAgentId(null)
        setActiveActionMode(null)
      }
    },
    [token, isAuthenticated, user?.role]
  )

  const handleDeletePrompt = useCallback(
    (agent: AdminAgent) => {
      if (!isAuthenticated || user?.role !== 'admin') {
        toast.error('You are not authorized to delete agents.')
        return
      }
      setSelectedAgent(agent)
      setDeleteModalOpen(true)
    },
    [isAuthenticated, user?.role]
  )

  const handleEditInputChange =
    (field: keyof EditFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      const value = target.type === 'checkbox'
        ? (target as HTMLInputElement).checked
        : target.value
      setEditForm((prev) => ({ ...prev, [field]: value }))
      setEditFormErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const validateEditForm = () => {
    const errors: Partial<Record<keyof EditFormState, string>> = {}
    // Note: For updates, fields are optional, but we validate if they're provided
    if (editForm.voiceId.trim() && editForm.voiceId.trim().length === 0) {
      errors.voiceId = 'Voice ID cannot be empty if provided'
    }
    if (editForm.prompt.trim() && editForm.prompt.trim().length === 0) {
      errors.prompt = 'Prompt cannot be empty if provided'
    }
    setEditFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAgent) return
    if (!token || !isAuthenticated || user?.role !== 'admin') {
      toast.error('You are not authorized to update agents.')
      return
    }
    if (!validateEditForm()) return

    const agentId = getAgentIdentifier(selectedAgent)
    if (!agentId) {
      toast.error('Agent identifier is missing.')
      return
    }

    // Build tags array
    const tags = editForm.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    // Build conversation_config (all fields optional for updates)
    const conversationConfig: Partial<CreateAgentPayload['conversation_config']> = {}

    // Agent section
    const agentConfig: Record<string, any> = {}
    if (editForm.language.trim()) agentConfig.language = editForm.language.trim()
    if (editForm.firstMessage.trim()) agentConfig.first_message = editForm.firstMessage.trim()

    // Prompt config
    const promptConfig: Record<string, any> = {}
    if (editForm.prompt.trim()) promptConfig.prompt = editForm.prompt.trim()
    if (editForm.llm.trim()) promptConfig.llm = editForm.llm.trim()
    if (editForm.temperature.trim()) {
      const temp = parseFloat(editForm.temperature)
      if (!isNaN(temp)) promptConfig.temperature = temp
    }
    if (editForm.maxTokens.trim()) {
      const tokens = parseInt(editForm.maxTokens, 10)
      if (!isNaN(tokens)) promptConfig.max_tokens = tokens
    }

    if (Object.keys(promptConfig).length > 0) {
      agentConfig.prompt = promptConfig
    }

    if (Object.keys(agentConfig).length > 0) {
      conversationConfig.agent = agentConfig
    }

    // TTS config
    const ttsConfig: Record<string, any> = {}
    if (editForm.voiceId.trim()) ttsConfig.voice_id = editForm.voiceId.trim()
    if (editForm.ttsModelId.trim()) ttsConfig.model_id = editForm.ttsModelId.trim()
    if (editForm.stability.trim()) {
      const stability = parseFloat(editForm.stability)
      if (!isNaN(stability)) ttsConfig.stability = stability
    }
    if (editForm.speed.trim()) {
      const speed = parseFloat(editForm.speed)
      if (!isNaN(speed)) ttsConfig.speed = speed
    }
    if (editForm.similarityBoost.trim()) {
      const boost = parseFloat(editForm.similarityBoost)
      if (!isNaN(boost)) ttsConfig.similarity_boost = boost
    }

    if (Object.keys(ttsConfig).length > 0) {
      conversationConfig.tts = ttsConfig
    }

    // Build platform_settings
    const platformSettings: Record<string, any> = {}
    if (editForm.recordCalls) platformSettings.record_calls = true
    if (editForm.debug) platformSettings.debug = true

    // Build payload matching AgentUpdateRequest (all fields optional)
    const payload: Partial<CreateAgentPayload> = {}
    if (editForm.name.trim()) payload.name = editForm.name.trim()
    if (tags.length > 0) payload.tags = tags
    if (Object.keys(conversationConfig).length > 0) {
      payload.conversation_config = conversationConfig as CreateAgentPayload['conversation_config']
    }
    if (Object.keys(platformSettings).length > 0) {
      payload.platform_settings = platformSettings
    }

    setEditSubmitting(true)
    try {
      const response = await adminAgentApi.updateAgent(token, agentId, payload)
      if (response.error || !response.data) {
        toast.error(response.error || 'Failed to update agent.')
        return
      }
      toast.success('Agent updated successfully.')
      setSelectedAgent(response.data)
      setEditModalOpen(false)
      setEditForm(initialEditFormState)
      fetchAgents()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update agent.')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedAgent) return
    if (!token || !isAuthenticated || user?.role !== 'admin') {
      toast.error('You are not authorized to delete agents.')
      return
    }

    const agentId = getAgentIdentifier(selectedAgent)
    if (!agentId) {
      toast.error('Agent identifier is missing.')
      return
    }

    setDeleteLoadingId(agentId)
    try {
      const response = await adminAgentApi.deleteAgent(token, agentId)
      if (response.error) {
        toast.error(response.error || 'Failed to delete agent.')
        return
      }
      toast.success('Agent deleted successfully.')
      setDeleteModalOpen(false)
      setSelectedAgent(null)
      fetchAgents()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete agent.')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  const formatDate = (value?: string) => {
    if (!value) return '—'
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(value))
    } catch {
      return value
    }
  }

  const columns: DataTableColumn<AdminAgent>[] = useMemo(
    () => [
      {
        key: 'index',
        header: '#',
        align: 'left',
        width: 60,
        sticky: 'left',
        render: (_row, { rowIndex }) => (
          <span className="text-muted">{(currentPage - 1) * pageSize + rowIndex + 1}</span>
        )
      },
      {
        key: 'name',
        header: 'Agent',
        minWidth: 220,
        sticky: 'left',
        render: (row) => (
          <div>
            <div className="fw-semibold">{row.name || 'Unnamed Agent'}</div>
            <small className="text-muted d-block">{row.agent_id || row.id || '—'}</small>
          </div>
        )
      },
      {
        key: 'assigned',
        header: 'Assigned Users',
        minWidth: 220,
        render: (row) =>
          row.assigned_users && row.assigned_users.length > 0 ? (
            <div className="d-flex flex-wrap gap-1">
              {row.assigned_users.map((username) => (
                <Badge bg="info" key={`${row.agent_id}-${username}`}>
                  {username}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted">Unassigned</span>
          )
      },
      {
        key: 'actions',
        header: 'Actions',
        minWidth: 280,
        align: 'center',
        sticky: 'right',
        defaultSticky: false,
        enableStickyToggle: true,
        render: (row) => {
          const agentId = getAgentIdentifier(row)
          if (!agentId) {
            return <span className="text-muted">—</span>
          }

          const isViewLoading = fetchingAgentId === agentId && activeActionMode === 'view'
          const isEditLoading = fetchingAgentId === agentId && activeActionMode === 'edit'
          const isDeleteLoading = deleteLoadingId === agentId

          return (
            <div className="d-flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => handleAgentAction(row, 'view')}
                title="View agent"
                disabled={isViewLoading}
              >
                {isViewLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <IconifyIcon icon="solar:eye-outline" width={16} height={16} />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleAgentAction(row, 'edit')}
                title="Edit agent"
                disabled={isEditLoading}
              >
                {isEditLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <IconifyIcon icon="solar:pen-new-square-outline" width={16} height={16} />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleDeletePrompt(row)}
                title="Delete agent"
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <IconifyIcon icon="solar:trash-bin-trash-outline" width={16} height={16} />
                )}
              </Button>
            </div>
          )
        }
      }
    ],
    [currentPage, pageSize, fetchingAgentId, activeActionMode, deleteLoadingId, handleAgentAction, handleDeletePrompt]
  )

  const tableMinWidth = useMemo(
    () =>
      columns.reduce((total, column) => {
        const width = column.minWidth ?? column.width ?? 140
        return total + width
      }, 0),
    [columns]
  )

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'assignment',
        label: 'Assignment',
        type: 'select',
        value: assignmentFilter === 'all' ? '' : assignmentFilter,
        onChange: (value: string) => setAssignmentFilter((value || 'all') as AssignmentFilter),
        onClear: assignmentFilter !== 'all' ? () => setAssignmentFilter('all') : undefined,
        options: [
          { label: 'All agents', value: '' },
          { label: 'Assigned only', value: 'assigned' },
          { label: 'Unassigned only', value: 'unassigned' }
        ],
        width: 3
      }
    ],
    [assignmentFilter]
  )

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalRecords)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    if (size === pageSize) return
    setPageSize(size)
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <h4 className="mb-2">Please sign in</h4>
            <p className="text-muted mb-0">You need an admin account to view agents.</p>
          </div>
        </Col>
      </Row>
    )
  }

  if (user && user.role !== 'admin') {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <IconifyIcon icon="solar:shield-cross-outline" width={48} height={48} className="text-danger mb-3" />
            <h4 className="mb-2">Access restricted</h4>
            <p className="text-muted mb-0">Only admins can manage agents.</p>
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
              <h4 className="mb-0">Agents</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Taplox</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Agents</li>
              </ol>
            </div>
            <Link href="/create-agent" className="btn btn-primary shadow-sm d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:add-square-outline" width={18} height={18} />
              Create Agent
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="all-agents"
            title="All Agents"
            description="Overview of every conversational agent in your workspace."
            columns={columns}
            data={agents}
            loading={loading}
            error={error}
            onRetry={fetchAgents}
            minTableWidth={tableMinWidth}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search agents by name, ID, or user',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              },
              filters: toolbarFilters
            }}
            columnPanel={{
              enableColumnVisibility: true,
              enableSticky: true,
              maxSticky: 4
            }}
            pagination={{
              currentPage,
              pageSize,
              totalRecords,
              totalPages,
              startRecord,
              endRecord,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
              pageSizeOptions: [10, 25, 50, 100],
              isLastPage: currentPage >= totalPages,
              hasMore: currentPage < totalPages
            }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Agent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAgent ? (
            <div className="d-flex flex-column gap-3">
              <div>
                <p className="text-muted text-uppercase small mb-1">Agent Name</p>
                <h5 className="mb-0">{selectedAgent.name || 'Unnamed Agent'}</h5>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <p className="text-muted text-uppercase small mb-1">Agent ID</p>
                  <div className="fw-semibold">{getAgentIdentifier(selectedAgent) || '—'}</div>
                </Col>
                <Col md={6}>
                  <p className="text-muted text-uppercase small mb-1">Voice ID</p>
                  <div>{selectedAgent.tts?.voice_id || '—'}</div>
                </Col>
                <Col md={6}>
                  <p className="text-muted text-uppercase small mb-1">Primary Language</p>
                  <div>{selectedAgent.default_language || '—'}</div>
                </Col>
                <Col md={6}>
                  <p className="text-muted text-uppercase small mb-1">Model</p>
                  <div>{selectedAgent.conversation_config?.agent?.prompt?.llm || '—'}</div>
                </Col>
                <Col md={12}>
                  <p className="text-muted text-uppercase small mb-1">Additional Languages</p>
                  {selectedAgent.additional_languages && selectedAgent.additional_languages.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedAgent.additional_languages.map((lang) => (
                        <Badge bg="secondary" key={`${getAgentIdentifier(selectedAgent)}-${lang}`} className="text-uppercase">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </Col>
                <Col md={12}>
                  <p className="text-muted text-uppercase small mb-1">Assigned Users</p>
                  {selectedAgent.assigned_users && selectedAgent.assigned_users.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedAgent.assigned_users.map((username) => (
                        <Badge bg="info" key={`${getAgentIdentifier(selectedAgent)}-${username}`}>
                          {username}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">No users assigned</span>
                  )}
                </Col>
                <Col md={12}>
                  <p className="text-muted text-uppercase small mb-1">Prompt</p>
                  <div className="bg-body-tertiary rounded p-3" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedAgent.conversation_config?.agent?.prompt?.prompt || '—'}
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <p className="text-muted mb-0">Select an agent to view their details.</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)} size="lg" centered>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Agent</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Row className="g-3">
              {/* Basic Information */}
              <Col xs={12}>
                <h6 className="mb-3 text-primary">Basic Information</h6>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAgentName">
                  <Form.Label>Agent Name</Form.Label>
                  <Form.Control
                    value={editForm.name}
                    onChange={handleEditInputChange('name')}
                    isInvalid={!!editFormErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">{editFormErrors.name}</Form.Control.Feedback>
                  <Form.Text className="text-muted">Optional: Name for the agent</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAgentTags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    value={editForm.tags}
                    onChange={handleEditInputChange('tags')}
                    placeholder="sales, support, english"
                  />
                  <Form.Text className="text-muted">Comma separated tags (optional)</Form.Text>
                </Form.Group>
              </Col>

              {/* Agent Configuration */}
              <Col xs={12} className="mt-4">
                <h6 className="mb-3 text-primary">Agent Configuration</h6>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAgentLanguage">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    value={editForm.language}
                    onChange={handleEditInputChange('language')}
                    placeholder="en"
                  />
                  <Form.Text className="text-muted">Primary language code (e.g., en, es, fr)</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAgentFirstMessage">
                  <Form.Label>First Message</Form.Label>
                  <Form.Control
                    value={editForm.firstMessage}
                    onChange={handleEditInputChange('firstMessage')}
                    placeholder="Hello! How can I help you today?"
                  />
                  <Form.Text className="text-muted">Optional: Initial greeting message</Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="editAgentPrompt">
                  <Form.Label>System Prompt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editForm.prompt}
                    onChange={handleEditInputChange('prompt')}
                    placeholder="Describe how the agent should behave..."
                    isInvalid={!!editFormErrors.prompt}
                  />
                  <Form.Control.Feedback type="invalid">{editFormErrors.prompt}</Form.Control.Feedback>
                  <Form.Text className="text-muted">Define the agent's behavior and personality</Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="editAgentLLM">
                  <Form.Label>LLM Model</Form.Label>
                  <Form.Control
                    value={editForm.llm}
                    onChange={handleEditInputChange('llm')}
                    placeholder="gpt-4o-mini"
                  />
                  <Form.Text className="text-muted">Optional: LLM model identifier</Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="editAgentTemperature">
                  <Form.Label>Temperature</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={editForm.temperature}
                    onChange={handleEditInputChange('temperature')}
                    placeholder="0.7"
                  />
                  <Form.Text className="text-muted">Optional: 0-2, controls randomness</Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="editAgentMaxTokens">
                  <Form.Label>Max Tokens</Form.Label>
                  <Form.Control
                    type="number"
                    value={editForm.maxTokens}
                    onChange={handleEditInputChange('maxTokens')}
                    placeholder="1000"
                  />
                  <Form.Text className="text-muted">Optional: Maximum response length</Form.Text>
                </Form.Group>
              </Col>

              {/* TTS Configuration */}
              <Col xs={12} className="mt-4">
                <h6 className="mb-3 text-primary">Text-to-Speech Configuration</h6>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAgentVoice">
                  <Form.Label>Voice ID</Form.Label>
                  <Form.Control
                    value={editForm.voiceId}
                    onChange={handleEditInputChange('voiceId')}
                    placeholder="voice_123"
                    isInvalid={!!editFormErrors.voiceId}
                  />
                  <Form.Control.Feedback type="invalid">{editFormErrors.voiceId}</Form.Control.Feedback>
                  <Form.Text className="text-muted">ElevenLabs voice identifier</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editAgentTTSModel">
                  <Form.Label>TTS Model</Form.Label>
                  <Form.Select
                    value={editForm.ttsModelId}
                    onChange={handleEditInputChange('ttsModelId')}
                  >
                    <option value="">Select TTS Model (Optional)</option>
                    <option value="eleven_turbo_v2">Eleven Turbo v2</option>
                    <option value="eleven_flash_v2">Eleven Flash v2</option>
                    <option value="eleven_multilingual_v2">Eleven Multilingual v2</option>
                  </Form.Select>
                  <Form.Text className="text-muted">Optional: TTS model selection</Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="editAgentStability">
                  <Form.Label>Stability</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={editForm.stability}
                    onChange={handleEditInputChange('stability')}
                    placeholder="0.5"
                  />
                  <Form.Text className="text-muted">Optional: 0-1, voice stability</Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="editAgentSpeed">
                  <Form.Label>Speed</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0.25"
                    max="4"
                    value={editForm.speed}
                    onChange={handleEditInputChange('speed')}
                    placeholder="1.0"
                  />
                  <Form.Text className="text-muted">Optional: 0.25-4, speech speed</Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="editAgentSimilarityBoost">
                  <Form.Label>Similarity Boost</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={editForm.similarityBoost}
                    onChange={handleEditInputChange('similarityBoost')}
                    placeholder="0.75"
                  />
                  <Form.Text className="text-muted">Optional: 0-1, voice similarity</Form.Text>
                </Form.Group>
              </Col>

              {/* Platform Settings */}
              <Col xs={12} className="mt-4">
                <h6 className="mb-3 text-primary">Platform Settings</h6>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    id="editRecordCalls"
                    label="Record Calls"
                    checked={editForm.recordCalls}
                    onChange={handleEditInputChange('recordCalls')}
                  />
                  <Form.Text className="text-muted">Enable call recording for this agent</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    id="editDebug"
                    label="Debug Mode"
                    checked={editForm.debug}
                    onChange={handleEditInputChange('debug')}
                  />
                  <Form.Text className="text-muted">Enable debug logging for this agent</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={editSubmitting}>
              {editSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Saving...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:floppy-disk-outline" width={16} height={16} className="me-2" />
                  Save Changes
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete{' '}
            <strong>{selectedAgent?.name || getAgentIdentifier(selectedAgent) || 'this agent'}</strong>? This action cannot
            be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={deleteLoadingId !== null && deleteLoadingId === getAgentIdentifier(selectedAgent)}
          >
            {deleteLoadingId !== null && deleteLoadingId === getAgentIdentifier(selectedAgent) ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:trash-bin-trash-outline" width={16} height={16} className="me-2" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AgentsPage

