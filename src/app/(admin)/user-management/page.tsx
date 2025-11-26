'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row
} from 'react-bootstrap'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { adminUserApi } from '@/lib/admin-user-api'
import { adminAgentApi } from '@/lib/admin-agent-api'
import type { UserOut } from '@/types/auth'
import type { AdminUserCreatePayload, AdminUserUpdatePayload } from '@/types/admin-user'
import type { AdminAgent, UnassignedAgent } from '@/types/admin-agent'

type ModalMode = 'create' | 'edit' | 'assign-agent'

type UserFormState = Pick<AdminUserCreatePayload, 'username' | 'email' | 'password'>

const initialFormState: UserFormState = {
  username: '',
  email: '',
  password: ''
}

const normalizeAgentItems = (payload: unknown): AdminAgent[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as AdminAgent[]
  if (typeof payload === 'object' && payload !== null && Array.isArray((payload as { items?: AdminAgent[] }).items)) {
    return (payload as { items?: AdminAgent[] }).items ?? []
  }
  return []
}

const normalizeUnassignedAgents = (payload: unknown): UnassignedAgent[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as UnassignedAgent[]
  if (
    typeof payload === 'object' &&
    payload !== null &&
    Array.isArray((payload as { items?: UnassignedAgent[] }).items)
  ) {
    return (payload as { items?: UnassignedAgent[] }).items ?? []
  }
  return []
}

