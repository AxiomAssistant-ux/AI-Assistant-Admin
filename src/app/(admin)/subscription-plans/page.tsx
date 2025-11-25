'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import TagsInput from '@/components/TagsInput'
import { useAuth } from '@/context/useAuthContext'
import { subscriptionApi } from '@/lib/subscription-api'
import {
  type BillingFrequency,
  type SubscriptionPlan,
  type SubscriptionPlanPayload,
  type SubscriptionPlanStatus,
  type SubscriptionTier
} from '@/types/billing'
import { formatCurrencyValue, formatDateTime, getPlanStatusVariant } from '@/helpers/billing'

type PlanFormState = {
  name: string
  tier: SubscriptionTier
  description: string
  price: string
  currency: string
  billingFrequency: BillingFrequency
  seatsIncluded: string
  minuteAllocation: string
  features: string[]
  status: SubscriptionPlanStatus
  trialDays: string
}

const DEFAULT_FORM_STATE: PlanFormState = {
  name: '',
  tier: 'basic',
  description: '',
  price: '0',
  currency: 'USD',
  billingFrequency: 'monthly',
  seatsIncluded: '1',
  minuteAllocation: '',
  features: [],
  status: 'draft',
  trialDays: '14'
}

const now = new Date().toISOString()

const DEMO_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    description: 'Starter tools for solo creators and small pods.',
    price: 19,
    currency: 'USD',
    billingFrequency: 'monthly',
    seatsIncluded: 5,
    minuteAllocation: 500,
    features: ['Up to 5 seats', 'Shared inbox', 'Email support'],
    status: 'active',
    trialDays: 14,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    description: 'Collaboration suite for scaling teams.',
    price: 69,
    currency: 'USD',
    billingFrequency: 'monthly',
    seatsIncluded: 25,
    minuteAllocation: 2500,
    features: ['Advanced analytics', 'Workflow automation', 'Priority chat support'],
    status: 'active',
    trialDays: 21,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'premium',
    name: 'Premium',
    tier: 'premium',
    description: 'Enterprise-grade security and concierge onboarding.',
    price: 149,
    currency: 'USD',
    billingFrequency: 'annual',
    seatsIncluded: 100,
    minuteAllocation: 10000,
    features: ['Dedicated CSM', 'SSO/SAML', 'Unlimited playbooks'],
    status: 'inactive',
    trialDays: 30,
    createdAt: now,
    updatedAt: now
  }
]

