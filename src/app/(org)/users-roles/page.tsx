'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { orgUsersApi, type OrgUser, type CreateOrgUserRequest, type UpdateOrgUserRequest, type OrgUsersListParams } from '@/api/org/users'
import { useFeatureGuard } from '@/hooks/useFeatureGuard'
import { filterFeaturesByVertical } from '@/helpers/vertical-features'
import { isOrgUser } from '@/types/auth'

// ALL available features (will be filtered by vertical)
const ALL_FEATURES = [
  { value: 'agent', label: 'Agent' },
  { value: 'users-roles', label: 'Users & Roles' },
  { value: 'call-records', label: 'Call Records' },
  { value: 'action-items', label: 'Action Items' },
  { value: 'complaints', label: 'Complaints' },
  { value: 'orders', label: 'Orders' },
  { value: 'incident-reports', label: 'Incident Reports' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'locations', label: 'Locations' },
  { value: 'knowledge-base', label: 'Knowledge Base' },
  { value: 'agent-settings', label: 'Agent Settings' },
  { value: 'usage-billing', label: 'Usage & Billing' },
]

type UserFormState = {
  email: string
  name: string
  role_name: string
  is_admin: boolean
  features: string[]
}

const DEFAULT_FORM_STATE: UserFormState = {
  email: '',
  name: '',
  role_name: 'Agent',
  is_admin: false,
  features: []
}

