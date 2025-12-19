'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { couponApi } from '@/lib/coupon-api'
import { subscriptionApi } from '@/lib/subscription-api'
import Link from 'next/link'
import type {
  Coupon,
  CouponPayload,
  CouponStatus,
  CouponDiscountType,
  SubscriptionPlan
} from '@/types/billing'
import {
  formatCurrencyValue,
  formatDateRange,
  getCouponStatusVariant
} from '@/helpers/billing'

type CouponFormState = {
  code: string
  name: string
  description: string
  discountType: CouponDiscountType
  discountValue: string
  currency: string
  maxRedemptions: string
  perUserLimit: string
  appliesToPlanIds: string[]
  startDate: string
  endDate: string
  status: CouponStatus
  notes: string
}

const DEFAULT_COUPON_FORM: CouponFormState = {
  code: '',
  name: '',
  description: '',
  discountType: 'percentage',
  discountValue: '10',
  currency: 'USD',
  maxRedemptions: '',
  perUserLimit: '',
  appliesToPlanIds: [],
  startDate: '',
  endDate: '',
  status: 'draft',
  notes: ''
}

const now = new Date()
const nextMonth = new Date(now)
nextMonth.setMonth(now.getMonth() + 1)

const DEMO_COUPONS: Coupon[] = [
  {
    id: 'launch-20',
    code: 'LAUNCH20',
    name: 'Launch Special 20%',
    description: 'Celebrate the Agentic AI HR launch with 20% off.',
    discountType: 'percentage',
    discountValue: 20,
    currency: 'USD',
    maxRedemptions: 200,
    perUserLimit: 1,
    appliesToPlanIds: ['basic', 'pro'],
    startDate: now.toISOString(),
    endDate: nextMonth.toISOString(),
    status: 'active',
    usageCount: 34,
    notes: 'Auto-applies to onboarding flows.'
  },
  {
    id: 'pro-50',
    code: 'PROSAVE50',
    name: 'Pro Upgrade $50 Off',
    description: 'One-time $50 discount when upgrading to Pro or Premium.',
    discountType: 'fixed',
    discountValue: 50,
    currency: 'USD',
    maxRedemptions: 100,
    perUserLimit: 1,
    appliesToPlanIds: ['pro', 'premium'],
    startDate: now.toISOString(),
    status: 'scheduled',
    usageCount: 0
  },
  {
    id: 'friends25',
    code: 'FRIENDS25',
    name: 'Friends 25% Off',
    description: 'Reward referrals with a recurring 25% discount.',
    discountType: 'percentage',
    discountValue: 25,
    currency: 'USD',
    maxRedemptions: 500,
    appliesToPlanIds: ['basic', 'pro', 'premium'],
    startDate: now.toISOString(),
    endDate: undefined,
    status: 'draft',
    usageCount: 0
  }
]

const discountTypeOptions: { label: string; value: CouponDiscountType }[] = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed amount', value: 'fixed' }
]

const couponStatusOptions: { label: string; value: CouponStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Draft', value: 'draft' },
  { label: 'Expired', value: 'expired' }
]

