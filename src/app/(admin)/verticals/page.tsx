'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

type ModuleType = 'calls' | 'appointments' | 'orders' | 'incidents'

type Vertical = {
  _id: string
  key: string
  name: string
  enabled: boolean
  modules: ModuleType[]
  created_at: string
  updated_at: string
}

type VerticalFormState = {
  key: string
  name: string
  enabled: boolean
  modules: ModuleType[]
}

// Available modules that can be assigned
const AVAILABLE_MODULES: { value: ModuleType; label: string; description: string }[] = [
  { value: 'calls', label: 'Calls', description: 'Call logs and management' },
  { value: 'appointments', label: 'Appointments', description: 'Appointment scheduling and tracking' },
  { value: 'orders', label: 'Orders', description: 'Order management and tracking' },
  { value: 'incidents', label: 'Incidents', description: 'Incident reporting and resolution' }
]

// Mock data
const MOCK_VERTICALS: Vertical[] = [
  {
    _id: 'vertical_001',
    key: 'hr',
    name: 'Human Resources',
    enabled: true,
    modules: ['calls', 'incidents'],
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-12-15T10:30:00Z'
  },
  {
    _id: 'vertical_002',
    key: 'dental',
    name: 'Dental Care',
    enabled: true,
    modules: ['calls', 'appointments'],
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-12-16T14:20:00Z'
  },
  {
    _id: 'vertical_003',
    key: 'food',
    name: 'Food & Beverage',
    enabled: true,
    modules: ['calls', 'orders'],
    created_at: '2024-01-15T11:30:00Z',
    updated_at: '2024-12-17T09:45:00Z'
  },
  {
    _id: 'vertical_004',
    key: 'salon',
    name: 'Beauty & Salon',
    enabled: true,
    modules: ['calls', 'appointments'],
    created_at: '2024-01-18T13:00:00Z',
    updated_at: '2024-12-18T11:15:00Z'
  },
  {
    _id: 'vertical_005',
    key: 'hospital',
    name: 'Hospital & Healthcare',
    enabled: false,
    modules: ['calls', 'appointments', 'incidents'],
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-12-10T16:30:00Z'
  }
]

const DEFAULT_FORM_STATE: VerticalFormState = {
  key: '',
  name: '',
  enabled: true,
  modules: ['calls']
}