const UserManagementPage = () => {
  useFeatureGuard()
  const { token, user, isAuthenticated } = useAuth()
  
  // Get vertical-filtered features
  const verticalKey = isOrgUser(user) ? user.organization?.vertical_key : undefined
  const AVAILABLE_FEATURES = useMemo(
    () => filterFeaturesByVertical(ALL_FEATURES, verticalKey),
    [verticalKey]
  )

  // Update predefined roles based on vertical features
  const PREDEFINED_ROLES = useMemo(() => ({
    Administrator: {
      is_admin: true,
      features: AVAILABLE_FEATURES.map(f => f.value),
    },
    Manager: {
      is_admin: false,
      features: AVAILABLE_FEATURES
        .filter(f => !['agent-settings', 'faqs', 'contact-support'].includes(f.value))
        .map(f => f.value),
    },
    Agent: {
      is_admin: false,
      features: AVAILABLE_FEATURES
        .filter(f => ['call-records', 'action-items', 'orders', 'appointments'].includes(f.value))
        .map(f => f.value),
    },
    Viewer: {
      is_admin: false,
      features: AVAILABLE_FEATURES
        .filter(f => ['call-records', 'knowledge-base'].includes(f.value))
        .map(f => f.value),
    },
  }), [AVAILABLE_FEATURES])

  const isAdmin = Boolean(isAuthenticated && user && isOrgUser(user) && user.is_admin)
  
  const [users, setUsers] = useState<OrgUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [adminFilter, setAdminFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null)
  const [formState, setFormState] = useState<UserFormState>(DEFAULT_FORM_STATE)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  const [roles, setRoles] = useState<string[]>([
    'Administrator',
    'Manager',
    'Agent',
    'Viewer'
  ])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, roleFilter, adminFilter])

  const fetchUsers = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    
    try {
      const params: OrgUsersListParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: 'newest',
      }

      if (debouncedSearch) params.search = debouncedSearch
      if (statusFilter !== 'all') params.status_filter = statusFilter
      if (roleFilter !== 'all') params.role_filter = roleFilter
      if (adminFilter !== 'all') params.admin_filter = adminFilter
      
      const response = await orgUsersApi.list(params)
      setUsers(response.users)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load users.')
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch, statusFilter, roleFilter, adminFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const getStatusVariant = (status: string): string => {
    const variants: Record<string, string> = {
      active: 'success',
      invited: 'warning',
      suspended: 'danger'
    }
    return variants[status] || 'secondary'
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof UserFormState, string>> = {}
    
    if (!formState.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formState.name.trim()) {
      errors.name = 'Name is required'
    } else if (formState.name.trim().length > 100) {
      errors.name = 'Name must not exceed 100 characters'
    }
    
    if (!formState.role_name.trim()) {
      errors.role_name = 'Role is required'
    }
    
    if (!formState.is_admin && formState.features.length === 0) {
      errors.features = 'Please select at least one feature access'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setSubmitting(true)
    try {
      const payload: CreateOrgUserRequest = {
        email: formState.email.trim(),
        name: formState.name.trim(),
        role_name: formState.role_name.trim(),
        is_admin: formState.is_admin,
        features: formState.is_admin 
          ? AVAILABLE_FEATURES.map(f => f.value)
          : formState.features
      }
      
      await orgUsersApi.create(payload)
      toast.success('User invited successfully')
      setCreateModalOpen(false)
      setFormState(DEFAULT_FORM_STATE)
      setFormErrors({})
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to invite user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser || !validateForm()) return
    
    setSubmitting(true)
    try {
      const payload: UpdateOrgUserRequest = {
        name: formState.name.trim(),
        role_name: formState.role_name.trim(),
        is_admin: formState.is_admin,
        features: formState.is_admin 
          ? AVAILABLE_FEATURES.map(f => f.value)
          : formState.features
      }
      
      await orgUsersApi.update(selectedUser.id, payload)
      toast.success('User updated successfully')
      setEditModalOpen(false)
      setSelectedUser(null)
      setFormState(DEFAULT_FORM_STATE)
      setFormErrors({})
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    
    setSubmitting(true)
    try {
      await orgUsersApi.delete(selectedUser.id)
      toast.success('User deleted successfully')
      setDeleteModalOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to delete user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setUpdatingUserId(userId)
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
      await orgUsersApi.updateStatus(userId, newStatus as any)
      
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: newStatus as any, updated_at: new Date().toISOString() } : u
      ))
      
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus as any, updated_at: new Date().toISOString() })
      }
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update status')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleAdminToggle = async (userId: string, currentIsAdmin: boolean) => {
    setUpdatingUserId(userId)
    try {
      const response = await orgUsersApi.toggleAdmin(userId)
      
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, is_admin: response.is_admin, updated_at: new Date().toISOString() } : u
      ))
      
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, is_admin: response.is_admin, updated_at: new Date().toISOString() })
      }
      
      toast.success(response.message)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to toggle admin status')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleResendInvite = async (userId: string) => {
    setUpdatingUserId(userId)
    try {
      await orgUsersApi.resendInvite(userId)
      toast.success('Invitation resent successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to resend invitation')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const roleConfig = PREDEFINED_ROLES[value as keyof typeof PREDEFINED_ROLES]
    
    if (roleConfig) {
      setFormState(prev => ({
        ...prev,
        role_name: value,
        is_admin: roleConfig.is_admin,
        features: roleConfig.features
      }))
    } else {
      setFormState(prev => ({
        ...prev,
        role_name: value
      }))
    }
    
    if (formErrors.role_name) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.role_name
        return newErrors
      })
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'is_admin' && checked ? { features: AVAILABLE_FEATURES.map(f => f.value) } : {})
    }))
    
    if (formErrors[name as keyof UserFormState]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof UserFormState]
        return newErrors
      })
    }
  }

  const handleFeatureToggle = (featureValue: string) => {
    setFormState(prev => ({
      ...prev,
      features: prev.features.includes(featureValue)
        ? prev.features.filter(f => f !== featureValue)
        : [...prev.features, featureValue]
    }))
    
    if (formErrors.features) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.features
        return newErrors
      })
    }
  }

  const openCreateModal = () => {
    setFormState(DEFAULT_FORM_STATE)
    setFormErrors({})
    setCreateModalOpen(true)
  }

  const openEditModal = (user: OrgUser) => {
    setSelectedUser(user)
    setFormState({
      email: user.email,
      name: user.name,
      role_name: user.role_name,
      is_admin: user.is_admin,
      features: user.features
    })
    setFormErrors({})
    setEditModalOpen(true)
  }

  const openViewModal = (user: OrgUser) => {
    setSelectedUser(user)
    setViewModalOpen(true)
  }

  const openDeleteModal = (user: OrgUser) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'status-filter',
        label: 'Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'All Statuses', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'Invited', value: 'invited' },
          { label: 'Suspended', value: 'suspended' }
        ],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 3
      },
      {
        id: 'role-filter',
        label: 'Role',
        type: 'select',
        value: roleFilter === 'all' ? '' : roleFilter,
        options: [
          { label: 'All Roles', value: '' },
          ...roles.map(role => ({ label: role, value: role }))
        ],
        onChange: (value) => setRoleFilter(value || 'all'),
        onClear: () => setRoleFilter('all'),
        width: 3
      },
      {
        id: 'admin-filter',
        label: 'Type',
        type: 'select',
        value: adminFilter === 'all' ? '' : adminFilter,
        options: [
          { label: 'All Types', value: '' },
          { label: 'Admins', value: 'admin' },
          { label: 'Regular Users', value: 'user' }
        ],
        onChange: (value) => setAdminFilter(value || 'all'),
        onClear: () => setAdminFilter('all'),
        width: 3
      }
    ],
    [statusFilter, roleFilter, adminFilter, roles]
  )

  const columns: DataTableColumn<OrgUser>[] = useMemo(
    () => [
      {
        key: 'serial',
        header: '#',
        width: 60,
        render: (_, { rowIndex }) => <span className="text-muted">{startIndex + rowIndex + 1}</span>
      },
      {
        key: 'name',
        header: 'User',
        minWidth: 200,
        render: (user) => (
          <div>
            <div className="fw-semibold">{user.name}</div>
            <div className="text-muted small">{user.email}</div>
          </div>
        )
      },
      {
        key: 'role_name',
        header: 'Role',
        width: 130,
        render: (user) => (
          <Badge bg="light" text="dark">{user.role_name}</Badge>
        )
      },
      {
        key: 'is_admin',
        header: 'Type',
        width: 110,
        render: (user) => (
          <Badge bg={user.is_admin ? 'primary' : 'secondary'}>
            {user.is_admin ? 'Admin' : 'User'}
          </Badge>
        )
      },
      {
        key: 'status',
        header: 'Status',
        width: 120,
        render: (user) => (
          <Badge bg={getStatusVariant(user.status)} className="text-capitalize">
            {user.status}
          </Badge>
        )
      },
      {
        key: 'features',
        header: 'Features',
        width: 110,
        render: (user) => <span className="text-muted">{user.features.length} features</span>
      },
      {
        key: 'created_at',
        header: 'Joined',
        width: 160,
        render: (user) => (
          <span className="text-muted small">{formatDate(user.created_at)}</span>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 140,
        align: 'center',
        sticky: 'right',
        render: (user) => (
          <div className="d-flex gap-1 justify-content-center">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={(e) => {
                e.stopPropagation()
                openViewModal(user)
              }}
              title="View"
            >
              <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={(e) => {
                e.stopPropagation()
                openEditModal(user)
              }}
              title="Edit"
              disabled={!isAdmin}
            >
              <IconifyIcon icon="solar:pen-linear" width={16} height={16} />
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={(e) => {
                e.stopPropagation()
                openDeleteModal(user)
              }}
              title="Delete"
              disabled={!isAdmin}
            >
              <IconifyIcon icon="solar:trash-bin-minimalistic-linear" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [startIndex, isAdmin]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">User Management</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Users</li>
              </ol>
            </div>
            <Button
              variant="primary"
              onClick={openCreateModal}
              disabled={!isAdmin}
              className="d-inline-flex align-items-center gap-2"
            >
              <IconifyIcon icon="solar:user-plus-linear" width={20} height={20} />
              Invite User
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="users-table"
            title="All Users"
            description="Manage organization users and permissions"
            columns={columns}
            data={users}
            rowKey={(user) => user.id}
            loading={loading}
            error={error}
            onRetry={fetchUsers}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search users...'
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
              title: 'No users found',
              description: 'Start by inviting users to your organization.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      {/* Create Modal */}
      <Modal show={createModalOpen} onHide={() => setCreateModalOpen(false)} size="lg" centered>
        <Form onSubmit={handleCreate}>
          <Modal.Header closeButton>
            <Modal.Title>Invite New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleFieldChange}
                    placeholder="user@example.com"
                    isInvalid={!!formErrors.email}
                    disabled={submitting}
                  />
                  {formErrors.email && <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleFieldChange}
                    placeholder="John Doe"
                    isInvalid={!!formErrors.name}
                    disabled={submitting}
                  />
                  {formErrors.name && <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Select
                      name="role_name"
                      value={formState.role_name}
                      onChange={handleRoleChange}
                      isInvalid={!!formErrors.role_name}
                      disabled={submitting}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        const newRole = prompt('Enter custom role name:')
                        if (newRole?.trim()) {
                          setRoles(prev => [...prev, newRole.trim()])
                          setFormState(prev => ({ ...prev, role_name: newRole.trim() }))
                        }
                      }}
                      disabled={submitting}
                      title="Add custom role"
                    >
                      <IconifyIcon icon="solar:add-circle-linear" width={18} height={18} />
                    </Button>
                  </div>
                  {formErrors.role_name && <div className="text-danger small mt-1">{formErrors.role_name}</div>}
                  <Form.Text className="text-muted small d-block mt-1">
                    Selecting a predefined role will automatically set permissions
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="d-block mb-2">Admin Privileges</Form.Label>
                  <Form.Check
                    type="switch"
                    id="create-is-admin"
                    label="Grant Admin Access"
                    name="is_admin"
                    checked={formState.is_admin}
                    onChange={handleFieldChange}
                    disabled={submitting}
                  />
                  <Form.Text className="text-muted small">
                    Admins have full access to all features
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Feature Access</Form.Label>
                  <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {AVAILABLE_FEATURES.map(feature => (
                      <Form.Check
                        key={feature.value}
                        type="checkbox"
                        id={`create-feature-${feature.value}`}
                        label={feature.label}
                        checked={formState.features.includes(feature.value)}
                        onChange={() => handleFeatureToggle(feature.value)}
                        disabled={formState.is_admin || submitting}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  {formErrors.features && (
                    <div className="text-danger small mt-1">{formErrors.features}</div>
                  )}
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
              Send Invitation
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)} size="lg" centered>
        <Form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={formState.email}
                    disabled
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleFieldChange}
                    placeholder="John Doe"
                    isInvalid={!!formErrors.name}
                    disabled={submitting}
                  />
                  {formErrors.name && <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="role_name"
                    value={formState.role_name}
                    onChange={handleRoleChange}
                    isInvalid={!!formErrors.role_name}
                    disabled={submitting}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </Form.Select>
                  {formErrors.role_name && <Form.Control.Feedback type="invalid">{formErrors.role_name}</Form.Control.Feedback>}
                  <Form.Text className="text-muted small d-block mt-1">
                    Selecting a predefined role will automatically update permissions
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="d-block mb-2">Admin Privileges</Form.Label>
                  <Form.Check
                    type="switch"
                    id="edit-is-admin"
                    label="Grant Admin Access"
                    name="is_admin"
                    checked={formState.is_admin}
                    onChange={handleFieldChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Feature Access</Form.Label>
                  <div className="border rounded p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {AVAILABLE_FEATURES.map(feature => (
                      <Form.Check
                        key={feature.value}
                        type="checkbox"
                        id={`edit-feature-${feature.value}`}
                        label={feature.label}
                        checked={formState.features.includes(feature.value)}
                        onChange={() => handleFeatureToggle(feature.value)}
                        disabled={formState.is_admin || submitting}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  {formErrors.features && (
                    <div className="text-danger small mt-1">{formErrors.features}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="link" onClick={() => setEditModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting} className="d-inline-flex align-items-center gap-2">
              {submitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">User ID</label>
                  <div className="fw-medium font-monospace small">{selectedUser.id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Status</label>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={getStatusVariant(selectedUser.status)} className="text-capitalize">
                      {selectedUser.status}
                    </Badge>
                    {selectedUser.status !== 'invited' && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleStatusToggle(selectedUser.id, selectedUser.status)}
                        disabled={updatingUserId === selectedUser.id}
                        className="d-inline-flex align-items-center gap-1"
                      >
                        {updatingUserId === selectedUser.id ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <>
                            <IconifyIcon icon="solar:refresh-linear" width={14} height={14} />
                            Toggle
                          </>
                        )}
                      </Button>
                    )}
                    {selectedUser.status === 'invited' && (
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => handleResendInvite(selectedUser.id)}
                        disabled={updatingUserId === selectedUser.id}
                        className="d-inline-flex align-items-center gap-1"
                      >
                        {updatingUserId === selectedUser.id ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <>
                            <IconifyIcon icon="solar:letter-linear" width={14} height={14} />
                            Resend
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Col>
                <Col md={12}>
                  <label className="text-muted small">Full Name</label>
                  <h5 className="mb-0">{selectedUser.name}</h5>
                </Col>
                <Col md={12}>
                  <label className="text-muted small">Email Address</label>
                  <div className="fw-medium">{selectedUser.email}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Role</label>
                  <div>
                    <Badge bg="light" text="dark">
                      {selectedUser.role_name}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Admin Status</label>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={selectedUser.is_admin ? 'primary' : 'secondary'}>
                      {selectedUser.is_admin ? 'Admin' : 'Regular User'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleAdminToggle(selectedUser.id, selectedUser.is_admin)}
                      disabled={updatingUserId === selectedUser.id}
                      className="d-inline-flex align-items-center gap-1"
                    >
                      {updatingUserId === selectedUser.id ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                      ) : (
                        <>
                          <IconifyIcon icon="solar:refresh-linear" width={14} height={14} />
                          Toggle
                        </>
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Feature Access ({selectedUser.features.length})</label>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {selectedUser.features.map(feature => {
                    const featureInfo = AVAILABLE_FEATURES.find(f => f.value === feature)
                    return (
                      <Badge key={feature} bg="info" className="text-capitalize">
                        {featureInfo?.label || feature}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Created At</label>
                  <div>{formatDate(selectedUser.created_at)}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedUser.updated_at)}</div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setViewModalOpen(false)
            if (selectedUser) openEditModal(selectedUser)
          }}>
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Are you sure you want to delete <span className="fw-semibold">{selectedUser?.name}</span>?
          </p>
          <p className="text-danger mb-0">
            This action cannot be undone. The user will lose access immediately.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="link" onClick={() => setDeleteModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={submitting} className="d-inline-flex align-items-center gap-2">
            {submitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserManagementPage

export const dynamic = 'force-dynamic'