const CouponManagementPage = () => {
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [coupons, setCoupons] = useState<Coupon[]>(DEMO_COUPONS)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planLoading, setPlanLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [discountFilter, setDiscountFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [formState, setFormState] = useState<CouponFormState>(DEFAULT_COUPON_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CouponFormState, string>>>({})
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, discountFilter, planFilter])

  const fetchCoupons = useCallback(async () => {
    if (!token || !isAdmin) return
    setLoading(true)
    setError(null)
    try {
      const response = await couponApi.listCoupons(token)
      if (response.error) {
        setError(response.error)
        return
      }
      const payload = Array.isArray(response.data) ? response.data : response.data?.items ?? []
      if (payload && payload.length) {
        setCoupons(payload)
      } else {
        setCoupons([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load coupons.')
    } finally {
      setLoading(false)
    }
  }, [isAdmin, token])

  const fetchPlans = useCallback(async () => {
    if (!token || !isAdmin) return
    setPlanLoading(true)
    try {
      const response = await subscriptionApi.listPlans(token)
      if (!response.error) {
        const payload = Array.isArray(response.data) ? response.data : response.data?.items ?? []
        if (payload && payload.length) {
          setPlans(payload)
        }
      }
    } finally {
      setPlanLoading(false)
    }
  }, [isAdmin, token])

  useEffect(() => {
    fetchPlans()
    fetchCoupons()
  }, [fetchPlans, fetchCoupons])

  const planLookup = useMemo(() => {
    const map: Record<string, string> = {}
    plans.forEach((plan) => {
      map[plan.id] = plan.name
    })
    return map
  }, [plans])

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        !debouncedSearch ||
        coupon.code.toLowerCase().includes(debouncedSearch) ||
        coupon.name.toLowerCase().includes(debouncedSearch) ||
        (coupon.description ?? '').toLowerCase().includes(debouncedSearch)

      const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter
      const matchesDiscount = discountFilter === 'all' || coupon.discountType === discountFilter
      const matchesPlan =
        planFilter === 'all' ||
        (coupon.appliesToPlanIds ?? []).includes(planFilter)

      return matchesSearch && matchesStatus && matchesDiscount && matchesPlan
    })
  }, [coupons, debouncedSearch, statusFilter, discountFilter, planFilter])

  const totalRecords = filteredCoupons.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]:
        name === 'code'
          ? value.toUpperCase().replace(/\s/g, '')
          : name === 'currency'
            ? value.toUpperCase()
            : value
    }))
    if (formErrors[name as keyof CouponFormState]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const openCreateModal = () => {
    setFormMode('create')
    setFormState(DEFAULT_COUPON_FORM)
    setFormErrors({})
    setActiveCoupon(null)
    setModalOpen(true)
  }

  const openEditModal = useCallback((coupon: Coupon) => {
    setFormMode('edit')
    setActiveCoupon(coupon)
    setFormState({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description ?? '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      currency: coupon.currency ?? 'USD',
      maxRedemptions: coupon.maxRedemptions?.toString() ?? '',
      perUserLimit: coupon.perUserLimit?.toString() ?? '',
      appliesToPlanIds: coupon.appliesToPlanIds ?? [],
      startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : '',
      endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : '',
      status: coupon.status,
      notes: coupon.notes ?? ''
    })
    setFormErrors({})
    setModalOpen(true)
  }, [])

  const confirmDelete = useCallback((coupon: Coupon) => {
    setDeleteTarget(coupon)
    setDeleteModalOpen(true)
  }, [])

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof CouponFormState, string>> = {}

    if (!formState.code.trim()) {
      nextErrors.code = 'Coupon code is required.'
    }

    if (!formState.name.trim()) {
      nextErrors.name = 'Coupon name is required.'
    }

    const value = parseFloat(formState.discountValue)
    if (Number.isNaN(value) || value <= 0) {
      nextErrors.discountValue = 'Provide a positive discount value.'
    }

    if (formState.startDate && formState.endDate && formState.startDate > formState.endDate) {
      nextErrors.endDate = 'End date must be after the start date.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return
    if (!token || !isAdmin) {
      toast.error('You need admin access to manage coupons.')
      return
    }

    const payload: CouponPayload = {
      code: formState.code.trim(),
      name: formState.name.trim(),
      description: formState.description.trim() || undefined,
      discountType: formState.discountType,
      discountValue: parseFloat(formState.discountValue),
      currency: formState.discountType === 'fixed' ? (formState.currency || 'USD').toUpperCase() : undefined,
      maxRedemptions: formState.maxRedemptions ? parseInt(formState.maxRedemptions, 10) : undefined,
      perUserLimit: formState.perUserLimit ? parseInt(formState.perUserLimit, 10) : undefined,
      appliesToPlanIds: formState.appliesToPlanIds.length ? formState.appliesToPlanIds : undefined,
      startDate: formState.startDate || undefined,
      endDate: formState.endDate || undefined,
      status: formState.status,
      notes: formState.notes.trim() || undefined
    }

    setSubmitting(true)
    try {
      if (formMode === 'create') {
        const response = await couponApi.createCoupon(token, payload)
        if (response.error) throw new Error(response.error)
        if (response.data) {
          setCoupons((prev) => [response.data as Coupon, ...prev])
        } else {
          await fetchCoupons()
        }
        toast.success('Coupon created.')
      } else if (activeCoupon) {
        const response = await couponApi.updateCoupon(token, activeCoupon.id, payload)
        if (response.error) throw new Error(response.error)
        if (response.data) {
          setCoupons((prev) => prev.map((coupon) => (coupon.id === response.data!.id ? response.data! : coupon)))
        } else {
          await fetchCoupons()
        }
        toast.success('Coupon updated.')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save coupon.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget) return
    setDeleteLoading(true)
    try {
      const response = await couponApi.deleteCoupon(token, deleteTarget.id)
      if (response.error) throw new Error(response.error)
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== deleteTarget.id))
      toast.success('Coupon deleted.')
      setDeleteModalOpen(false)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete coupon.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const renderDiscountValue = (coupon: Coupon) =>
    coupon.discountType === 'percentage'
      ? `${coupon.discountValue}%`
      : formatCurrencyValue(coupon.discountValue, coupon.currency ?? 'USD')

  const planFilterOptions = useMemo(
    () => plans.map((plan) => ({ label: plan.name, value: plan.id })),
    [plans]
  )

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'status-filter',
        label: 'Status',
        type: 'select',
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [{ label: 'All statuses', value: '' }, ...couponStatusOptions.map((option) => ({ label: option.label, value: option.value }))],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 3
      },
      {
        id: 'discount-filter',
        label: 'Discount type',
        type: 'select',
        value: discountFilter === 'all' ? '' : discountFilter,
        options: [{ label: 'All types', value: '' }, ...discountTypeOptions.map((option) => ({ label: option.label, value: option.value }))],
        onChange: (value) => setDiscountFilter(value || 'all'),
        onClear: () => setDiscountFilter('all'),
        width: 3
      },
      {
        id: 'plan-filter',
        label: 'Plan',
        type: 'select',
        value: planFilter === 'all' ? '' : planFilter,
        options: [{ label: 'All plans', value: '' }, ...planFilterOptions],
        onChange: (value) => setPlanFilter(value || 'all'),
        onClear: () => setPlanFilter('all'),
        width: 4
      }
    ],
    [statusFilter, discountFilter, planFilter, planFilterOptions]
  )

  const columns: DataTableColumn<Coupon>[] = useMemo(
    () => [
      {
        key: 'code',
        header: 'Coupon',
        minWidth: 200,
        render: (coupon) => (
          <div>
            <div className="fw-semibold">{coupon.code}</div>
            <div className="text-muted small">{coupon.name}</div>
          </div>
        )
      },
      {
        key: 'discount',
        header: 'Discount',
        width: 160,
        render: (coupon) => (
          <div>
            <div className="fw-semibold">{renderDiscountValue(coupon)}</div>
            <small className="text-muted">{coupon.discountType === 'percentage' ? 'Recurring' : 'One-time credit'}</small>
          </div>
        )
      },
      {
        key: 'appliesTo',
        header: 'Applies to',
        minWidth: 220,
        render: (coupon) => (
          <div className="d-flex flex-wrap gap-2">
            {(coupon.appliesToPlanIds ?? []).length === 0 && <span className="text-muted small">All plans</span>}
            {(coupon.appliesToPlanIds ?? []).map((planId) => (
              <Badge key={planId} bg="light" text="dark">
                {planLookup[planId] ?? planId}
              </Badge>
            ))}
          </div>
        )
      },
      {
        key: 'window',
        header: 'Schedule',
        width: 220,
        render: (coupon) => formatDateRange(coupon.startDate, coupon.endDate)
      },
      {
        key: 'usage',
        header: 'Usage',
        width: 140,
        align: 'center',
        render: (coupon) => {
          const max = coupon.maxRedemptions ?? '∞'
          const used = coupon.usageCount ?? 0
          return (
            <div>
              <div className="fw-semibold">{used}</div>
              <small className="text-muted">of {max}</small>
            </div>
          )
        }
      },
      {
        key: 'status',
        header: 'Status',
        width: 130,
        render: (coupon) => (
          <Badge bg={getCouponStatusVariant(coupon.status)} className="text-uppercase">
            {coupon.status}
          </Badge>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 170,
        align: 'right',
        sticky: 'right',
        render: (coupon) => (
          <div className="d-flex justify-content-end gap-2">
            <Button size="sm" variant="outline-primary" onClick={() => openEditModal(coupon)}>
              <IconifyIcon icon="solar:pen-linear" width={16} height={16} />
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(coupon)}>
              <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [planLookup, openEditModal, confirmDelete]
  )

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Coupons and Promotions</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assisstant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Coupons Management</li>
              </ol>
            </div>
            <Button variant="primary" onClick={openCreateModal} className="d-inline-flex align-items-center gap-2">
              <IconifyIcon icon="solar:add-circle-bold" width={18} height={18} />
              Create Plan
            </Button>
          </div>
        </Col>
      </Row>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          onClick={openCreateModal}
          className="d-inline-flex align-items-center gap-2"
        >
          <IconifyIcon icon="solar:add-circle-bold" width={18} height={18} />
          New coupon
        </Button>
      </div>
      <DataTable
        id='coupon-management'
        title='Coupon Management'
        description='Define promotional incentives, control redemption limits, and keep offers compliant.'
        columns={columns}
        data={paginatedCoupons}
        rowKey={(coupon) => coupon.id}
        loading={loading}
        error={error}
        onRetry={fetchCoupons}
        toolbar={{
          showFilters,
          onToggleFilters: () => setShowFilters((prev) => !prev),
          search: {
            value: searchQuery,
            onChange: setSearchQuery,
            onClear: () => setSearchQuery(''),
            placeholder: 'Search coupons or codes...'
          },
          filters: toolbarFilters,
          // extra: (
          //   <Button variant='primary' onClick={openCreateModal} className='d-inline-flex align-items-center gap-2'>
          //     <IconifyIcon icon='solar:add-circle-bold' width={18} height={18} />
          //     New coupon
          //   </Button>
          // )
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
          title: 'No coupons yet',
          description: 'Create your first promotion to reward your customers.'
        }}
        columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
      />

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size='lg' backdrop='static' centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{formMode === 'create' ? 'Create coupon' : 'Edit coupon'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className='g-3'>
              <Col md={4}>
                <Form.Group controlId='coupon-code'>
                  <Form.Label>Coupon code</Form.Label>
                  <Form.Control
                    name='code'
                    value={formState.code}
                    onChange={handleFieldChange}
                    isInvalid={Boolean(formErrors.code)}
                    placeholder='e.g. SAVE20'
                  />
                  <Form.Control.Feedback type='invalid'>{formErrors.code}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId='coupon-name'>
                  <Form.Label>Display name</Form.Label>
                  <Form.Control
                    name='name'
                    value={formState.name}
                    onChange={handleFieldChange}
                    isInvalid={Boolean(formErrors.name)}
                    placeholder='Holiday flash sale'
                  />
                  <Form.Control.Feedback type='invalid'>{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className='g-3 mt-1'>
              <Col md={3}>
                <Form.Group controlId='coupon-type'>
                  <Form.Label>Discount type</Form.Label>
                  <Form.Select name='discountType' value={formState.discountType} onChange={handleFieldChange}>
                    {discountTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId='coupon-value'>
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    type='number'
                    name='discountValue'
                    min='1'
                    step='0.01'
                    value={formState.discountValue}
                    onChange={handleFieldChange}
                    isInvalid={Boolean(formErrors.discountValue)}
                  />
                  <Form.Control.Feedback type='invalid'>{formErrors.discountValue}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              {formState.discountType === 'fixed' && (
                <Col md={2}>
                  <Form.Group controlId='coupon-currency'>
                    <Form.Label>Currency</Form.Label>
                    <Form.Control name='currency' value={formState.currency} onChange={handleFieldChange} maxLength={3} />
                  </Form.Group>
                </Col>
              )}
              <Col md={formState.discountType === 'fixed' ? 2 : 3}>
                <Form.Group controlId='coupon-status'>
                  <Form.Label>Status</Form.Label>
                  <Form.Select name='status' value={formState.status} onChange={handleFieldChange}>
                    {couponStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className='g-3 mt-1'>
              <Col md={3}>
                <Form.Group controlId='coupon-max'>
                  <Form.Label>Max redemptions</Form.Label>
                  <Form.Control
                    type='number'
                    min='1'
                    step='1'
                    name='maxRedemptions'
                    value={formState.maxRedemptions}
                    onChange={handleFieldChange}
                  />
                  <Form.Text className='text-muted'>Leave blank for unlimited.</Form.Text>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId='coupon-per-user'>
                  <Form.Label>Per user limit</Form.Label>
                  <Form.Control
                    type='number'
                    min='1'
                    step='1'
                    name='perUserLimit'
                    value={formState.perUserLimit}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId='coupon-start'>
                  <Form.Label>Start date</Form.Label>
                  <Form.Control type='date' name='startDate' value={formState.startDate} onChange={handleFieldChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId='coupon-end'>
                  <Form.Label>End date</Form.Label>
                  <Form.Control
                    type='date'
                    name='endDate'
                    value={formState.endDate}
                    onChange={handleFieldChange}
                    isInvalid={Boolean(formErrors.endDate)}
                  />
                  <Form.Control.Feedback type='invalid'>{formErrors.endDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className='mt-3'>
              <Form.Label>Applies to plans</Form.Label>
              {planLoading ? (
                <div className='text-muted small'>Loading plans...</div>
              ) : plans.length === 0 ? (
                <div className='text-muted small'>No plans available</div>
              ) : (
                <>
                  <div
                    className='border rounded p-3'
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'var(--bs-body-bg, #fff)'
                    }}
                  >
                    <div className='d-flex flex-column gap-2'>
                      {plans.map((plan) => {
                        const isChecked = formState.appliesToPlanIds.includes(plan.id)
                        return (
                          <Form.Check
                            key={plan.id}
                            type='checkbox'
                            id={`plan-${plan.id}`}
                            label={
                              <div className='d-flex justify-content-between align-items-center w-100'>
                                <span>{plan.name}</span>
                                <Badge bg='secondary' className='text-uppercase' style={{ fontSize: '0.7rem' }}>
                                  {plan.tier}
                                </Badge>
                              </div>
                            }
                            checked={isChecked}
                            onChange={(e) => {
                              const { checked } = e.target
                              setFormState((prev) => ({
                                ...prev,
                                appliesToPlanIds: checked
                                  ? [...prev.appliesToPlanIds, plan.id]
                                  : prev.appliesToPlanIds.filter((id) => id !== plan.id)
                              }))
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <div className='d-flex justify-content-between align-items-center mt-2'>
                    <Form.Text className='text-muted mb-0'>
                      {formState.appliesToPlanIds.length === 0
                        ? 'Select plans to restrict coupon, or leave all unchecked to apply to every plan.'
                        : `${formState.appliesToPlanIds.length} plan${formState.appliesToPlanIds.length !== 1 ? 's' : ''} selected`}
                    </Form.Text>
                    {formState.appliesToPlanIds.length > 0 && (
                      <Button
                        variant='link'
                        size='sm'
                        className='p-0 text-decoration-none'
                        onClick={() => {
                          setFormState((prev) => ({ ...prev, appliesToPlanIds: [] }))
                        }}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </>
              )}
            </Form.Group>

            <Form.Group className='mt-3'>
              <Form.Label>Short description</Form.Label>
              <Form.Control
                as='textarea'
                rows={2}
                name='description'
                value={formState.description}
                onChange={handleFieldChange}
                placeholder='Customer-facing summary (optional)'
              />
            </Form.Group>

            <Form.Group className='mt-3'>
              <Form.Label>Internal notes</Form.Label>
              <Form.Control
                as='textarea'
                rows={2}
                name='notes'
                value={formState.notes}
                onChange={handleFieldChange}
                placeholder='Launch channel, owner, or special instructions'
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className='justify-content-between'>
            <Button variant='link' onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type='submit' variant='primary' disabled={submitting} className='d-inline-flex align-items-center gap-2'>
              {submitting && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true' />}
              {formMode === 'create' ? 'Create coupon' : 'Save changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='mb-2'>
            Delete <span className='fw-semibold'>{deleteTarget?.code}</span>? This removes the offer immediately.
          </p>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button variant='link' onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete coupon'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CouponManagementPage