const VerticalsPage = () => {
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [verticals, setVerticals] = useState<Vertical[]>(MOCK_VERTICALS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [modalOpen, setModalOpen] = useState(false)
  const [formState, setFormState] = useState<VerticalFormState>(DEFAULT_FORM_STATE)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof VerticalFormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [selectedVertical, setSelectedVertical] = useState<Vertical | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Vertical | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter])

  const fetchVerticals = useCallback(async () => {
    if (!token || !isAdmin) return
    setLoading(true)
    setError(null)
    try {
      // TODO: Replace with actual API call
      // const response = await verticalApi.list(token)
      // if (response.error) throw new Error(response.error)
      // setVerticals(response.data)

      await new Promise(resolve => setTimeout(resolve, 500))
      setVerticals(MOCK_VERTICALS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load verticals.')
    } finally {
      setLoading(false)
    }
  }, [token, isAdmin])

  useEffect(() => {
    fetchVerticals()
  }, [fetchVerticals])

  const filteredVerticals = useMemo(() => {
    return verticals.filter((vertical) => {
      const matchesSearch =
        !debouncedSearch ||
        vertical.key.toLowerCase().includes(debouncedSearch) ||
        vertical.name.toLowerCase().includes(debouncedSearch)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'enabled' && vertical.enabled) ||
        (statusFilter === 'disabled' && !vertical.enabled)

      return matchesSearch && matchesStatus
    })
  }, [verticals, debouncedSearch, statusFilter])

  const totalRecords = filteredVerticals.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedVerticals = filteredVerticals.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const openCreateModal = () => {
    setModalMode('create')
    setFormState(DEFAULT_FORM_STATE)
    setFormErrors({})
    setSelectedVertical(null)
    setModalOpen(true)
  }

  const openEditModal = useCallback((vertical: Vertical) => {
    setModalMode('edit')
    setSelectedVertical(vertical)
    setFormState({
      key: vertical.key,
      name: vertical.name,
      enabled: vertical.enabled,
      modules: vertical.modules
    })
    setFormErrors({})
    setModalOpen(true)
  }, [])

  const openViewModal = useCallback((vertical: Vertical) => {
    setSelectedVertical(vertical)
    setModalMode('view')
    setModalOpen(true)
  }, [])

  const confirmDelete = useCallback((vertical: Vertical) => {
    setDeleteTarget(vertical)
    setDeleteModalOpen(true)
  }, [])

  const validateForm = () => {
    const errors: Partial<Record<keyof VerticalFormState, string>> = {}

    if (!formState.key.trim()) {
      errors.key = 'Vertical key is required'
    } else if (!/^[a-z_]+$/.test(formState.key)) {
      errors.key = 'Key must be lowercase letters and underscores only'
    }

    if (!formState.name.trim()) {
      errors.name = 'Vertical name is required'
    }

    if (formState.modules.length === 0) {
      errors.modules = 'At least one module must be selected'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return
    if (!token || !isAdmin) {
      toast.error('You need admin access to manage verticals.')
      return
    }

    const payload = {
      key: formState.key.trim().toLowerCase(),
      name: formState.name.trim(),
      enabled: formState.enabled,
      modules: formState.modules
    }

    setSubmitting(true)
    try {
      if (modalMode === 'create') {
        // TODO: Replace with actual API call
        // const response = await verticalApi.create(token, payload)
        // if (response.error) throw new Error(response.error)

        await new Promise(resolve => setTimeout(resolve, 800))
        
        const newVertical: Vertical = {
          _id: `vertical_${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setVerticals(prev => [newVertical, ...prev])
        toast.success('Vertical created successfully')
      } else if (selectedVertical) {
        // TODO: Replace with actual API call
        // const response = await verticalApi.update(token, selectedVertical._id, payload)
        // if (response.error) throw new Error(response.error)

        await new Promise(resolve => setTimeout(resolve, 800))
        
        setVerticals(prev => prev.map(v =>
          v._id === selectedVertical._id
            ? { ...v, ...payload, updated_at: new Date().toISOString() }
            : v
        ))
        
        toast.success('Vertical updated successfully')
      }

      setModalOpen(false)
      setFormState(DEFAULT_FORM_STATE)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save vertical')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget) return
    setDeleteLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await verticalApi.delete(token, deleteTarget._id)
      // if (response.error) throw new Error(response.error)

      await new Promise(resolve => setTimeout(resolve, 800))
      
      setVerticals(prev => prev.filter(v => v._id !== deleteTarget._id))
      toast.success('Vertical deleted successfully')
      setDeleteModalOpen(false)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete vertical')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleEnabled = async (vertical: Vertical) => {
    if (!token || !isAdmin) return
    setTogglingId(vertical._id)
    try {
      // TODO: Replace with actual API call
      // const response = await verticalApi.toggleEnabled(token, vertical._id)
      // if (response.error) throw new Error(response.error)

      await new Promise(resolve => setTimeout(resolve, 500))
      
      setVerticals(prev => prev.map(v =>
        v._id === vertical._id
          ? { ...v, enabled: !v.enabled, updated_at: new Date().toISOString() }
          : v
      ))
      
      toast.success(`Vertical ${!vertical.enabled ? 'enabled' : 'disabled'} successfully`)
    } catch (err) {
      toast.error('Failed to toggle vertical status')
    } finally {
      setTogglingId(null)
    }
  }

  const handleModuleToggle = (module: ModuleType) => {
    setFormState(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }))
    if (formErrors.modules) {
      setFormErrors(prev => ({ ...prev, modules: undefined }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
          { label: 'Enabled', value: 'enabled' },
          { label: 'Disabled', value: 'disabled' }
        ],
        onChange: (value) => setStatusFilter((value || 'all') as any),
        onClear: () => setStatusFilter('all'),
        width: 3
      }
    ],
    [statusFilter]
  )

  const columns: DataTableColumn<Vertical>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Vertical',
        minWidth: 200,
        render: (vertical) => (
          <div>
            <div className="fw-semibold">{vertical.name}</div>
            <code className="text-muted small">{vertical.key}</code>
          </div>
        )
      },
      {
        key: 'modules',
        header: 'Modules',
        minWidth: 250,
        render: (vertical) => (
          <div className="d-flex flex-wrap gap-1">
            {vertical.modules.map(module => (
              <Badge key={module} bg="light" text="dark" className="text-capitalize">
                {module}
              </Badge>
            ))}
          </div>
        )
      },
      {
        key: 'enabled',
        header: 'Status',
        width: 120,
        render: (vertical) => (
          <div
            onClick={() => togglingId !== vertical._id && handleToggleEnabled(vertical)}
            style={{ cursor: togglingId === vertical._id ? 'not-allowed' : 'pointer' }}
            title="Click to toggle"
          >
            <Badge
              bg={vertical.enabled ? 'success' : 'secondary'}
              className="d-inline-flex align-items-center gap-1"
              style={{
                cursor: togglingId === vertical._id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {togglingId === vertical._id ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  {vertical.enabled ? 'Enabled' : 'Disabled'}
                </>
              ) : (
                <>
                  {vertical.enabled ? 'Enabled' : 'Disabled'}
                  <IconifyIcon icon="solar:alt-arrow-right-linear" width={12} height={12} />
                </>
              )}
            </Badge>
          </div>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        width: 140,
        render: (vertical) => formatDate(vertical.created_at)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 200,
        align: 'right',
        sticky: 'right',
        render: (vertical) => (
          <div className="d-flex justify-content-end gap-2">
            <Button size="sm" variant="outline-secondary" onClick={() => openViewModal(vertical)}>
              <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
            </Button>
            <Button size="sm" variant="outline-primary" onClick={() => openEditModal(vertical)}>
              <IconifyIcon icon="solar:pen-linear" width={16} height={16} />
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(vertical)}>
              <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [togglingId, openViewModal, openEditModal, confirmDelete]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Verticals Management</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Verticals</li>
              </ol>
            </div>
            <Button variant="primary" onClick={openCreateModal} className="d-inline-flex align-items-center gap-2">
              <IconifyIcon icon="solar:add-circle-bold" width={18} height={18} />
              Create Vertical
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="verticals-table"
            title="All Verticals"
            description="Manage industry verticals and their associated modules for organization categorization."
            columns={columns}
            data={paginatedVerticals}
            rowKey={(vertical) => vertical._id}
            loading={loading}
            error={error}
            onRetry={fetchVerticals}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                onChange: setSearchQuery,
                onClear: () => setSearchQuery(''),
                placeholder: 'Search verticals...'
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
              title: 'No verticals found',
              description: 'Create your first vertical to categorize organizations.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={modalOpen && modalMode !== 'view'} onHide={() => setModalOpen(false)} size="lg" centered>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{modalMode === 'create' ? 'Create Vertical' : 'Edit Vertical'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vertical Key</Form.Label>
                  <Form.Control
                    name="key"
                    value={formState.key}
                    onChange={(e) => setFormState(prev => ({ ...prev, key: e.target.value }))}
                    isInvalid={!!formErrors.key}
                    placeholder="e.g., hr, dental, food"
                    disabled={modalMode === 'edit'}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.key}</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Lowercase letters and underscores only. Cannot be changed after creation.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vertical Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    isInvalid={!!formErrors.name}
                    placeholder="e.g., Human Resources"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Modules</Form.Label>
                  <div className="border rounded p-3">
                    {AVAILABLE_MODULES.map(module => (
                      <Form.Check
                        key={module.value}
                        type="checkbox"
                        id={`module-${module.value}`}
                        label={
                          <div>
                            <div className="fw-medium">{module.label}</div>
                            <small className="text-muted">{module.description}</small>
                          </div>
                        }
                        checked={formState.modules.includes(module.value)}
                        onChange={() => handleModuleToggle(module.value)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  {formErrors.modules && (
                    <div className="text-danger small mt-1">{formErrors.modules}</div>
                  )}
                  <Form.Text className="text-muted">
                    Select modules that will be available for organizations in this vertical
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Check
                  type="switch"
                  id="enabled-switch"
                  label="Enable this vertical"
                  checked={formState.enabled}
                  onChange={(e) => setFormState(prev => ({ ...prev, enabled: e.target.checked }))}
                />
                <Form.Text className="text-muted">
                  Disabled verticals cannot be assigned to new organizations
                </Form.Text>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="link" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Saving...
                </>
              ) : (
                modalMode === 'create' ? 'Create Vertical' : 'Save Changes'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal show={modalOpen && modalMode === 'view'} onHide={() => setModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Vertical Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVertical && (
            <div>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <label className="text-muted small">Vertical ID</label>
                  <div className="fw-medium">{selectedVertical._id}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Status</label>
                  <div>
                    <Badge bg={selectedVertical.enabled ? 'success' : 'secondary'}>
                      {selectedVertical.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Key</label>
                  <div><code>{selectedVertical.key}</code></div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Name</label>
                  <div className="fw-medium">{selectedVertical.name}</div>
                </Col>
              </Row>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Assigned Modules</label>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {selectedVertical.modules.map(module => (
                    <Badge key={module} bg="primary" className="text-capitalize px-3 py-2">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
              <hr />
              <Row className="g-3">
                <Col md={6}>
                  <label className="text-muted small">Created</label>
                  <div>{formatDate(selectedVertical.created_at)}</div>
                </Col>
                <Col md={6}>
                  <label className="text-muted small">Last Updated</label>
                  <div>{formatDate(selectedVertical.updated_at)}</div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Vertical</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Delete <span className="fw-semibold">{deleteTarget?.name}</span>? This will affect all organizations
            using this vertical.
          </p>
          <p className="text-danger small mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="link" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Deleting...
              </>
            ) : (
              'Delete Vertical'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default VerticalsPage