const UserManagementPage = () => {
  const { token, user, isAuthenticated, isLoading } = useAuth()
  const [users, setUsers] = useState<UserOut[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [blockLoadingId, setBlockLoadingId] = useState<string | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
  const [agentLoadingId, setAgentLoadingId] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [agentAssignmentUserId, setAgentAssignmentUserId] = useState<string | null>(null)
  const [agentIdInput, setAgentIdInput] = useState('')
  const [unassignedAgents, setUnassignedAgents] = useState<UnassignedAgent[]>([])
  const [agentsOptionsLoading, setAgentsOptionsLoading] = useState(false)
  const [allAgentsMap, setAllAgentsMap] = useState<Map<string, string>>(new Map())
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, pageSize])

  const fetchUsers = useCallback(async () => {
    if (!token || !isAuthenticated || user?.role !== 'admin') {
      setUsers([])
      setTotalRecords(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await adminUserApi.listUsers(token, {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        search: debouncedSearch || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort_by: 'created_at',
        sort_dir: 'desc'
      })

      if (response.error || !response.data) {
        setError(response.error || 'Failed to load users')
        setUsers([])
        setTotalRecords(0)
        return
      }

      const payload = response.data
      const normalizedItems = Array.isArray(payload) ? payload : payload?.items ?? []
      const normalizedTotal =
        typeof payload === 'object' && payload !== null && 'total' in payload
          ? Number((payload as { total: number }).total) || normalizedItems.length
          : normalizedItems.length

      setUsers(normalizedItems)
      setTotalRecords(normalizedTotal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
      setUsers([])
      setTotalRecords(0)
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, user?.role, currentPage, pageSize, debouncedSearch, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Load all agents to build name lookup map
  useEffect(() => {
    const loadAllAgents = async () => {
      if (!token || !isAuthenticated || user?.role !== 'admin') return
      try {
        const response = await adminAgentApi.getAllAgents(token, { limit: 1000 })
        const agentsList = normalizeAgentItems(response.data)
        if (agentsList.length) {
          const agentsMap = new Map<string, string>()
          agentsList.forEach((agent) => {
            const agentId = agent.agent_id || agent.id
            const agentName = agent.name || 'Unnamed Agent'
            if (agentId) {
              agentsMap.set(agentId, agentName)
            }
          })
          setAllAgentsMap(agentsMap)
        } else {
          setAllAgentsMap(new Map())
        }
      } catch (err) {
        // Silently fail - we'll just show IDs if names aren't available
        console.error('Failed to load agents for name lookup:', err)
      }
    }
    loadAllAgents()
  }, [token, isAuthenticated, user?.role])

  const resetForm = () => {
    setFormData(initialFormState)
    setFormErrors({})
    setEditingUserId(null)
    setAgentAssignmentUserId(null)
    setAgentIdInput('')
    setShowPassword(false)
  }

  const handleOpenModal = (mode: ModalMode, selected?: UserOut) => {
    setModalMode(mode)
    setShowPassword(false)
    if (mode === 'edit' && selected) {
      setEditingUserId(selected.id)
      setFormData({
        username: selected.username,
        email: selected.email,
        password: ''
      })
    } else {
      setEditingUserId(null)
      resetForm()
    }
    setShowModal(true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.username.trim()) errors.username = 'Username is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (modalMode === 'create' && !formData.password.trim()) errors.password = 'Password is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const loadUnassignedAgents = useCallback(
    async (currentAgentId?: string | null) => {
      if (!token) return
      setAgentsOptionsLoading(true)
      try {
        // Fetch all agents to build a name lookup map
        const allAgentsResponse = await adminAgentApi.getAllAgents(token, { limit: 1000 })
        const allAgents = normalizeAgentItems(allAgentsResponse.data)
        const agentsMap = new Map<string, string>()
        allAgents.forEach((agent) => {
          const agentId = agent.agent_id || agent.id
          const agentName = agent.name || 'Unnamed Agent'
          if (agentId) {
            agentsMap.set(agentId, agentName)
          }
        })
        setAllAgentsMap(agentsMap)

        // Fetch unassigned agents
        const response = await adminAgentApi.getUnassignedAgents(token)
        if (response.error || !response.data) {
          toast.error(response.error || 'Failed to load unassigned agents')
          setUnassignedAgents([])
          return
        }
        let agents = normalizeUnassignedAgents(response.data)

        // If user has a currently assigned agent, add it to the list
        if (currentAgentId) {
          const currentAgentName = agentsMap.get(currentAgentId) || currentAgentId
          if (!agents.some((agent) => agent.id === currentAgentId)) {
            agents = [{ id: currentAgentId, name: `${currentAgentName} (currently assigned)` }, ...agents]
          }
        }
        setUnassignedAgents(agents)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Unable to load unassigned agents')
        setUnassignedAgents([])
      } finally {
        setAgentsOptionsLoading(false)
      }
    },
    [token]
  )

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    if (modalMode === 'assign-agent') {
      await handleAssignAgent(event)
      return
    }

    if (!validateForm()) return

    setSubmitting(true)
    setError(null)

    try {
      if (modalMode === 'create') {
        const payload: AdminUserCreatePayload = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password
        }
        const response = await adminUserApi.createUser(token, payload)
        if (response.error) {
          toast.error(response.error)
          return
        }
        toast.success('User created successfully')
      } else if (editingUserId) {
        const payload: AdminUserUpdatePayload = {
          username: formData.username.trim(),
          email: formData.email.trim()
        }
        const response = await adminUserApi.updateUser(token, editingUserId, payload)
        if (response.error) {
          toast.error(response.error)
          return
        }
        toast.success('User updated successfully')
      } else {
        toast.error('No user selected for update')
        return
      }

      setShowModal(false)
      resetForm()
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = useCallback((userRecord: UserOut) => {
    setFormErrors({})
    setEditingUserId(userRecord.id)
    setFormData({
      username: userRecord.username,
      email: userRecord.email,
      password: ''
    })
    setModalMode('edit')
    setShowModal(true)
  }, [])

  const handleToggleStatus = useCallback(
    async (userRecord: UserOut) => {
      if (!token) return
      setBlockLoadingId(userRecord.id)
      setError(null)

      try {
        const response = await adminUserApi.updateStatus(token, userRecord.id, !userRecord.blocked)
        if (response.error) {
          toast.error(response.error)
        } else {
          toast.success(userRecord.blocked ? 'User unblocked successfully' : 'User blocked successfully')
          setUsers((prev) =>
            prev.map((item) => (item.id === userRecord.id ? response.data ?? item : item))
          )
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Unable to update status')
      } finally {
        setBlockLoadingId(null)
      }
    },
    [token]
  )

  const handleDeleteUser = useCallback(
    async (userRecord: UserOut) => {
      if (!token) return
      const confirmed = window.confirm(`Delete ${userRecord.username}? This action cannot be undone.`)
      if (!confirmed) return

      setDeleteLoadingId(userRecord.id)
      setError(null)

      try {
        const response = await adminUserApi.deleteUser(token, userRecord.id)
        if (response.error) {
          toast.error(response.error)
        } else {
          toast.success('User deleted successfully')
          fetchUsers()
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Unable to delete user')
      } finally {
        setDeleteLoadingId(null)
      }
    },
    [token, fetchUsers]
  )

  const handleOpenAgentModal = useCallback(
    async (userRecord: UserOut) => {
      if (!token) {
        toast.error('Authentication required')
        return
      }
      setAgentLoadingId(userRecord.id)
      setAgentAssignmentUserId(userRecord.id)
      setAgentIdInput(userRecord.agent_id ?? '')
      setModalMode('assign-agent')
      setShowModal(true)
      try {
        await loadUnassignedAgents(userRecord.agent_id)
      } finally {
        setAgentLoadingId(null)
      }
    },
    [token, loadUnassignedAgents]
  )

  const handleAssignAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token || !agentAssignmentUserId) return

    setSubmitting(true)
    setError(null)

    try {
      const payload: AdminUserUpdatePayload = {
        agent_id: agentIdInput.trim() || ''
      }
      const response = await adminUserApi.updateUser(token, agentAssignmentUserId, payload)
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success(
          agentIdInput.trim()
            ? `Agent assigned successfully`
            : 'Agent unassigned successfully'
        )
        setShowModal(false)
        setAgentAssignmentUserId(null)
        setAgentIdInput('')
        fetchUsers()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to assign agent')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (value: string) => {
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

  const columns: DataTableColumn<UserOut>[] = useMemo(
    () => [
      {
        key: 'index',
        header: '#',
        align: 'center',
        width: 60,
        sticky: 'left',
        defaultSticky: true,
        render: (_row, { rowIndex }) => (
          <span className="text-muted">
            {(currentPage - 1) * pageSize + rowIndex + 1}
          </span>
        )
      },
      {
        key: 'username',
        header: 'User',
        minWidth: 200,
        sticky: 'left',
        defaultSticky: true,
        render: (row) => (
          <div>
            <div className="fw-semibold">{row.username}</div>
            <small className="text-muted d-block">{row.email}</small>
          </div>
        )
      },
      {
        key: 'role',
        header: 'Role',
        minWidth: 110,
        render: (row) => (
          <Badge bg={row.role === 'admin' ? 'primary' : 'secondary'} className="text-uppercase">
            {row.role}
          </Badge>
        )
      },
      {
        key: 'agent',
        header: 'Agent',
        minWidth: 200,
        render: (row) => {
          if (!row.agent_id) {
            return <span className="text-muted fst-italic">Unassigned</span>
          }
          const agentName = allAgentsMap.get(row.agent_id) || row.agent_id
          return (
            <div>
              <div className="fw-medium">{agentName}</div>
              <small className="text-muted d-block">{row.agent_id}</small>
            </div>
          )
        }
      },
      {
        key: 'createdAt',
        header: 'Created',
        minWidth: 170,
        render: (row) => <span>{formatDate(row.created_at)}</span>
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
        minWidth: 120,
        sticky: 'right',
        defaultSticky: true,
        render: (row) => {
          const isLoading = blockLoadingId === row.id
          return (
            <div
              onClick={() => !isLoading && handleToggleStatus(row)}
              title={row.blocked ? 'Click to unblock user' : 'Click to block user'}
              style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'inline-block'
              }}
            >
              <Badge
                bg={row.blocked ? 'danger' : 'success'}
                className={`px-2 py-1 text-uppercase d-inline-flex align-items-center gap-1 ${isLoading ? 'opacity-75' : ''}`}
                style={{
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.opacity = '0.85'
                    e.currentTarget.style.transform = 'scale(1.08)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.opacity = '1'
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    <span>{row.blocked ? 'Blocked' : 'Active'}</span>
                  </>
                ) : (
                  <>
                    <span>{row.blocked ? 'Blocked' : 'Active'}</span>
                    <IconifyIcon
                      icon="solar:alt-arrow-right-linear"
                      width={12}
                      height={12}
                      className="opacity-75"
                    />
                  </>
                )}
              </Badge>
            </div>
          )
        }
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'center',
        minWidth: 280,
        sticky: 'right',
        defaultSticky: true,
        render: (row) => (
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => handleEditUser(row)}
              title="Edit user"
            >
              <IconifyIcon icon="solar:pen-new-square-outline" width={16} height={16} />
            </Button>
            <Button
              size="sm"
              variant={row.agent_id ? 'outline-warning' : 'outline-info'}
              onClick={() => handleOpenAgentModal(row)}
              title={row.agent_id ? 'Unassign agent' : 'Assign agent'}
              disabled={agentLoadingId === row.id}
            >
              {agentLoadingId === row.id ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <IconifyIcon
                  icon={row.agent_id ? 'solar:user-minus-outline' : 'solar:user-plus-outline'}
                  width={16}
                  height={16}
                />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleDeleteUser(row)}
              title="Delete user"
              disabled={deleteLoadingId === row.id}
            >
              {deleteLoadingId === row.id ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <IconifyIcon icon="solar:trash-bin-minimalistic-outline" width={16} height={16} />
              )}
            </Button>
          </div>
        )
      }
    ],
    [
      currentPage,
      pageSize,
      blockLoadingId,
      deleteLoadingId,
      agentLoadingId,
      allAgentsMap,
      handleToggleStatus,
      handleEditUser,
      handleDeleteUser,
      handleOpenAgentModal
    ]
  )

  const filters: DataTableFilterControl[] = [
    {
      id: 'status-filter',
      label: 'Status',
      type: 'select',
      value: statusFilter,
      options: [
        { label: 'All statuses', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Blocked', value: 'blocked' }
      ],
      onChange: (value) => setStatusFilter(value as 'all' | 'active' | 'blocked')
    }
  ]

  const emptyState = {
    title: 'No users found',
    description: 'Try adjusting filters or create a new user.'
  }

  const pagination = {
    currentPage,
    pageSize,
    totalRecords,
    onPageChange: (page: number) => setCurrentPage(page),
    onPageSizeChange: (size: number) => setPageSize(size),
    pageSizeOptions: [10, 25, 50, 100],
    startRecord: totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    endRecord: Math.min(currentPage * pageSize, totalRecords),
    totalPages: Math.max(1, Math.ceil(Math.max(totalRecords, 1) / pageSize)),
    isLastPage: currentPage * pageSize >= totalRecords && totalRecords !== 0,
    hasMore: currentPage * pageSize < totalRecords
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <h4 className="mb-2">Please sign in</h4>
            <p className="text-muted mb-0">You need an admin account to view user management.</p>
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
            <p className="text-muted mb-0">Only admins can manage users.</p>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">User Management</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Taplox</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">User Management</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="admin-user-table"
            title="User Management"
            description="Manage all platform users with full CRUD, filtering, and search."
            columns={columns}
            data={users}
            loading={loading}
            error={error}
            onRetry={fetchUsers}
            emptyState={emptyState}
            minTableWidth={1650}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search by name or email',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              },
              filters,
              extra: (
                <Button onClick={() => handleOpenModal('create')} className="shadow-sm">
                  <IconifyIcon icon="solar:user-plus-outline" width={18} height={18} className="me-2" />
                  Add User
                </Button>
              )
            }}
            pagination={pagination}
            columnPanel={{
              enableColumnVisibility: true,
              enableSticky: true,
              maxSticky: 3
            }}
            tableContainerStyle={{
              maxHeight: 'calc(100vh - 350px)',
              overflowY: 'auto',
              overflowX: 'auto',
              maxWidth: '100%'
            }}
          />
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        onExited={resetForm}
        centered
        size={modalMode === 'assign-agent' ? undefined : 'lg'}
        contentClassName="border-0 shadow-lg"
      >
        <Form onSubmit={handleFormSubmit}>
          <ModalHeader closeButton>
            <ModalTitle>
              {modalMode === 'create'
                ? 'Add New User'
                : modalMode === 'assign-agent'
                  ? 'Assign/Unassign Agent'
                  : 'Edit User'}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {modalMode === 'assign-agent' ? (
              <Form.Group className="mb-0">
                <Form.Label>Select Agent</Form.Label>
                {agentsOptionsLoading ? (
                  <div className="text-center py-3">
                    <span className="spinner-border spinner-border-sm" role="status" />
                  </div>
                ) : (
                  <Form.Select value={agentIdInput} onChange={(e) => setAgentIdInput(e.target.value)}>
                    <option value="">No agent (unassign)</option>
                    {unassignedAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
                <Form.Text className="text-muted">
                  Choose an available agent to assign, or select &quot;No agent&quot; to remove the current assignment.
                </Form.Text>
              </Form.Group>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                  <Badge bg={modalMode === 'create' ? 'success' : 'primary'} className="text-uppercase fw-semibold">
                    {modalMode === 'create' ? 'New Account' : 'Profile Update'}
                  </Badge>
                  <small className="text-muted">Fields marked * are required</small>
                </div>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted text-uppercase small fw-semibold">Username *</Form.Label>
                      <Form.Control
                        size="lg"
                        className="shadow-sm"
                        value={formData.username}
                        onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                        isInvalid={!!formErrors.username}
                        placeholder="e.g. alex.miller"
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.username}</Form.Control.Feedback>
                      {/* <Form.Text className="text-muted">Visible to other admins and used in audit logs.</Form.Text> */}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted text-uppercase small fw-semibold">Email *</Form.Label>
                      <InputGroup size="lg" className="shadow-sm" hasValidation>
                        <InputGroup.Text>
                          <IconifyIcon icon="solar:mailbox-linear" width={18} height={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          isInvalid={!!formErrors.email}
                          placeholder="work@example.com"
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        We will send the verification email to this address immediately.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  {modalMode === 'create' && (
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="text-muted text-uppercase small fw-semibold">
                          Temporary Password *
                        </Form.Label>
                        <InputGroup size="lg" className="shadow-sm" hasValidation>
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            isInvalid={!!formErrors.password}
                            placeholder="Set an initial password"
                          />
                          <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            <IconifyIcon
                              icon={showPassword ? 'solar:eye-closed-line-duotone' : 'solar:eye-line-duotone'}
                              width={18}
                              height={18}
                            />
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {formErrors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                        {/* <Form.Text className="text-muted">
                          Share this once with the user—they will be prompted to change it on first login.
                        </Form.Text> */}
                      </Form.Group>
                    </Col>
                  )}
                </Row>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  {modalMode === 'assign-agent' ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                modalMode === 'assign-agent' ? 'Update Agent' : 'Save'
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}

export default UserManagementPage

