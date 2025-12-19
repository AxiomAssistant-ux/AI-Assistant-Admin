'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'

type Organization = {
  _id: string
  company_name: string
  industry: string
  vertical_key: string
  status: 'active' | 'trial' | 'suspended'
  plan_id: string
  plan_name?: string
  primary_org_user_id: string
  primary_admin_name?: string
  primary_admin_email?: string
  subscription_status: 'active' | 'canceled' | 'past_due'
  created_at: string
}

// Mock data
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    _id: 'org_001',
    company_name: 'TechCorp Solutions',
    industry: 'Technology',
    vertical_key: 'hr',
    status: 'active',
    plan_id: 'plan_pro',
    plan_name: 'Pro Plan',
    primary_org_user_id: 'user_001',
    primary_admin_name: 'John Smith',
    primary_admin_email: 'john.smith@techcorp.com',
    subscription_status: 'active',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: 'org_002',
    company_name: 'Dental Care Plus',
    industry: 'Healthcare',
    vertical_key: 'dental',
    status: 'trial',
    plan_id: 'plan_basic',
    plan_name: 'Basic Plan',
    primary_org_user_id: 'user_002',
    primary_admin_name: 'Sarah Johnson',
    primary_admin_email: 'sarah@dentalcare.com',
    subscription_status: 'active',
    created_at: '2024-11-20T14:30:00Z'
  },
  {
    _id: 'org_003',
    company_name: 'Gourmet Delights Restaurant',
    industry: 'Food & Beverage',
    vertical_key: 'food',
    status: 'active',
    plan_id: 'plan_enterprise',
    plan_name: 'Enterprise Plan',
    primary_org_user_id: 'user_003',
    primary_admin_name: 'Michael Chen',
    primary_admin_email: 'michael@gourmetdelights.com',
    subscription_status: 'active',
    created_at: '2024-03-10T09:15:00Z'
  },
  {
    _id: 'org_004',
    company_name: 'Style & Shine Salon',
    industry: 'Beauty & Wellness',
    vertical_key: 'salon',
    status: 'suspended',
    plan_id: 'plan_pro',
    plan_name: 'Pro Plan',
    primary_org_user_id: 'user_004',
    primary_admin_name: 'Emma Rodriguez',
    primary_admin_email: 'emma@styleshine.com',
    subscription_status: 'past_due',
    created_at: '2024-02-05T11:45:00Z'
  },
  {
    _id: 'org_005',
    company_name: 'City General Hospital',
    industry: 'Healthcare',
    vertical_key: 'hospital',
    status: 'active',
    plan_id: 'plan_enterprise',
    plan_name: 'Enterprise Plan',
    primary_org_user_id: 'user_005',
    primary_admin_name: 'Dr. James Wilson',
    primary_admin_email: 'j.wilson@cityhospital.org',
    subscription_status: 'active',
    created_at: '2023-12-01T08:00:00Z'
  },
  {
    _id: 'org_006',
    company_name: 'HR Innovations Inc',
    industry: 'Human Resources',
    vertical_key: 'hr',
    status: 'trial',
    plan_id: 'plan_pro',
    plan_name: 'Pro Plan',
    primary_org_user_id: 'user_006',
    primary_admin_name: 'Lisa Thompson',
    primary_admin_email: 'lisa.t@hrinnovations.com',
    subscription_status: 'active',
    created_at: '2024-12-10T16:20:00Z'
  }
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Trial', value: 'trial' },
  { label: 'Suspended', value: 'suspended' }
]

const verticalOptions = [
  { label: 'HR', value: 'hr' },
  { label: 'Food', value: 'food' },
  { label: 'Dental', value: 'dental' },
  { label: 'Salon', value: 'salon' },
  { label: 'Hospital', value: 'hospital' }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'trial':
      return 'warning'
    case 'suspended':
      return 'danger'
    default:
      return 'secondary'
  }
}

