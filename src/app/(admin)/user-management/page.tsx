'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  Form,
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

const initialFormState: AdminUserCreatePayload = {
  username: '',
  email: '',
  password: '',
  agent_id: ''
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
  }

  const handleOpenModal = (mode: ModalMode, selected?: UserOut) => {
    setModalMode(mode)
    if (mode === 'edit' && selected) {
      setEditingUserId(selected.id)
      setFormData({
        username: selected.username,
        email: selected.email,
        password: '',
        agent_id: selected.agent_id ?? ''
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
          password: formData.password,
          agent_id: formData.agent_id?.trim() || undefined
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
          email: formData.email.trim(),
          agent_id: formData.agent_id?.trim() || null
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

  const handleEditUser = (userRecord: UserOut) => {
    setFormErrors({})
    setEditingUserId(userRecord.id)
    setFormData({
      username: userRecord.username,
      email: userRecord.email,
      password: '',
      agent_id: userRecord.agent_id ?? ''
    })
    setModalMode('edit')
    setShowModal(true)
  }

  const handleToggleStatus = async (userRecord: UserOut) => {
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
  }

  const handleDeleteUser = async (userRecord: UserOut) => {
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
  }

  const handleOpenAgentModal = async (userRecord: UserOut) => {
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
  }

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

  const statusBadge = (record: UserOut) => (
    <Badge bg={record.blocked ? 'danger' : 'success'} className="px-2 py-1 text-uppercase">
      {record.blocked ? 'Blocked' : 'Active'}
    </Badge>
  )

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
        render: (row) => statusBadge(row)
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'center',
        minWidth: 280,
        sticky: 'right',
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
              variant={row.blocked ? 'success' : 'warning'}
              onClick={() => handleToggleStatus(row)}
              title={row.blocked ? 'Unblock user' : 'Block user'}
              disabled={blockLoadingId === row.id}
              className="d-flex align-items-center gap-1"
            >
              {blockLoadingId === row.id ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <>
                  <IconifyIcon
                    icon={row.blocked ? 'solar:unlock-outline' : 'solar:lock-keyhole-outline'}
                    width={16}
                    height={16}
                  />
                  <span>{row.blocked ? 'Unblock' : 'Block'}</span>
                </>
              )}
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
    [currentPage, pageSize, blockLoadingId, deleteLoadingId, agentLoadingId, users, allAgentsMap]
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
              maxWidth: '100%'
            }}
          />
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} onExited={resetForm} centered>
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
                  Choose an available agent to assign, or select "No agent" to remove the current assignment.
                </Form.Text>
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={formData.username}
                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                    isInvalid={!!formErrors.username}
                    placeholder="Enter username"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.username}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    isInvalid={!!formErrors.email}
                    placeholder="work@example.com"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                </Form.Group>
                {modalMode === 'create' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Temporary Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      isInvalid={!!formErrors.password}
                      placeholder="Set an initial password"
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                  </Form.Group>
                )}
                <Form.Group className="mb-0">
                  <Form.Label>Agent ID (optional)</Form.Label>
                  <Form.Control
                    value={formData.agent_id ?? ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, agent_id: e.target.value }))}
                    placeholder="Assign agent id"
                  />
                </Form.Group>
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

