'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Form, InputGroup, Button, Badge, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, Table } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/useAuthContext'
import { summaryApi } from '@/lib/summary-api'
import type { SummaryOut, SummaryFilters, SummarySort, Timezone } from '@/types/summary'

const CallRecordsPage = () => {
  const { token, isAuthenticated } = useAuth()
  const [summaries, setSummaries] = useState<SummaryOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<SummaryFilters>('all')
  const [sort, setSort] = useState<SummarySort>('newest')
  const [timezone, setTimezone] = useState<Timezone>('UTC')

  // Column sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false) // Track if there's more data available
  const [allSummaries, setAllSummaries] = useState<SummaryOut[]>([]) // Store all fetched summaries for client-side sorting

  // Detail modal state
  const [selectedSummary, setSelectedSummary] = useState<SummaryOut | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Reset to first page on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch summaries - fetch all when sorting is active, otherwise use pagination
  const fetchSummaries = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // If column sorting is active, fetch a large batch (or all) for client-side sorting
      // Otherwise, use server-side pagination
      const shouldFetchAll = sortColumn !== null
      const fetchLimit = shouldFetchAll ? 1000 : pageSize
      const fetchSkip = shouldFetchAll ? 0 : (currentPage - 1) * pageSize

      const response = await summaryApi.getUserSummaries(token, {
        skip: fetchSkip,
        limit: fetchLimit,
        search: debouncedSearch || undefined,
        filter: filter !== 'all' ? filter : undefined,
        sort,
        tz: timezone,
      })

      if (response.error) {
        setError(response.error)
        setSummaries([])
        setAllSummaries([])
        setHasMore(false)
      } else if (response.data) {
        if (shouldFetchAll) {
          // Store all data for client-side sorting and pagination
          setAllSummaries(response.data)
          setTotalCount(response.data.length)
          setHasMore(false) // We fetched all available data
        } else {
          // Use server-side pagination
          setSummaries(response.data)
          setAllSummaries([])

          // Check if there's more data (if we got a full page, there might be more)
          const gotFullPage = response.data.length === pageSize
          setHasMore(gotFullPage)

          // Calculate total count more accurately
          if (gotFullPage) {
            // If we got a full page, there's likely more data
            // Set total to at least current page * pageSize + 1 to indicate more exists
            setTotalCount(Math.max(totalCount, currentPage * pageSize + 1))
          } else {
            // We got less than a full page, so this is the last page
            setTotalCount((currentPage - 1) * pageSize + response.data.length)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summaries')
      setSummaries([])
      setAllSummaries([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch, filter, sort, timezone, sortColumn])

  useEffect(() => {
    fetchSummaries()
  }, [fetchSummaries])

  const handleViewDetails = (summary: SummaryOut) => {
    setSelectedSummary(summary)
    setShowDetailModal(true)
  }

  // Handle column sorting
  const handleSort = (column: string) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, set to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  // Clear sorting (when needed)
  const clearSort = () => {
    setSortColumn(null)
    setSortDirection('asc')
    setCurrentPage(1)
  }

  // Sort and paginate summaries
  const sortedAndPaginatedSummaries = useMemo(() => {
    // Determine which data source to use
    const dataToSort = sortColumn ? allSummaries : summaries

    // If no column sorting, return paginated data as-is
    if (!sortColumn) {
      return dataToSort
    }

    // Sort the data
    const sorted = [...dataToSort].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof SummaryOut]
      let bValue: any = b[sortColumn as keyof SummaryOut]

      // Handle null/undefined values
      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

      // Special handling for boolean values
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1)
      }

      // Special handling for Duration field (e.g., "2.5 minutes")
      if (sortColumn === 'Duration') {
        const extractMinutes = (value: any): number => {
          if (!value) return 0
          const str = String(value).toLowerCase()
          const match = str.match(/(\d+\.?\d*)\s*minutes?/)
          return match ? parseFloat(match[1]) : 0
        }
        const aMinutes = extractMinutes(aValue)
        const bMinutes = extractMinutes(bValue)
        return sortDirection === 'asc' ? aMinutes - bMinutes : bMinutes - aMinutes
      }

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      // Compare
      let comparison = 0
      if (aStr < bStr) {
        comparison = -1
      } else if (aStr > bStr) {
        comparison = 1
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    // Paginate the sorted data
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sorted.slice(startIndex, endIndex)
  }, [allSummaries, summaries, sortColumn, sortDirection, currentPage, pageSize])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const handleFirstPage = () => {
    if (currentPage > 1) {
      handlePageChange(1)
    }
  }

  const handleLastPage = () => {
    if (sortColumn) {
      // For client-side pagination, we know the exact last page
      const lastPage = totalPages > 0 ? totalPages : 1
      if (currentPage < lastPage) {
        handlePageChange(lastPage)
      }
    } else {
      // For server-side pagination, we can't jump to last page directly
      // Instead, keep going to next page until we reach the end
      if (hasMore) {
        handlePageChange(currentPage + 1)
      }
    }
  }

  // Calculate pagination info based on whether we're using client-side or server-side pagination
  const effectiveTotalCount = sortColumn ? allSummaries.length : totalCount
  const totalPages = sortColumn
    ? Math.ceil(effectiveTotalCount / pageSize)
    : (hasMore ? currentPage + 1 : currentPage) // For server-side, estimate based on hasMore
  const startRecord = sortedAndPaginatedSummaries.length > 0 ? (currentPage - 1) * pageSize + 1 : 0
  const endRecord = (currentPage - 1) * pageSize + sortedAndPaginatedSummaries.length
  const totalRecords = sortColumn
    ? effectiveTotalCount
    : (hasMore ? `${totalCount}+` : totalCount) // Show "+" if there's more data

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody className="text-center py-5">
              <p>Please sign in to view call records.</p>
              <Link href="/auth/sign-in">
                <Button variant="primary">Sign In</Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Call Records</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Taplox</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Call Records</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader>
              <CardTitle as="h5">Call Records</CardTitle>
              <p className="text-muted mb-0">
                View and manage all call records with advanced filtering and search capabilities.
              </p>
            </CardHeader>
            <CardBody>
              {/* Filters and Search */}
              <Row className="mb-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <IconifyIcon icon="solar:magnifer-outline" width={20} height={20} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value as SummaryFilters)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="all">All Records</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SummarySort)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value as Timezone)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="CST">CST</option>
                    <option value="MST">MST</option>
                    <option value="PST">PST</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading call records...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="alert alert-danger" role="alert">
                  <IconifyIcon icon="solar:danger-outline" width={20} height={20} className="me-2" />
                  {error}
                  <Button
                    variant="link"
                    className="p-0 ms-2"
                    onClick={fetchSummaries}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {/* Table */}
              {!loading && !error && (
                <>
                  {sortedAndPaginatedSummaries.length === 0 && summaries.length === 0 ? (
                    <div className="text-center py-5">
                      <IconifyIcon icon="solar:call-chat-outline" width={64} height={64} className="text-muted mb-3" />
                      <p className="text-muted">No call records found.</p>
                      {debouncedSearch && (
                        <p className="text-muted">
                          Try adjusting your search or filter criteria.
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover striped className="align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: '60px' }} className="text-center">#</th>
                              <th
                                style={{ width: '150px', cursor: 'pointer' }}
                                onClick={() => handleSort('Caller Name')}
                                className="user-select-none"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  Caller Name
                                  {sortColumn === 'Caller Name' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '200px', cursor: 'pointer' }}
                                onClick={() => handleSort('Caller Email')}
                                className="user-select-none"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  Email
                                  {sortColumn === 'Caller Email' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '130px', cursor: 'pointer' }}
                                onClick={() => handleSort('Caller Number')}
                                className="user-select-none"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  Phone
                                  {sortColumn === 'Caller Number' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '250px', cursor: 'pointer' }}
                                onClick={() => handleSort('Call timing')}
                                className="user-select-none"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  Call Time
                                  {sortColumn === 'Call timing' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '120px', cursor: 'pointer' }}
                                onClick={() => handleSort('Duration')}
                                className="text-center user-select-none"
                              >
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  Duration
                                  {sortColumn === 'Duration' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '250px', cursor: 'pointer' }}
                                onClick={() => handleSort('Brief Summary')}
                                className="user-select-none"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  Summary
                                  {sortColumn === 'Brief Summary' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '120px', cursor: 'pointer' }}
                                onClick={() => handleSort('View_Status')}
                                className="text-center user-select-none"
                              >
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  Read Status
                                  {sortColumn === 'View_Status' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '120px', cursor: 'pointer' }}
                                onClick={() => handleSort('Action_status')}
                                className="text-center user-select-none"
                              >
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  Action
                                  {sortColumn === 'Action_status' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th
                                style={{ width: '100px', cursor: 'pointer' }}
                                onClick={() => handleSort('Urgency')}
                                className="text-center user-select-none"
                              >
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  Urgency
                                  {sortColumn === 'Urgency' && (
                                    <IconifyIcon
                                      icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                      width={14}
                                      height={14}
                                    />
                                  )}
                                </div>
                              </th>
                              <th style={{ width: '150px' }} className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedAndPaginatedSummaries.map((summary, index) => (
                              <tr key={summary.id || index}>
                                <td className="text-center">
                                  <span className="text-muted">{(currentPage - 1) * pageSize + index + 1}</span>
                                </td>
                                <td>
                                  <div className="fw-medium">{summary['Caller Name'] || 'N/A'}</div>
                                </td>
                                <td>
                                  <div className="text-truncate" style={{ maxWidth: '200px' }} title={summary['Caller Email'] || ''}>
                                    {summary['Caller Email'] || 'N/A'}
                                  </div>
                                </td>
                                <td>{summary['Caller Number'] || 'N/A'}</td>
                                <td>
                                  <div className="small">
                                    {summary['Call timing'] || summary['Call Timing'] ? (
                                      <>
                                        <div className="text-muted mb-1">
                                          <strong>Start:</strong> {summary['Call timing'] || summary['Call Timing']}
                                        </div>
                                        {summary['End Call timing'] && (
                                          <div className="text-muted">
                                            <strong>End:</strong> {summary['End Call timing']}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-muted">N/A</span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center">
                                  {summary['Duration'] ? (
                                    <Badge bg="info">
                                      {summary['Duration']}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted">N/A</span>
                                  )}
                                </td>
                                <td>
                                  <div className="text-truncate" style={{ maxWidth: '250px' }} title={summary['Brief Summary'] || ''}>
                                    {summary['Brief Summary']
                                      ? (summary['Brief Summary'].length > 80
                                        ? summary['Brief Summary'].substring(0, 80) + '...'
                                        : summary['Brief Summary'])
                                      : 'N/A'}
                                  </div>
                                </td>
                                <td className="text-center">
                                  {summary['View_Status'] ? (
                                    <Badge bg="success">Read</Badge>
                                  ) : (
                                    <Badge bg="warning">Unread</Badge>
                                  )}
                                </td>
                                <td className="text-center">
                                  {summary['Action_flag'] ? (
                                    <Badge bg={summary['Action_status'] === 'Done' ? 'success' : 'danger'}>
                                      {summary['Action_status'] || 'Pending'}
                                    </Badge>
                                  ) : (
                                    <Badge bg="secondary">None</Badge>
                                  )}
                                </td>
                                <td className="text-center">
                                  {summary['Urgency'] ? (
                                    <Badge bg="danger">Urgent</Badge>
                                  ) : (
                                    <Badge bg="secondary">Normal</Badge>
                                  )}
                                </td>
                                <td className="text-center">
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => handleViewDetails(summary)}
                                      title="View Details"
                                    >
                                      <IconifyIcon icon="solar:eye-outline" width={16} height={16} />
                                    </Button>
                                    {summary['Recording Link'] && (
                                      <Button
                                        variant="outline-success"
                                        size="sm"
                                        as="a"
                                        href={summary['Recording Link']}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Play Recording"
                                      >
                                        <IconifyIcon icon="solar:play-outline" width={16} height={16} />
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {/* Detail Modal */}
                      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" scrollable>
                        <ModalHeader closeButton>
                          <ModalTitle>Call Record Details</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                          {selectedSummary && (
                            <div>
                              <Row className="mb-3">
                                <Col md={6}>
                                  <h6 className="text-muted mb-1">Caller Information</h6>
                                  <p className="mb-1"><strong>Name:</strong> {selectedSummary['Caller Name'] || 'N/A'}</p>
                                  <p className="mb-1"><strong>Email:</strong> {selectedSummary['Caller Email'] || 'N/A'}</p>
                                  <p className="mb-1"><strong>Phone:</strong> {selectedSummary['Caller Number'] || 'N/A'}</p>
                                  <p className="mb-0"><strong>Caller ID:</strong> {selectedSummary['Caller ID'] || 'N/A'}</p>
                                </Col>
                                <Col md={6}>
                                  <h6 className="text-muted mb-1">Call Details</h6>
                                  <p className="mb-1">
                                    <strong>Start Time:</strong> {selectedSummary['Call timing'] || selectedSummary['Call Timing'] || 'N/A'}
                                  </p>
                                  {selectedSummary['End Call timing'] && (
                                    <p className="mb-1">
                                      <strong>End Time:</strong> {selectedSummary['End Call timing']}
                                    </p>
                                  )}
                                  <p className="mb-1">
                                    <strong>Duration:</strong> {selectedSummary['Duration'] || 'N/A'}
                                  </p>
                                  <p className="mb-1"><strong>Call Success:</strong> {selectedSummary['Call Success'] || 'N/A'}</p>
                                  <p className="mb-1"><strong>Conversation ID:</strong> {selectedSummary['Conversation ID'] || 'N/A'}</p>
                                  <p className="mb-0"><strong>Store Number:</strong> {selectedSummary['Store Number'] || 'N/A'}</p>
                                </Col>
                              </Row>

                              <hr />

                              <Row className="mb-3">
                                <Col xs={12}>
                                  <h6 className="text-muted mb-2">Status</h6>
                                  <div className="d-flex gap-2 mb-2">
                                    <Badge bg={selectedSummary['View_Status'] ? 'success' : 'warning'}>
                                      {selectedSummary['View_Status'] ? 'Read' : 'Unread'}
                                    </Badge>
                                    {selectedSummary['Action_flag'] && (
                                      <Badge bg={selectedSummary['Action_status'] === 'Done' ? 'success' : 'danger'}>
                                        Action: {selectedSummary['Action_status'] || 'Pending'}
                                      </Badge>
                                    )}
                                    {selectedSummary['Urgency'] && (
                                      <Badge bg="danger">Urgent</Badge>
                                    )}
                                  </div>
                                </Col>
                              </Row>

                              {selectedSummary['Brief Summary'] && (
                                <>
                                  <h6 className="text-muted mb-2">Brief Summary</h6>
                                  <p className="mb-3">{selectedSummary['Brief Summary']}</p>
                                </>
                              )}

                              {selectedSummary['Detailed Summary'] && (
                                <>
                                  <h6 className="text-muted mb-2">Detailed Summary</h6>
                                  <p className="mb-3">{selectedSummary['Detailed Summary']}</p>
                                </>
                              )}

                              {selectedSummary['Questions asked during call'] && selectedSummary['Questions asked during call'].length > 0 && (
                                <>
                                  <h6 className="text-muted mb-2">Questions Asked During Call</h6>
                                  <ul className="mb-3">
                                    {selectedSummary['Questions asked during call'].map((q, idx) => (
                                      <li key={idx}>{q}</li>
                                    ))}
                                  </ul>
                                </>
                              )}

                              {selectedSummary['Action Items'] && selectedSummary['Action Items'].length > 0 && (
                                <>
                                  <h6 className="text-muted mb-2">Action Items</h6>
                                  <ul className="mb-3">
                                    {selectedSummary['Action Items'].map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </>
                              )}

                              {selectedSummary['Incident_Report'] && (
                                <>
                                  <h6 className="text-muted mb-2">Incident Report</h6>
                                  <p className="mb-3">{selectedSummary['Incident_Report']}</p>
                                </>
                              )}

                              {selectedSummary['Recording Link'] && (
                                <div className="mt-3">
                                  <a
                                    href={selectedSummary['Recording Link']}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                  >
                                    <IconifyIcon icon="solar:play-outline" width={20} height={20} className="me-2" />
                                    Play Recording
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                            Close
                          </Button>
                        </ModalFooter>
                      </Modal>

                      {/* Custom Pagination */}
                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        {/* Left side - Rows per page */}
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">Rows per page:</span>
                          <Form.Select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            style={{ width: 'auto', display: 'inline-block' }}
                            size="sm"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </Form.Select>
                        </div>

                        {/* Right side - Page info and navigation */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Record count */}
                          <span className="text-muted">
                            {startRecord}-{endRecord} of {typeof totalRecords === 'string' ? totalRecords : totalRecords}
                          </span>

                          {/* Page button */}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled
                            className="px-3"
                            style={{
                              backgroundColor: 'var(--bs-gray-100)',
                              borderColor: 'var(--bs-gray-300)',
                              fontWeight: '500'
                            }}
                          >
                            Page {currentPage} of {totalPages > 0 ? totalPages : 1}
                          </Button>

                          {/* Navigation buttons */}
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              disabled={currentPage === 1 || loading}
                              onClick={handleFirstPage}
                              title="First page"
                              className="d-flex align-items-center justify-content-center"
                              style={{ minWidth: '38px', padding: '0.25rem 0.5rem' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="3" y2="18"/>
                                <line x1="5" y1="6" x2="5" y2="18"/>
                                <polyline points="8 6 3 12 8 18"/>
                              </svg>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              disabled={currentPage === 1 || loading}
                              onClick={() => handlePageChange(currentPage - 1)}
                              title="Previous page"
                              className="d-flex align-items-center justify-content-center"
                              style={{ minWidth: '38px', padding: '0.25rem 0.5rem' }}
                            >
                              <IconifyIcon icon="solar:alt-arrow-left-outline" width={16} height={16} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              disabled={
                                loading ||
                                (sortColumn
                                  ? (currentPage >= totalPages)
                                  : !hasMore && sortedAndPaginatedSummaries.length < pageSize)
                              }
                              onClick={() => handlePageChange(currentPage + 1)}
                              title="Next page"
                              className="d-flex align-items-center justify-content-center"
                              style={{ minWidth: '38px', padding: '0.25rem 0.5rem' }}
                            >
                              <IconifyIcon icon="solar:alt-arrow-right-outline" width={16} height={16} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              disabled={
                                loading ||
                                (sortColumn
                                  ? (currentPage >= totalPages)
                                  : !hasMore && sortedAndPaginatedSummaries.length < pageSize)
                              }
                              onClick={handleLastPage}
                              title="Last page"
                              className="d-flex align-items-center justify-content-center"
                              style={{ minWidth: '38px', padding: '0.25rem 0.5rem' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 6 21 12 16 18"/>
                                <line x1="21" y1="6" x2="21" y2="18"/>
                                <line x1="19" y1="6" x2="19" y2="18"/>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Footer />
    </>
  )
}

export default CallRecordsPage

