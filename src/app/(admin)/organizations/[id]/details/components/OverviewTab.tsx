'use client'

import React, { useState } from 'react'
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    Modal,
    Row
} from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { toast } from 'react-toastify'

type OrganizationDetails = {
    _id: string
    company_name: string
    industry: string
    vertical_key: string
    status: 'active' | 'trial' | 'suspended'
    plan_id: string
    plan_name: string
    subscription_status: 'active' | 'canceled' | 'past_due'
    primary_org_user_id: string
    primary_admin_name: string
    primary_admin_email: string
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

type OverviewTabProps = {
    organization: OrganizationDetails
    onStatusChange: (status: 'active' | 'trial' | 'suspended') => Promise<void>
    onRefresh: () => Promise<void>
}

const OverviewTab: React.FC<OverviewTabProps> = ({ organization, onStatusChange, onRefresh }) => {
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [newStatus, setNewStatus] = useState<'active' | 'trial' | 'suspended'>('active')
    const [statusUpdating, setStatusUpdating] = useState(false)
    const [billingModalOpen, setBillingModalOpen] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount)
    }

    const handleStatusChange = async () => {
        setStatusUpdating(true)
        try {
            await onStatusChange(newStatus)
            setStatusModalOpen(false)
        } catch (err) {
            // Error already handled in parent
        } finally {
            setStatusUpdating(false)
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

    // Charts configuration
    const callsChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            sparkline: { enabled: false }
        },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1
            }
        },
        colors: ['#6658dd'],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: {
            title: { text: 'Calls' }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: '#f1f3fa'
        }
    }

    const callsChartSeries = [
        {
            name: 'Calls',
            data: [120, 135, 142, 158, 165, 178, 192, 205, 218, 225, 238, 245]
        }
    ]

    const minutesChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4
            }
        },
        colors: ['#1abc9c'],
        xaxis: {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        },
        yaxis: {
            title: { text: 'Minutes' }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: '#f1f3fa'
        }
    }

    const minutesChartSeries = [
        {
            name: 'Minutes Used',
            data: [820, 910, 890, 800]
        }
    ]

    const detailCardClass = 'border rounded-3 p-3 bg-body-tertiary h-100'

    return (
        <>
            <Row>
                <Row>
                    <Col md={6} lg={3} className="mb-3">
                        <Card className="h-100">
                            <CardBody className="d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0">Calls This Month</h6>
                                    <IconifyIcon icon="solar:phone-calling-rounded-linear" width={24} height={24} className="text-primary" />
                                </div>
                                <h3 className="mb-0">{organization.usage.calls_this_month.toLocaleString()}</h3>
                                <small className="text-muted mt-auto">Total calls handled</small>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                        <Card className="h-100">
                            <CardBody className="d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0">Minutes Used</h6>
                                    <IconifyIcon icon="solar:clock-circle-linear" width={24} height={24} className="text-success" />
                                </div>

                                <h3 className="mb-0">
                                    {organization.usage.minutes_used.toLocaleString()} /{' '}
                                    {organization.usage.minutes_allocated.toLocaleString()}
                                </h3>

                                <div className="progress mt-2" style={{ height: '8px' }}>
                                    <div
                                        className="progress-bar bg-success"
                                        style={{
                                            width: `${(organization.usage.minutes_used / organization.usage.minutes_allocated) * 100}%`
                                        }}
                                    />
                                </div>

                                <small className="text-muted mt-auto">
                                    {((organization.usage.minutes_used / organization.usage.minutes_allocated) * 100).toFixed(1)}% used
                                </small>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                        <Card className="h-100">
                            <CardBody className="d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0">Active Agents</h6>
                                    <IconifyIcon icon="solar:users-group-rounded-linear" width={24} height={24} className="text-info" />
                                </div>
                                <h3 className="mb-0">
                                    {organization.usage.active_agents} / {organization.usage.max_agents}
                                </h3>
                                <small className="text-muted mt-auto">Agent capacity</small>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md={6} lg={3} className="mb-3">
                        <Card className="h-100">
                            <CardBody className="d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0">Subscription</h6>
                                    <IconifyIcon icon="solar:shield-check-linear" width={24} height={24} className="text-warning" />
                                </div>
                                <h3 className="mb-0">
                                    {formatCurrency(organization.billing.amount, organization.billing.currency)}
                                </h3>
                                <small className="text-muted mt-auto">per month</small>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Info Cards */}
                <Col lg={4}>
                    <Card className="mb-3">
                        <CardHeader>
                            <CardTitle as="h5">Organization Info</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="mb-3">
                                <label className="text-muted small">Organization ID</label>
                                <div className="fw-medium">{organization._id}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Vertical</label>
                                <div>
                                    <Badge bg="light" text="dark" className="text-uppercase">
                                        {organization.vertical_key}
                                    </Badge>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Primary Admin</label>
                                <div className="fw-medium">{organization.primary_admin_name}</div>
                                <div className="text-muted small">{organization.primary_admin_email}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Created</label>
                                <div>{formatDate(organization.created_at)}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Last Updated</label>
                                <div>{formatDate(organization.updated_at)}</div>
                            </div>
                            <div className="d-grid">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => {
                                        setNewStatus(organization.status)
                                        setStatusModalOpen(true)
                                    }}
                                >
                                    <IconifyIcon icon="solar:settings-linear" width={16} height={16} className="me-1" />
                                    Manage Status
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h5">Subscription & Billing</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="mb-3">
                                <label className="text-muted small">Current Plan</label>
                                <div className="fw-semibold fs-5">{organization.plan_name}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Subscription Status</label>
                                <div>
                                    <Badge bg={getStatusVariant(organization.subscription_status)}>
                                        {organization.subscription_status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Current Period</label>
                                <div className="small">
                                    {formatDate(organization.billing.current_period_start)} -{' '}
                                    {formatDate(organization.billing.current_period_end)}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Monthly Amount</label>
                                <div className="fw-semibold fs-5">
                                    {formatCurrency(organization.billing.amount, organization.billing.currency)}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Next Billing Date</label>
                                <div>{formatDate(organization.billing.next_billing_date)}</div>
                            </div>
                            <div className="d-grid">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setBillingModalOpen(true)}
                                >
                                    <IconifyIcon icon="solar:card-linear" className="me-1" />
                                    Manage Billing
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                {/* Usage & Limits */}
                <Col lg={8}>

                    {/* Charts */}
                    <Card className="mb-3">
                        <CardHeader>
                            <CardTitle as="h5">Call Volume Trend</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <ReactApexChart
                                options={callsChartOptions}
                                series={callsChartSeries}
                                type="area"
                                height={300}
                            />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h5">Minutes Usage (Weekly)</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <ReactApexChart
                                options={minutesChartOptions}
                                series={minutesChartSeries}
                                type="bar"
                                height={300}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Status Change Modal */}
            <Modal show={statusModalOpen} onHide={() => setStatusModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Organization Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select New Status</Form.Label>
                        <Form.Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as any)}
                        >
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="suspended">Suspended</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                            This will immediately change the organization&apos;s access level.
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="link" onClick={() => setStatusModalOpen(false)} disabled={statusUpdating}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleStatusChange} disabled={statusUpdating}>
                        {statusUpdating ? 'Updating...' : 'Update Status'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Billing Management Modal */}
            <Modal show={billingModalOpen} onHide={() => setBillingModalOpen(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Billing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={6}>
                            <div className={detailCardClass}>
                                <label className="text-muted small">Stripe Customer ID</label>
                                <div className="fw-medium font-monospace small">
                                    {organization.billing.stripe_customer_id || '—'}
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className={detailCardClass}>
                                <label className="text-muted small">Stripe Subscription ID</label>
                                <div className="fw-medium font-monospace small">
                                    {organization.billing.stripe_subscription_id || '—'}
                                </div>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <div className="d-flex flex-column gap-2">
                                <Button variant="outline-primary">
                                    <IconifyIcon icon="solar:card-transfer-linear" className="me-2" />
                                    View Stripe Customer
                                </Button>
                                <Button variant="outline-info">
                                    <IconifyIcon icon="solar:restart-linear" className="me-2" />
                                    Change Subscription Plan
                                </Button>
                                <Button variant="outline-warning">
                                    <IconifyIcon icon="solar:pause-circle-linear" className="me-2" />
                                    Pause Subscription
                                </Button>
                                <Button variant="outline-danger">
                                    <IconifyIcon icon="solar:close-circle-linear" className="me-2" />
                                    Cancel Subscription
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setBillingModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default OverviewTab