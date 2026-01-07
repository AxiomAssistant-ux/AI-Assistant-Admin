'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { usageApi, type UsageOverviewResponse } from '@/api/org/usage'
import { useFeatureGuard } from '@/hooks/useFeatureGuard'

const UsageAndBillingPage = () => {
  useFeatureGuard()
  const { token, user, isAuthenticated } = useAuth()
  const isAdmin = Boolean(isAuthenticated && user?.role === 'admin')

  const [usageData, setUsageData] = useState<UsageOverviewResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [billingModalOpen, setBillingModalOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  const fetchUsageData = useCallback(async () => {
    if (!token || !isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const response = await usageApi.getOverview()
      setUsageData(response)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to load usage data.')
      toast.error('Failed to load usage data')
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    fetchUsageData()
  }, [fetchUsageData])

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  if (!usageData) {
    return null
  }

  const minutesUsagePercent = (usageData.current_period.minutes_used / usageData.current_period.minutes_allocated) * 100

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
      categories: usageData.usage_history.map(h => {
        const date = new Date(h.date)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    },
    yaxis: {
      title: { text: 'Calls' }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f1f3fa'
    },
    tooltip: {
      x: {
        format: 'dd MMM'
      }
    }
  }

  const callsChartSeries = [
    {
      name: 'Calls',
      data: usageData.usage_history.map(h => h.calls)
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
      categories: usageData.usage_history.map(h => {
        const date = new Date(h.date)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
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
      data: usageData.usage_history.map(h => h.minutes)
    }
  ]

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'warning'
      case 'danger': return 'danger'
      case 'info': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Usage & Billing</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Usage & Billing</li>
              </ol>
            </div>
            <Button
              variant="primary"
              onClick={() => setUpgradeModalOpen(true)}
              className="d-inline-flex align-items-center gap-2"
            >
              <IconifyIcon icon="solar:rocket-linear" width={18} height={18} />
              Upgrade Plan
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        {usageData.alerts.map((alert, index) => (
          <Col xs={12} key={index} className="mb-3">
            <div className={`alert alert-${getAlertVariant(alert.type)} d-flex align-items-center mb-0`} role="alert">
              <IconifyIcon
                icon={alert.type === 'warning' ? 'solar:danger-triangle-linear' : 'solar:info-circle-linear'}
                width={20}
                height={20}
                className="me-2"
              />
              {alert.message}
            </div>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <CardBody className="d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Calls This Period</h6>
                <IconifyIcon icon="solar:phone-calling-rounded-linear" width={24} height={24} className="text-primary" />
              </div>
              <h3 className="mb-0">{usageData.current_period.calls_made.toLocaleString()}</h3>
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
                {usageData.current_period.minutes_used.toLocaleString()} /{' '}
                {usageData.current_period.minutes_allocated.toLocaleString()}
              </h3>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div
                  className={`progress-bar ${minutesUsagePercent >= 90 ? 'bg-danger' : minutesUsagePercent >= 75 ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${minutesUsagePercent}%` }}
                />
              </div>
              <small className="text-muted mt-auto">
                {minutesUsagePercent.toFixed(1)}% used
              </small>
            </CardBody>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <CardBody className="d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Current Plan</h6>
                <IconifyIcon icon="solar:shield-check-linear" width={24} height={24} className="text-info" />
              </div>
              <h3 className="mb-0">{usageData.plan.name}</h3>
              <Badge bg="info" className="mt-2 text-uppercase align-self-start">
                {usageData.plan.tier}
              </Badge>
              <small className="text-muted mt-auto text-capitalize">{usageData.plan.billing_frequency} billing</small>
            </CardBody>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <CardBody className="d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">Current Bill</h6>
                <IconifyIcon icon="solar:wallet-linear" width={24} height={24} className="text-warning" />
              </div>
              <h3 className="mb-0">
                {formatCurrency(usageData.billing.current_amount, usageData.billing.currency)}
              </h3>
              {usageData.current_period.overage_minutes > 0 && (
                <Badge bg="warning" className="mt-2 align-self-start">
                  +{usageData.current_period.overage_minutes} overage mins
                </Badge>
              )}
              <small className="text-muted mt-auto">per {usageData.plan.billing_frequency}</small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
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
              <CardTitle as="h5">Minutes Usage Trend</CardTitle>
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

        <Col lg={4}>
          <Card className="mb-3">
            <CardHeader>
              <CardTitle as="h5">Current Period</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <label className="text-muted small">Period Start</label>
                <div className="fw-medium">{formatDate(usageData.current_period.start_date)}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Period End</label>
                <div className="fw-medium">{formatDate(usageData.current_period.end_date)}</div>
              </div>
              <hr />
              <div className="mb-3">
                <label className="text-muted small">Total Calls</label>
                <div className="fw-semibold fs-5">{usageData.current_period.calls_made.toLocaleString()}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Minutes Used</label>
                <div className="fw-semibold fs-5">
                  {usageData.current_period.minutes_used.toLocaleString()}
                  <span className="text-muted fs-6"> / {usageData.current_period.minutes_allocated.toLocaleString()}</span>
                </div>
                <div className="progress mt-2" style={{ height: '10px' }}>
                  <div
                    className={`progress-bar ${minutesUsagePercent >= 90 ? 'bg-danger' : minutesUsagePercent >= 75 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${minutesUsagePercent}%` }}
                  />
                </div>
              </div>
              {usageData.current_period.overage_minutes > 0 && (
                <div className="mb-3">
                  <label className="text-muted small">Overage Minutes</label>
                  <div className="fw-semibold fs-5 text-danger">
                    {usageData.current_period.overage_minutes.toLocaleString()}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h5">Billing Information</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <label className="text-muted small">Next Billing Date</label>
                <div className="fw-medium">{formatDate(usageData.billing.next_billing_date)}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Payment Method</label>
                <div className="fw-medium text-capitalize">
                  {usageData.billing.payment_method.replace('_', ' ')}
                </div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Billing Amount</label>
                <div className="fw-semibold fs-5">
                  {formatCurrency(usageData.billing.current_amount, usageData.billing.currency)}
                </div>
                <div className="text-muted small text-capitalize">per {usageData.plan.billing_frequency}</div>
              </div>
              <hr />
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setBillingModalOpen(true)}
                >
                  <IconifyIcon icon="solar:card-linear" className="me-2" />
                  Manage Billing
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setUpgradeModalOpen(true)}
                >
                  <IconifyIcon icon="solar:rocket-linear" className="me-2" />
                  Upgrade Plan
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal show={billingModalOpen} onHide={() => setBillingModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Billing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="border rounded-3 p-3 bg-body-tertiary h-100">
                <label className="text-muted small">Stripe Customer ID</label>
                <div className="fw-medium font-monospace small">
                  {usageData.billing.stripe_customer_id || '—'}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="border rounded-3 p-3 bg-body-tertiary h-100">
                <label className="text-muted small">Stripe Subscription ID</label>
                <div className="fw-medium font-monospace small">
                  {usageData.billing.stripe_subscription_id || '—'}
                </div>
              </div>
            </Col>
            <Col xs={12}>
              <div className="d-flex flex-column gap-2">
                <Button variant="outline-primary">
                  <IconifyIcon icon="solar:card-transfer-linear" className="me-2" />
                  View Stripe Customer Portal
                </Button>
                <Button variant="outline-info">
                  <IconifyIcon icon="solar:card-linear" className="me-2" />
                  Update Payment Method
                </Button>
                <Button variant="outline-success">
                  <IconifyIcon icon="solar:document-text-linear" className="me-2" />
                  Download Invoices
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

      <Modal show={upgradeModalOpen} onHide={() => setUpgradeModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Upgrade Your Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <h5>Choose a plan that fits your needs</h5>
            <p className="text-muted">Unlock more features and higher limits</p>
          </div>

          <Row className="g-3">
            <Col md={4}>
              <Card className="h-100 border-2">
                <CardBody className="text-center">
                  <h5 className="mb-3">Basic</h5>
                  <div className="mb-3">
                    <h2 className="mb-0">$49</h2>
                    <small className="text-muted">/month</small>
                  </div>
                  <ul className="list-unstyled text-start mb-3">
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      5,000 minutes/month
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Up to 5 agents
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Email support
                    </li>
                  </ul>
                  <Button variant="outline-primary" className="w-100">
                    Select Plan
                  </Button>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-primary border-2">
                <Badge bg="primary" className="position-absolute top-0 start-50 translate-middle-x">
                  Current Plan
                </Badge>
                <CardBody className="text-center">
                  <h5 className="mb-3">Pro</h5>
                  <div className="mb-3">
                    <h2 className="mb-0">$149</h2>
                    <small className="text-muted">/month</small>
                  </div>
                  <ul className="list-unstyled text-start mb-3">
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      10,000 minutes/month
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Up to 20 agents
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Priority support
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Advanced analytics
                    </li>
                  </ul>
                  <Button variant="primary" className="w-100" disabled>
                    Current Plan
                  </Button>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-2">
                <CardBody className="text-center">
                  <h5 className="mb-3">Enterprise</h5>
                  <div className="mb-3">
                    <h2 className="mb-0">$499</h2>
                    <small className="text-muted">/month</small>
                  </div>
                  <ul className="list-unstyled text-start mb-3">
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Unlimited minutes
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Unlimited agents
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      24/7 phone support
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Dedicated account manager
                    </li>
                    <li className="mb-2">
                      <IconifyIcon icon="solar:check-circle-linear" className="text-success me-2" />
                      Custom integrations
                    </li>
                  </ul>
                  <Button variant="success" className="w-100">
                    Upgrade Now
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setUpgradeModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UsageAndBillingPage