const OrganizationsPage = () => {
  const router = useRouter()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [organizations, setOrganizations] = useState<Organization[]>(MOCK_ORGANIZATIONS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verticalFilter, setVerticalFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, verticalFilter])

  const fetchOrganizations = useCallback(async () => {
    if (!token || !isAdmin) return
    setLoading(true)
    setError(null)
    try {
      // TODO: Replace with actual API call
      // const response = await organizationApi.list(token)
      // if (response.error) throw new Error(response.error)
      // setOrganizations(response.data)
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 500))
      setOrganizations(MOCK_ORGANIZATIONS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load organizations.')
    } finally {
      setLoading(false)
    }
  }, [isAdmin, token])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        !debouncedSearch ||
        org.company_name.toLowerCase().includes(debouncedSearch) ||
        org.industry.toLowerCase().includes(debouncedSearch) ||
        (org.primary_admin_name ?? '').toLowerCase().includes(debouncedSearch) ||
        (org.primary_admin_email ?? '').toLowerCase().includes(debouncedSearch)

      const matchesStatus = statusFilter === 'all' || org.status === statusFilter
      const matchesVertical = verticalFilter === 'all' || org.vertical_key === verticalFilter

      return matchesSearch && matchesStatus && matchesVertical
    })
  }, [organizations, debouncedSearch, statusFilter, verticalFilter])

  const totalRecords = filteredOrganizations.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleViewDetails = useCallback((orgId: string) => {
    router.push(`/organizations/${orgId}/details`)
  }, [router])

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
          ...statusOptions
        ],
        onChange: (value) => setStatusFilter(value || 'all'),
        onClear: () => setStatusFilter('all'),
        width: 3
      },
      {
        id: 'vertical-filter',
        label: 'Vertical',
        type: 'select',
        value: verticalFilter === 'all' ? '' : verticalFilter,
        options: [
          { label: 'All verticals', value: '' },
          ...verticalOptions
        ],
        onChange: (value) => setVerticalFilter(value || 'all'),
        onClear: () => setVerticalFilter('all'),
        width: 3
      }
    ],
    [statusFilter, verticalFilter]
  )

  const columns: DataTableColumn<Organization>[] = useMemo(
    () => [
      {
        key: 'company_name',
        header: 'Organization',
        minWidth: 250,
        render: (org) => (
          <div>
            <div className="fw-semibold">{org.company_name}</div>
            <div className="text-muted small">{org.industry}</div>
          </div>
        )
      },
      {
        key: 'vertical_key',
        header: 'Vertical',
        width: 120,
        render: (org) => (
          <Badge bg="light" text="dark" className="text-uppercase">
            {org.vertical_key}
          </Badge>
        )
      },
      {
        key: 'plan',
        header: 'Plan',
        width: 150,
        render: (org) => (
          <span className="fw-medium">{org.plan_name ?? org.plan_id}</span>
        )
      },
      {
        key: 'status',
        header: 'Status',
        width: 130,
        render: (org) => (
          <Badge bg={getStatusVariant(org.status)} className="text-uppercase">
            {org.status}
          </Badge>
        )
      },
      {
        key: 'primary_admin',
        header: 'Primary Admin',
        minWidth: 220,
        render: (org) => (
          <div>
            <div className="fw-medium">{org.primary_admin_name ?? 'N/A'}</div>
            <div className="text-muted small">{org.primary_admin_email ?? ''}</div>
          </div>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        width: 140,
        render: (org) => formatDate(org.created_at)
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 120,
        align: 'right',
        sticky: 'right',
        render: (org) => (
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleViewDetails(org._id)}
            className="d-inline-flex align-items-center gap-1"
          >
            <IconifyIcon icon="solar:eye-linear" width={16} height={16} />
            View
          </Button>
        )
      }
    ],
    [handleViewDetails]
  )

  return (
    <>
    <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Organizations</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">AI Assisstant</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Organizations</li>
            </ol>
          </div>
        </Col>
      </Row>
      <DataTable
        id="organization-management"
        title="Organization Management"
        description="Manage organizations, their subscriptions, and access controls."
        columns={columns}
        data={paginatedOrganizations}
        rowKey={(org) => org._id}
        loading={loading}
        error={error}
        onRetry={fetchOrganizations}
        toolbar={{
          showFilters,
          onToggleFilters: () => setShowFilters((prev) => !prev),
          search: {
            value: searchQuery,
            onChange: setSearchQuery,
            onClear: () => setSearchQuery(''),
            placeholder: 'Search organizations...'
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
          title: 'No organizations found',
          description: 'Organizations will appear here once they are created.'
        }}
        columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
      />
    </>
  )
}

export default OrganizationsPage