const tierOptions: { label: string; value: SubscriptionTier }[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Pro', value: 'pro' },
  { label: 'Premium', value: 'premium' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Custom', value: 'custom' }
]

const billingOptions: { label: string; value: BillingFrequency }[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annual', value: 'annual' }
]

const statusOptions: { label: string; value: SubscriptionPlanStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
  { label: 'Draft', value: 'draft' }
]

const SubscriptionPlansPage = () => {
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEMO_PLANS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [billingFilter, setBillingFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [formState, setFormState] = useState<PlanFormState>(DEFAULT_FORM_STATE)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PlanFormState, string>>>({})
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, tierFilter, statusFilter, billingFilter])

  const fetchPlans = useCallback(async () => {
    if (!token || !isAdmin) return
    setLoading(true)
    setError(null)

    try {
      const response = await subscriptionApi.listPlans(token)

      if (response.error) {
        setError(response.error)
        return
      }

      const payload = Array.isArray(response.data)
        ? response.data
        : response.data?.items ?? []

      if (payload && payload.length) {
        setPlans(payload)
      } else {
        setPlans([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load subscription plans.')
    } finally {
      setLoading(false)
    }
  }, [isAdmin, token])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch =
        !debouncedSearch ||
        plan.name.toLowerCase().includes(debouncedSearch) ||
        plan.tier.toLowerCase().includes(debouncedSearch) ||
        (plan.description ?? '').toLowerCase().includes(debouncedSearch)

      const matchesTier = tierFilter === 'all' || plan.tier === tierFilter
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter
      const matchesBilling = billingFilter === 'all' || plan.billingFrequency === billingFilter
      return matchesSearch && matchesTier && matchesStatus && matchesBilling
    })
  }, [plans, debouncedSearch, tierFilter, statusFilter, billingFilter])

  const totalRecords = filteredPlans.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'currency' ? value.toUpperCase() : value
    }))
    if (formErrors[name as keyof PlanFormState]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const openCreateModal = () => {
    setFormMode('create')
    setFormState(DEFAULT_FORM_STATE)
    setFormErrors({})
    setActivePlan(null)
    setModalOpen(true)
  }

  const openEditModal = useCallback((plan: SubscriptionPlan) => {
    setFormMode('edit')
    setActivePlan(plan)
    setFormState({
      name: plan.name,
      tier: plan.tier,
      description: plan.description ?? '',
      price: plan.price.toString(),
      currency: plan.currency ?? 'USD',
      billingFrequency: plan.billingFrequency,
      seatsIncluded: plan.seatsIncluded?.toString() ?? '0',
      minuteAllocation: plan.minuteAllocation?.toString() ?? '',
      features: plan.features ?? [],
      status: plan.status,
      trialDays: plan.trialDays?.toString() ?? '0'
    })
    setFormErrors({})
    setModalOpen(true)
  }, [])

  const confirmDelete = useCallback((plan: SubscriptionPlan) => {
    setDeleteTarget(plan)
    setDeleteModalOpen(true)
  }, [])

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof PlanFormState, string>> = {}

    if (!formState.name.trim()) {
      nextErrors.name = 'Plan name is required.'
    }

    const price = parseFloat(formState.price)
    if (Number.isNaN(price) || price <= 0) {
      nextErrors.price = 'Enter a valid positive price.'
    }

    const seats = parseInt(formState.seatsIncluded, 10)
    if (Number.isNaN(seats) || seats < 1) {
      nextErrors.seatsIncluded = 'At least one seat is required.'
    }

    const trial = parseInt(formState.trialDays, 10)
    if (Number.isNaN(trial) || trial < 0) {
      nextErrors.trialDays = 'Trial days cannot be negative.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return
    if (!token || !isAdmin) {
      toast.error('You need admin access to modify subscription plans.')
      return
    }

    const payload: SubscriptionPlanPayload = {
      name: formState.name.trim(),
      tier: formState.tier,
      description: formState.description.trim() || undefined,
      price: parseFloat(formState.price),
      currency: (formState.currency || 'USD').toUpperCase(),
      billingFrequency: formState.billingFrequency,
      seatsIncluded: parseInt(formState.seatsIncluded, 10),
      minuteAllocation: formState.minuteAllocation ? parseInt(formState.minuteAllocation, 10) : undefined,
      features: formState.features,
      status: formState.status,
      trialDays: parseInt(formState.trialDays, 10)
    }

    setSubmitting(true)
    try {
      if (formMode === 'create') {
        const response = await subscriptionApi.createPlan(token, payload)
        if (response.error) throw new Error(response.error)
        if (response.data) {
          setPlans((prev) => [response.data as SubscriptionPlan, ...prev])
        } else {
          await fetchPlans()
        }
        toast.success('Subscription plan created.')
      } else if (activePlan) {
        const response = await subscriptionApi.updatePlan(token, activePlan.id, payload)
        if (response.error) throw new Error(response.error)
        if (response.data) {
          setPlans((prev) => prev.map((plan) => (plan.id === response.data!.id ? response.data! : plan)))
        } else {
          await fetchPlans()
        }
        toast.success('Subscription plan updated.')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save subscription plan.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget) return
    setDeleteLoading(true)
    try {
      const response = await subscriptionApi.deletePlan(token, deleteTarget.id)
      if (response.error) throw new Error(response.error)
      setPlans((prev) => prev.filter((plan) => plan.id !== deleteTarget.id))
      toast.success('Subscription plan deleted.')
      setDeleteModalOpen(false)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete subscription plan.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'tier-filter',
        label: 'Tier',
        type: 'select',
        value: tierFilter === 'all' ? '' : tierFilter,
        options: [{ label: 'All tiers', value: '' }, ...tierOptions.map((option) => ({ label: option.label, value: option.value }))],
        onChange: (value) => setTierFilter(value || 'all'),
        onClear: () => setTierFilter('all'),
        width: 3
      },
      {
        id: 'status-filter',
        label: 'Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [{ label: 'All statuses', value: '' }, ...statusOptions.map((option) => ({ label: option.label, value: option.value }))],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 3
      },
      {
        id: 'billing-filter',
        label: 'Billing',
        type: 'select',
        value: billingFilter === 'all' ? '' : billingFilter,
        options: [{ label: 'All cycles', value: '' }, ...billingOptions.map((option) => ({ label: option.label, value: option.value }))],
        onChange: (value) => setBillingFilter(value || 'all'),
        onClear: () => setBillingFilter('all'),
        width: 3
      }
    ],
    [tierFilter, statusFilter, billingFilter]
  )

  const columns: DataTableColumn<SubscriptionPlan>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Plan',
        minWidth: 240,
        render: (plan) => (
          <div>
            <div className="fw-semibold">{plan.name}</div>
            <div className="text-muted small">{plan.description || '—'}</div>
          </div>
        )
      },
      {
        key: 'tier',
        header: 'Tier',
        width: 140,
        render: (plan) => (
          <Badge bg="info" pill className="text-uppercase">
            {plan.tier}
          </Badge>
        )
      },
      {
        key: 'price',
        header: 'Price',
        width: 180,
        render: (plan) => (
          <div>
            <div className="fw-semibold">{formatCurrencyValue(plan.price, plan.currency)}</div>
            <small className="text-muted text-uppercase">{plan.billingFrequency}</small>
          </div>
        )
      },
      {
        key: 'seats',
        header: 'Seats',
        width: 110,
        align: 'center',
        render: (plan) => plan.seatsIncluded || '—'
      },
      {
        key: 'features',
        header: 'Key Features',
        minWidth: 260,
        render: (plan) => (
          <div className="d-flex flex-wrap gap-2">
            {(plan.features ?? []).slice(0, 3).map((feature) => (
              <Badge key={feature} bg="light" text="dark" className="fw-normal">
                {feature}
              </Badge>
            ))}
            {plan.features && plan.features.length > 3 && (
              <Badge bg="secondary" pill>
                +{plan.features.length - 3} more
              </Badge>
            )}
            {!plan.features?.length && <span className="text-muted small">—</span>}
          </div>
        )
      },
      {
        key: 'trialDays',
        header: 'Trial',
        width: 100,
        align: 'center',
        render: (plan) => (plan.trialDays ? `${plan.trialDays}d` : '—')
      },
      {
        key: 'status',
        header: 'Status',
        width: 130,
        render: (plan) => (
          <Badge bg={getPlanStatusVariant(plan.status)} className="text-uppercase">
            {plan.status}
          </Badge>
        )
      },
      {
        key: 'updatedAt',
        header: 'Updated',
        width: 200,
        render: (plan) => formatDateTime(plan.updatedAt || plan.createdAt)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 170,
        align: 'right',
        sticky: 'right',
        render: (plan) => (
          <div className="d-flex justify-content-end gap-2">
            <Button size="sm" variant="outline-primary" onClick={() => openEditModal(plan)}>
              <IconifyIcon icon="solar:pen-linear" width={16} height={16} />
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(plan)}>
              <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [openEditModal, confirmDelete]
  )

  return (
    <>
      <DataTable
        id="subscription-plans"
        title="Subscription Management"
        description="Create, update, and monitor the billing plans available to agents."
        columns={columns}
        data={paginatedPlans}
        rowKey={(plan) => plan.id}
        loading={loading}
        error={error}
        onRetry={fetchPlans}
        toolbar={{
          showFilters,
          onToggleFilters: () => setShowFilters((prev) => !prev),
          search: {
            value: searchQuery,
            onChange: setSearchQuery,
            onClear: () => setSearchQuery(''),
            placeholder: 'Search plans or tiers...'
          },
          filters: toolbarFilters,
          extra: (
            <Button variant="primary" onClick={openCreateModal} className="d-inline-flex align-items-center gap-2">
              <IconifyIcon icon="solar:add-circle-bold" width={18} height={18} />
              Create Plan
            </Button>
          )
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
          title: 'No subscription plans',
          description: 'Create your first plan to start selling subscriptions.'
        }}
        columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
      />

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{formMode === 'create' ? 'Create Subscription Plan' : 'Edit Subscription Plan'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="plan-name">
                  <Form.Label>Plan name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    isInvalid={Boolean(formErrors.name)}
                    placeholder="e.g. Premium"
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="plan-tier">
                  <Form.Label>Tier</Form.Label>
                  <Form.Select name="tier" value={formState.tier} onChange={handleInputChange}>
                    {tierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="plan-status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formState.status} onChange={handleInputChange}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              <Col md={4}>
                <Form.Group controlId="plan-price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    value={formState.price}
                    onChange={handleInputChange}
                    isInvalid={Boolean(formErrors.price)}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.price}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="plan-currency">
                  <Form.Label>Currency</Form.Label>
                  <Form.Control name="currency" value={formState.currency} onChange={handleInputChange} maxLength={3} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="plan-billing">
                  <Form.Label>Billing cycle</Form.Label>
                  <Form.Select name="billingFrequency" value={formState.billingFrequency} onChange={handleInputChange}>
                    {billingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="plan-trial">
                  <Form.Label>Trial days</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    name="trialDays"
                    value={formState.trialDays}
                    onChange={handleInputChange}
                    isInvalid={Boolean(formErrors.trialDays)}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.trialDays}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              <Col md={4}>
                <Form.Group controlId="plan-seats">
                  <Form.Label>Seats included</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    step="1"
                    name="seatsIncluded"
                    value={formState.seatsIncluded}
                    onChange={handleInputChange}
                    isInvalid={Boolean(formErrors.seatsIncluded)}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.seatsIncluded}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="plan-minutes">
                  <Form.Label>Minutes allocation (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="10"
                    name="minuteAllocation"
                    value={formState.minuteAllocation}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">Total AI minutes bundled into the plan.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3" controlId="plan-description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Short summary that sells the plan benefits."
              />
            </Form.Group>

            <div className="mt-3">
              <TagsInput
                tags={formState.features}
                label="Feature highlights"
                placeholder="Press enter to add key feature"
                onChange={(features) => setFormState((prev) => ({ ...prev, features }))}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="link" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting} className="d-inline-flex align-items-center gap-2">
              {submitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
              {formMode === 'create' ? 'Create plan' : 'Save changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete subscription plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            You are about to delete <span className="fw-semibold">{deleteTarget?.name}</span>.
          </p>
          <p className="text-muted mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="link" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete plan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SubscriptionPlansPage

