'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Spinner, Alert, Badge, Button, ButtonGroup } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { analyticsApi, type DashboardResponse, type AnalyticsPeriod } from '@/api/org/analytics'
import { actionItemsApi } from '@/api/org/action-items'
import { appointmentsApi } from '@/api/org/appointments'
import { ordersApi } from '@/api/org/orders'
import { orgUsersApi } from '@/api/org/users'
import { supportApi } from '@/api/org/support'

type PeriodOption = {
  value: AnalyticsPeriod
  label: string
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'all_time', label: 'All Time' },
]

const DashboardPage = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('last_7_days')
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [actionStats, setActionStats] = useState<any>(null)
  const [appointmentStats, setAppointmentStats] = useState<any>(null)
  const [orderStats, setOrderStats] = useState<any>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [supportStats, setSupportStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [period])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [dashboardData, actionData, appointmentData, orderData, userData, supportData] = await Promise.all([
        analyticsApi.getDashboard(period),
        actionItemsApi.getStats(),
        appointmentsApi.getStats(),
        ordersApi.getStats(),
        orgUsersApi.getStats(),
        supportApi.getStats(),
      ])

      setDashboard(dashboardData)
      setActionStats(actionData)
      setAppointmentStats(appointmentData)
      setOrderStats(orderData)
      setUserStats(userData)
      setSupportStats(supportData)
    } catch (err: any) {
      console.error('Error loading dashboard:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Calls Over Time Chart
  const callsOverTimeChart: ApexOptions = useMemo(() => ({
    chart: {
      height: 350,
      type: 'area',
      toolbar: { show: true },
      zoom: { enabled: true }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    series: [{
      name: 'Calls',
      data: dashboard?.calls_over_time.map(d => ({ x: new Date(d.date).getTime(), y: d.count })) || []
    }],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      title: { text: 'Number of Calls' },
      labels: {
        formatter: (val) => Math.floor(val).toString()
      }
    },
    colors: ['#6658dd'],
    grid: { borderColor: '#f1f3fa' },
    tooltip: {
      x: { format: 'dd MMM yyyy' }
    }
  }), [dashboard])

  // Duration Distribution Chart
  const durationDistChart: ApexOptions = useMemo(() => {
    const distribution = dashboard?.duration_distribution || {}
    return {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: { enabled: false },
      series: [{
        name: 'Calls',
        data: Object.values(distribution)
      }],
      xaxis: {
        categories: Object.keys(distribution),
        title: { text: 'Duration Range' }
      },
      yaxis: {
        title: { text: 'Number of Calls' }
      },
      colors: ['#1abc9c'],
      grid: { borderColor: '#f1f3fa' }
    }
  }, [dashboard])

  // Hourly Volume Chart
  const hourlyVolumeChart: ApexOptions = useMemo(() => ({
    chart: {
      height: 300,
      type: 'heatmap',
      toolbar: { show: false }
    },
    series: [{
      name: 'Calls',
      data: dashboard?.hourly_volume.map(d => ({ x: `${d.hour}:00`, y: d.count })) || []
    }],
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 5, color: '#e3f2fd', name: 'Low' },
            { from: 6, to: 15, color: '#90caf9', name: 'Medium' },
            { from: 16, to: 30, color: '#42a5f5', name: 'High' },
            { from: 31, to: 100, color: '#1976d2', name: 'Very High' }
          ]
        }
      }
    },
    dataLabels: { enabled: true },
    xaxis: { title: { text: 'Hour of Day' } }
  }), [dashboard])

  // Action Items Status Chart
  const actionItemsChart: ApexOptions = useMemo(() => {
    const statuses = actionStats?.by_status || {}
    return {
      chart: {
        height: 300,
        type: 'donut'
      },
      series: Object.values(statuses),
      labels: Object.keys(statuses).map(s => s.replace('_', ' ').toUpperCase()),
      colors: ['#f7b84b', '#4fc6e1', '#1abc9c', '#6c757d'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      }
    }
  }, [actionStats])

  // Orders Revenue Chart
  const ordersRevenueChart: ApexOptions = useMemo(() => {
    const statuses = orderStats?.by_status || {}
    return {
      chart: {
        height: 300,
        type: 'radialBar'
      },
      series: [
        ((statuses.completed || 0) / (orderStats?.total_orders || 1)) * 100,
        ((statuses.in_progress || 0) / (orderStats?.total_orders || 1)) * 100,
        ((statuses.pending || 0) / (orderStats?.total_orders || 1)) * 100
      ],
      labels: ['Completed', 'In Progress', 'Pending'],
      colors: ['#1abc9c', '#4fc6e1', '#f7b84b'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            total: {
              show: true,
              label: 'Total Orders',
              formatter: () => orderStats?.total_orders?.toString() || '0'
            }
          }
        }
      }
    }
  }, [orderStats])

  // Support Tickets Trend
  const supportTicketsChart: ApexOptions = useMemo(() => {
    const types = supportStats?.by_type || {}
    return {
      chart: {
        height: 280,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '70%'
        }
      },
      dataLabels: { enabled: false },
      series: [{
        name: 'Tickets',
        data: Object.values(types)
      }],
      xaxis: {
        categories: Object.keys(types).map(t => t.replace('_', ' ').toUpperCase())
      },
      colors: ['#6658dd'],
      grid: { borderColor: '#f1f3fa' }
    }
  }, [supportStats])

  // User Growth Chart
  const userGrowthChart: ApexOptions = useMemo(() => {
    const statuses = userStats?.by_status || {}
    return {
      chart: {
        height: 280,
        type: 'pie'
      },
      series: Object.values(statuses),
      labels: Object.keys(statuses).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      colors: ['#1abc9c', '#f7b84b', '#f1556c'],
      legend: {
        position: 'bottom'
      }
    }
  }, [userStats])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <Alert.Heading>Error Loading Dashboard</Alert.Heading>
        <p>{error}</p>
        <Button variant="primary" onClick={loadDashboardData}>
          Retry
        </Button>
      </Alert>
    )
  }

  return (
    <>
      {/* Page Title */}
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 w-100">
              <div>
                <h4 className="mb-2">Analytics Dashboard</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link href="/">AI Assistant</Link>
                  </li>
                  <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                    <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                  </div>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
              <ButtonGroup className="ms-md-auto">
                {PERIOD_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    variant={period === option.value ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setPeriod(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>

            </div>
          </div>
        </Col>
      </Row>

      {/* KPI Cards Row 1 - Call Metrics */}
      <Row>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar-sm rounded bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:phone-calling-bold" className="text-primary" width={24} height={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small">Total Calls</p>
                  <h4 className="mb-0">{dashboard?.overview.total_calls.toLocaleString() || 0}</h4>
                  <small className="text-success">
                    <IconifyIcon icon="solar:arrow-up-bold" width={12} height={12} /> Active Period
                  </small>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar-sm rounded bg-success bg-opacity-10 d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:clock-circle-bold" className="text-success" width={24} height={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small">Avg Duration</p>
                  <h4 className="mb-0">{dashboard?.overview.avg_duration || '0s'}</h4>
                  <small className="text-muted">Per call</small>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar-sm rounded bg-info bg-opacity-10 d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:chart-bold" className="text-info" width={24} height={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small">Success Rate</p>
                  <h4 className="mb-0">{dashboard?.overview.success_rate.toFixed(1) || 0}%</h4>
                  <small className="text-success">
                    <IconifyIcon icon="solar:check-circle-bold" width={12} height={12} /> High Performance
                  </small>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avatar-sm rounded bg-warning bg-opacity-10 d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:users-group-rounded-bold" className="text-warning" width={24} height={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small">Unique Callers</p>
                  <h4 className="mb-0">{dashboard?.overview.unique_callers.toLocaleString() || 0}</h4>
                  <small className="text-muted">{dashboard?.overview.repeat_callers || 0} repeat</small>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* KPI Cards Row 2 - Business Metrics */}
      <Row>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Action Items</p>
                  <h4 className="mb-0">{actionStats?.total_items || 0}</h4>
                  <Badge bg="danger" className="mt-2">{actionStats?.by_status?.pending || 0} pending</Badge>
                </div>
                <Link href="/action-items" className="btn btn-sm btn-outline-primary">
                  <IconifyIcon icon="solar:arrow-right-linear" width={16} height={16} />
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Appointments</p>
                  <h4 className="mb-0">{appointmentStats?.total_appointments || 0}</h4>
                  <Badge bg="success" className="mt-2">{appointmentStats?.upcoming_appointments || 0} upcoming</Badge>
                </div>
                <Link href="/appointments" className="btn btn-sm btn-outline-primary">
                  <IconifyIcon icon="solar:arrow-right-linear" width={16} height={16} />
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Revenue</p>
                  <h4 className="mb-0">${orderStats?.total_revenue?.toLocaleString() || 0}</h4>
                  <Badge bg="info" className="mt-2">{orderStats?.total_orders || 0} orders</Badge>
                </div>
                <Link href="/orders" className="btn btn-sm btn-outline-primary">
                  <IconifyIcon icon="solar:arrow-right-linear" width={16} height={16} />
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Support Tickets</p>
                  <h4 className="mb-0">{supportStats?.total_tickets || 0}</h4>
                  <Badge bg="warning" className="mt-2">{supportStats?.open_tickets || 0} open</Badge>
                </div>
                <Link href="/contact-support" className="btn btn-sm btn-outline-primary">
                  <IconifyIcon icon="solar:arrow-right-linear" width={16} height={16} />
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:chart-2-bold" width={20} height={20} className="me-2" />
                Call Volume Trend
              </CardTitle>
              <Badge bg="primary">{period.replace('_', ' ')}</Badge>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={callsOverTimeChart}
                series={callsOverTimeChart.series}
                type="area"
                height={350}
              />
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:clock-circle-bold" width={20} height={20} className="me-2" />
                Call Duration Distribution
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={durationDistChart}
                series={durationDistChart.series}
                type="bar"
                height={350}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Secondary Charts Row */}
      <Row>
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:graph-bold" width={20} height={20} className="me-2" />
                Hourly Call Volume Heatmap
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={hourlyVolumeChart}
                series={hourlyVolumeChart.series}
                type="heatmap"
                height={300}
              />
            </CardBody>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:checklist-minimalistic-bold" width={20} height={20} className="me-2" />
                Action Items Status
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={actionItemsChart}
                series={actionItemsChart.series}
                type="donut"
                height={300}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tertiary Charts Row */}
      <Row>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:bag-check-bold" width={20} height={20} className="me-2" />
                Orders Completion
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={ordersRevenueChart}
                series={ordersRevenueChart.series}
                type="radialBar"
                height={300}
              />
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:help-bold" width={20} height={20} className="me-2" />
                Support Tickets by Type
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={supportTicketsChart}
                series={supportTicketsChart.series}
                type="bar"
                height={280}
              />
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:users-group-two-rounded-bold" width={20} height={20} className="me-2" />
                User Status Distribution
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={userGrowthChart}
                series={userGrowthChart.series}
                type="pie"
                height={280}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Performance Summary Cards */}
      <Row>
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle as="h5" className="mb-0">
                <IconifyIcon icon="solar:chart-square-bold" width={20} height={20} className="me-2" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <IconifyIcon icon="solar:phone-bold" className="text-primary mb-2" width={32} height={32} />
                    <h6 className="text-muted small mb-1">Failed Calls</h6>
                    <h4 className="mb-0 text-danger">{dashboard?.overview.failed_calls || 0}</h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <IconifyIcon icon="solar:clock-circle-bold" className="text-success mb-2" width={32} height={32} />
                    <h6 className="text-muted small mb-1">Total Duration</h6>
                    <h4 className="mb-0">{dashboard?.overview.total_duration || '0s'}</h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <IconifyIcon icon="solar:users-group-rounded-bold" className="text-info mb-2" width={32} height={32} />
                    <h6 className="text-muted small mb-1">Team Members</h6>
                    <h4 className="mb-0">{userStats?.total_users || 0}</h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 border rounded mb-3">
                    <IconifyIcon icon="solar:shield-check-bold" className="text-warning mb-2" width={32} height={32} />
                    <h6 className="text-muted small mb-1">Admin Users</h6>
                    <h4 className="mb-0">{userStats?.admin_users || 0}</h4>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      {/* <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">
                <IconifyIcon icon="solar:widget-5-bold" width={20} height={20} className="me-2" />
                Quick Actions
              </h5>
              <div className="d-flex flex-wrap gap-2">
                <Link href="/call-records" className="btn btn-outline-primary">
                  <IconifyIcon icon="solar:phone-calling-linear" width={18} height={18} className="me-2" />
                  View All Calls
                </Link>
                <Link href="/action-items?status=pending" className="btn btn-outline-warning">
                  <IconifyIcon icon="solar:checklist-linear" width={18} height={18} className="me-2" />
                  Pending Tasks
                </Link>
                <Link href="/appointments?sort=upcoming" className="btn btn-outline-success">
                  <IconifyIcon icon="solar:calendar-linear" width={18} height={18} className="me-2" />
                  Upcoming Appointments
                </Link>
                <Link href="/orders?urgency=true" className="btn btn-outline-danger">
                  <IconifyIcon icon="solar:bag-bold" width={18} height={18} className="me-2" />
                  Urgent Orders
                </Link>
                <Link href="/incidents" className="btn btn-outline-info">
                  <IconifyIcon icon="solar:danger-triangle-linear" width={18} height={18} className="me-2" />
                  Active Incidents
                </Link>
                <Link href="/user-management" className="btn btn-outline-secondary">
                  <IconifyIcon icon="solar:users-group-rounded-linear" width={18} height={18} className="me-2" />
                  Manage Users
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
    </>
  )
}

export default DashboardPage