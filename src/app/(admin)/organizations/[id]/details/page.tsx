'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Tab,
  Tabs
} from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import OverviewTab from './components/OverviewTab'
import AgentsTab from './components/AgentsTab'
import SupportTab from './components/SupportTab'

type OrganizationDetails = {
  _id: string
  company_name: string
  logo_url?: string
  industry: string
  vertical_key: string
  status: 'active' | 'trial' | 'suspended'
  plan_id: string
  plan_name: string
  subscription_status: 'active' | 'canceled' | 'past_due'
  primary_org_user_id: string
  primary_admin_name: string
  primary_admin_email: string
  agent_id?: string[]
  created_at: string
  updated_at: string
  usage: {
    calls_this_month: number
    minutes_used: number
    minutes_allocated: number
    active_agents: number
    max_agents: number
  }
  billing: {
    current_period_start: string
    current_period_end: string
    amount: number
    currency: string
    next_billing_date: string
    stripe_customer_id?: string
    stripe_subscription_id?: string
  }
}

// Mock data
const MOCK_ORG_DETAILS: OrganizationDetails = {
  _id: 'org_001',
  company_name: 'TechCorp Solutions',
  logo_url: '',
  industry: 'Technology',
  vertical_key: 'hr',
  status: 'active',
  plan_id: 'plan_pro',
  plan_name: 'Pro Plan',
  subscription_status: 'active',
  primary_org_user_id: 'user_001',
  primary_admin_name: 'John Smith',
  primary_admin_email: 'john.smith@techcorp.com',
  agent_id: ['agent_001', 'agent_002'],
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-12-15T14:30:00Z',
  usage: {
    calls_this_month: 1245,
    minutes_used: 3420,
    minutes_allocated: 5000,
    active_agents: 2,
    max_agents: 5
  },
  billing: {
    current_period_start: '2024-12-01T00:00:00Z',
    current_period_end: '2024-12-31T23:59:59Z',
    amount: 299,
    currency: 'USD',
    next_billing_date: '2025-01-01T00:00:00Z',
    stripe_customer_id: 'cus_123456789',
    stripe_subscription_id: 'sub_987654321'
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'trial':
      return 'warning'
    case 'suspended':
      return 'danger'
    case 'canceled':
      return 'secondary'
    case 'past_due':
      return 'danger'
    default:
      return 'secondary'
  }
}

const OrganizationDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const orgId = params?.id as string

  const [organization, setOrganization] = useState<OrganizationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!orgId || !token || !isAdmin) return

    const fetchOrganization = async () => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Replace with actual API call
        // const response = await organizationApi.get(token, orgId)
        // if (response.error) throw new Error(response.error)
        // setOrganization(response.data)

        // Using mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setOrganization(MOCK_ORG_DETAILS)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load organization.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [orgId, token, isAdmin])

  const handleStatusChange = async (newStatus: 'active' | 'trial' | 'suspended') => {
    if (!token || !orgId) return
    try {
      // TODO: Replace with actual API call
      // const response = await organizationApi.updateStatus(token, orgId, newStatus)
      // if (response.error) throw new Error(response.error)
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setOrganization(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success('Organization status updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleRefresh = useCallback(async () => {
    if (!orgId || !token || !isAdmin) return
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setOrganization(MOCK_ORG_DETAILS)
      toast.success('Organization data refreshed')
    } catch (err) {
      toast.error('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }, [orgId, token, isAdmin])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !organization) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <IconifyIcon icon="solar:danger-circle-outline" width={64} height={64} className="text-danger mb-3" />
          <h4>Error Loading Organization</h4>
          <p className="text-muted">{error || 'Organization not found'}</p>
          <Button variant="primary" onClick={() => router.push('/organizations')}>
            Back to Organizations
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      {/* Header */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="link"
              className="p-0 text-muted"
              onClick={() => router.push('/organizations')}
            >
              <IconifyIcon icon="solar:arrow-left-linear" width={24} height={24} />
            </Button>
            <div className="flex-grow-1">
              <h3 className="mb-1">{organization.company_name}</h3>
              <p className="text-muted mb-0">{organization.industry}</p>
            </div>
            <Badge bg={getStatusVariant(organization.status)} className="text-uppercase px-3 py-2">
              {organization.status}
            </Badge>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              className="d-flex align-items-center gap-1"
            >
              <IconifyIcon icon="solar:refresh-linear" width={16} height={16} />
              Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'overview')}
        className="mb-3"
      >
        <Tab eventKey="overview" title="Overview">
          <OverviewTab 
            organization={organization}
            onStatusChange={handleStatusChange}
            onRefresh={handleRefresh}
          />
        </Tab>

        <Tab eventKey="agents" title="Agents">
          <AgentsTab 
            organization={organization}
            onRefresh={handleRefresh}
          />
        </Tab>

        <Tab eventKey="support" title="Support">
          <SupportTab 
            organization={organization}
            onRefresh={handleRefresh}
          />
        </Tab>
      </Tabs>
    </>
  )
}

export default OrganizationDetailsPage

export const dynamic = 'force-dynamic'
