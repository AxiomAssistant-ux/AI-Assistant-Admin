'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/useAuthContext'
import { summaryApi } from '@/lib/summary-api'
import type { SummaryOut, SummaryFilters, SummarySort, Timezone } from '@/types/summary'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'

const CallRecordsPage = () => {
  const { token, isAuthenticated } = useAuth()
  const [summaries, setSummaries] = useState<SummaryOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<SummaryFilters>('all')
  const [sort, setSort] = useState<SummarySort>('newest')
  const [timezone, setTimezone] = useState<Timezone>('UTC')

  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLastPage, setIsLastPage] = useState(false)
  const [allSummaries, setAllSummaries] = useState<SummaryOut[]>([])

  const [selectedSummary, setSelectedSummary] = useState<SummaryOut | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
      setIsLastPage(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchSummaries = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const shouldFetchAll = sortColumn !== null
      const fetchLimit = shouldFetchAll ? 1000 : pageSize
      const fetchSkip = shouldFetchAll ? 0 : (currentPage - 1) * pageSize

      const response = await summaryApi.getUserSummaries(token, {
        skip: fetchSkip,
        limit: fetchLimit,
        search: debouncedSearch || undefined,
        filter: filter !== 'all' ? filter : undefined,
        sort,
        tz: timezone
      })

      if (response.error) {
        setError(response.error)
        setSummaries([])
        setAllSummaries([])
        setHasMore(false)
        setIsLastPage(true)
        setTotalCount(0)
      } else if (response.data) {
        const summariesData = response.data.summaries
        const totalFromBackend = response.data.total

        if (shouldFetchAll) {
          setAllSummaries(summariesData)
          setTotalCount(totalFromBackend)
          setHasMore(false)
          setIsLastPage(true)
        } else {
          if (summariesData.length === 0 && currentPage > 1) {
            const previousPage = currentPage - 1
            try {
              const prevResponse = await summaryApi.getUserSummaries(token, {
                skip: (previousPage - 1) * pageSize,
                limit: pageSize,
                search: debouncedSearch || undefined,
                filter: filter !== 'all' ? filter : undefined,
                sort,
                tz: timezone
              })

              if (prevResponse.data) {
                setSummaries(prevResponse.data.summaries)
                setAllSummaries([])
                setCurrentPage(previousPage)
                setIsLastPage(true)
                setHasMore(false)
                setTotalCount(prevResponse.data.total)
              }
            } catch (prevErr) {
              setCurrentPage(previousPage)
              setIsLastPage(true)
              setHasMore(false)
              setSummaries([])
              setAllSummaries([])
            }
            setLoading(false)
            return
          }

          setSummaries(summariesData)
          setAllSummaries([])

          if (totalFromBackend !== undefined) {
            setTotalCount(totalFromBackend)
          }

          const currentRecordCount = (currentPage - 1) * pageSize + summariesData.length
          const isLast = totalFromBackend !== undefined && currentRecordCount >= totalFromBackend
          const hasMoreData = totalFromBackend !== undefined && currentRecordCount < totalFromBackend

          setIsLastPage(isLast)
          setHasMore(hasMoreData)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summaries')
      setSummaries([])
      setAllSummaries([])
      setHasMore(false)
      setIsLastPage(true)
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch, filter, sort, timezone, sortColumn])

  useEffect(() => {
    fetchSummaries()
  }, [fetchSummaries])

  const handleViewDetails = useCallback((summary: SummaryOut) => {
    setSelectedSummary(summary)
    setShowDetailModal(true)
  }, [])

  const formatCallTime = useCallback((timeString: string | null | undefined): string => {
    if (!timeString) return 'N/A'
    let formatted = timeString.replace(/Start \([^)]*\):\s*/i, '').replace(/End \([^)]*\):\s*/i, '')
    formatted = formatted.replace(/^[A-Za-z]+,\s*/, '')
    return formatted
  }, [])

  const handleSort = useCallback(
    (column: string) => {
    if (sortColumn === column) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setCurrentPage(1)
    setIsLastPage(false)
    },
    [sortColumn]
  )

  const clearFilters = () => {
    setFilter('all')
    setSort('newest')
    setTimezone('UTC')
    setCurrentPage(1)
    setIsLastPage(false)
  }

  const sortedAndPaginatedSummaries = useMemo(() => {
    const dataToSort = sortColumn ? allSummaries : summaries

    if (!sortColumn) {
      return dataToSort
    }

    const sorted = [...dataToSort].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof SummaryOut]
      let bValue: any = b[sortColumn as keyof SummaryOut]

      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? aValue === bValue
            ? 0
            : aValue
              ? 1
              : -1
          : aValue === bValue
            ? 0
            : aValue
              ? -1
              : 1
      }

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

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      let comparison = 0
      if (aStr < bStr) comparison = -1
      else if (aStr > bStr) comparison = 1

      return sortDirection === 'asc' ? comparison : -comparison
    })

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sorted.slice(startIndex, endIndex)
  }, [allSummaries, summaries, sortColumn, sortDirection, currentPage, pageSize])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    if (!sortColumn) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
    setIsLastPage(false)
  }

  const effectiveTotalCount = sortColumn ? allSummaries.length : totalCount
  const totalRecordsDisplay = sortColumn ? effectiveTotalCount : totalCount
  const startRecord = sortedAndPaginatedSummaries.length > 0 ? (currentPage - 1) * pageSize + 1 : 0
  const endRecord = (currentPage - 1) * pageSize + sortedAndPaginatedSummaries.length
  const totalPages = sortColumn ? Math.ceil(effectiveTotalCount / pageSize) : (isLastPage ? currentPage : currentPage + 1)

  const dataTableColumns: DataTableColumn<SummaryOut>[] = [
    {
      key: 'rowNumber',
      header: '#',
      width: 60,
      align: 'center',
      sticky: 'left',
      render: (_, { rowIndex }) => (
        <span className="text-muted">{(currentPage - 1) * pageSize + rowIndex + 1}</span>
      )
    },
    {
      key: 'callerName',
      header: 'Caller Name',
      minWidth: 150,
      render: (row) => (
        <span className="fw-medium">{row['Caller Name'] || <span className="text-muted fst-italic">N/A</span>}</span>
      )
    },
    {
      key: 'email',
      header: 'Email',
      minWidth: 200,
      render: (row) => (
        <div className="text-truncate" style={{ maxWidth: '200px' }} title={row['Caller Email'] || ''}>
          {row['Caller Email'] || <span className="text-muted fst-italic">N/A</span>}
              </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      minWidth: 130,
      render: (row) => row['Caller Number'] || <span className="text-muted fst-italic">N/A</span>
    },
    {
      key: 'callTime',
      header: 'Call Time',
      minWidth: 200,
      render: (row) =>
        row['Call timing'] || row['Call Timing'] ? (
          <span>{formatCallTime(row['Call timing'] || row['Call Timing'])}</span>
        ) : (
          <span className="text-muted fst-italic">N/A</span>
        )
    },
    {
      key: 'duration',
      header: 'Duration',
      align: 'center',
      minWidth: 120,
      render: (row) =>
        row['Duration'] ? (
          <Badge bg="info" className="px-2 py-1">
            {row['Duration']}
          </Badge>
        ) : (
          <span className="text-muted fst-italic">N/A</span>
        )
    },
    {
      key: 'summary',
      header: 'Summary',
      minWidth: 250,
      render: (row) => (
        <div
          className="text-truncate"
          style={{ maxWidth: '250px', fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5' }}
          title={row['Brief Summary'] || ''}
        >
          {row['Brief Summary']
            ? row['Brief Summary'].length > 80
              ? `${row['Brief Summary'].substring(0, 80)}...`
              : row['Brief Summary']
            : <span className="text-muted fst-italic">No summary available</span>}
          </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      minWidth: 120,
      sticky: 'right',
      render: (row) =>
        row['View_Status'] ? (
          <Badge bg="success" className="px-2 py-1">
            Read
          </Badge>
        ) : (
          <Badge bg="warning" text="dark" className="px-2 py-1">
            Unread
          </Badge>
        )
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      minWidth: 120,
      sticky: 'right',
      render: (row) =>
        row['Action_flag'] ? (
          <Badge bg={row['Action_status'] === 'Done' ? 'success' : 'danger'} className="px-2 py-1">
            {row['Action_status'] || 'Pending'}
          </Badge>
        ) : (
          <Badge bg="secondary" className="px-2 py-1">
            None
          </Badge>
        )
    },
    {
      key: 'urgency',
      header: 'Urgency',
      align: 'center',
      minWidth: 100,
      sticky: 'right',
      render: (row) =>
        row['Urgency'] ? (
          <Badge bg="danger" className="px-2 py-1">
            Urgent
          </Badge>
        ) : (
          <Badge bg="secondary" className="px-2 py-1">
            Normal
          </Badge>
        )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      minWidth: 150,
      sticky: 'right',
      render: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="primary" size="sm" onClick={() => handleViewDetails(row)} title="View Details">
            <IconifyIcon icon="solar:eye-outline" width={16} height={16} />
          </Button>
          {row['Recording Link'] && (
                    <Button
              variant="success"
              size="sm"
              as="a"
              href={row['Recording Link']}
              target="_blank"
              rel="noopener noreferrer"
              title="Play Recording"
            >
              <IconifyIcon icon="solar:play-outline" width={16} height={16} />
                    </Button>
          )}
                  </div>
      )
    }
  ]

  const toolbarFilters: DataTableFilterControl[] = [
    {
      id: 'filter',
      label: 'Record Status',
      type: 'select',
      value: filter === 'all' ? '' : filter,
      onChange: (value: string) => {
        const nextValue = (value || 'all') as SummaryFilters
        setFilter(nextValue)
                      setCurrentPage(1)
                        setIsLastPage(false)
      },
      onClear: filter !== 'all' ? () => {
                          setFilter('all')
                          setCurrentPage(1)
                          setIsLastPage(false)
      } : undefined,
      options: [
        { label: 'All Records', value: '' },
        { label: 'Read', value: 'read' },
        { label: 'Unread', value: 'unread' },
        { label: 'Urgent', value: 'urgent' }
      ]
    },
    {
      id: 'sort',
      label: 'Sort',
      type: 'select',
      value: sort === 'newest' ? '' : sort,
      onChange: (value: string) => {
        const nextSort = (value || 'newest') as SummarySort
        setSort(nextSort)
                      setCurrentPage(1)
                        setIsLastPage(false)
      },
      onClear: sort !== 'newest' ? () => {
                          setSort('newest')
                          setCurrentPage(1)
                          setIsLastPage(false)
      } : undefined,
      options: [
        { label: 'Newest First', value: '' },
        { label: 'Oldest First', value: 'oldest' }
      ]
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'select',
      value: timezone === 'UTC' ? '' : timezone,
      onChange: (value: string) => {
        const nextTz = (value || 'UTC') as Timezone
        setTimezone(nextTz)
                      setCurrentPage(1)
                        setIsLastPage(false)
      },
      onClear: timezone !== 'UTC' ? () => {
                          setTimezone('UTC')
                          setCurrentPage(1)
                          setIsLastPage(false)
      } : undefined,
      options: [
        { label: 'UTC', value: '' },
        { label: 'EST', value: 'EST' },
        { label: 'CST', value: 'CST' },
        { label: 'MST', value: 'MST' },
        { label: 'PST', value: 'PST' }
      ]
    }
  ]

  const emptyStateIcon = (
                      <div
                            style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: '#4f46e5',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1.5rem',
                          boxShadow: '0 8px 16px rgba(79,70,229,0.2)'
                        }}
                      >
                        <IconifyIcon icon="solar:call-chat-bold" width={56} height={56} style={{ color: 'white' }} />
                          </div>
  )

  const filtersDirty = filter !== 'all' || sort !== 'newest' || timezone !== 'UTC'

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
              <p>Please sign in to view call records.</p>
              <Link href="/auth/sign-in">
                <Button variant="primary">Sign In</Button>
              </Link>
                    </div>
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

      {loading && (
        <Row className="mt-4">
          <Col xs={12}>
              <style>{`
                .call-records-loading {
                  background: linear-gradient(135deg, var(--bs-body-tertiary-bg, #f8f9ff) 0%, var(--bs-body-bg, #e8eaf6) 100%);
                  border-radius: 6px;
                  padding: 3rem;
                  border: 1px solid var(--bs-border-color, #e5e7eb);
                }
                [data-bs-theme="dark"] .call-records-loading {
                  background: linear-gradient(135deg, #1f2933 0%, #0f172a 100%);
                  border: 1px solid var(--bs-border-color, #2d3748);
                }
              `}</style>
                <div className="text-center py-5 call-records-loading">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Spinner
                      animation="border"
                      style={{
                        width: '3rem',
                        height: '3rem',
                        color: '#667eea',
                        borderWidth: '3px'
                      }}
                    />
                    <IconifyIcon
                      icon="solar:phone-calling-rounded-bold"
                      width={24}
                      height={24}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#667eea'
                      }}
                    />
                  </div>
                  <p className="mt-3 mb-0" style={{ color: '#4b5563', fontWeight: '500', fontSize: '1.1rem' }}>
                    Loading call records...
                  </p>
                  <p className="text-muted small mt-1">Please wait while we fetch your data</p>
                </div>
          </Col>
        </Row>
      )}

      {!loading && (
        <Row className="mt-4">
          <Col xs={12}>
            <DataTable
              id="call-records-table"
              title="Call Records"
              description="Track and filter every AI call summary"
              columns={dataTableColumns}
              data={sortedAndPaginatedSummaries}
              loading={loading}
              error={error}
              onRetry={fetchSummaries}
              minTableWidth={1650}
              toolbar={{
                showFilters,
                onToggleFilters: () => setShowFilters((prev) => !prev),
                search: {
                  value: searchQuery,
                  placeholder: 'Search by name, email, or phone...',
                  onChange: setSearchQuery,
                  onClear: () => setSearchQuery('')
                },
                filters: toolbarFilters,
                extra: filtersDirty ? (
                  <Button
                    variant="outline-secondary"
                    className="shadow-sm"
                    onClick={clearFilters}
                    title="Clear all filters"
                    style={{ fontSize: '0.95rem' }}
                  >
                    <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} />
                  </Button>
                ) : undefined
              }}
              columnPanel={{
                enableColumnVisibility: true,
                enableSticky: true,
                maxSticky: 4
              }}
              emptyState={{
                title: 'No Call Records Found',
                description: debouncedSearch
                          ? 'Try adjusting your search or filter criteria to see results.'
                  : 'There are no call records available at this time.',
                icon: emptyStateIcon
              }}
              sorting={{
                state: { columnKey: sortColumn, direction: sortDirection },
                onToggle: handleSort
              }}
              rowKey={(row, index) => row.id ?? `${row['Conversation ID'] ?? 'row'}-${index}`}
              tableContainerStyle={{
                maxHeight: 'calc(100vh - 350px)',
                overflowY: 'auto',
                maxWidth: '100%'
              }}
              pagination={{
                currentPage,
                pageSize,
                totalRecords: totalRecordsDisplay,
                startRecord,
                endRecord,
                hasMore,
                isLastPage,
                totalPages,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange
              }}
            />
          </Col>
        </Row>
      )}

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

      <Footer />
    </>
  )
}

export default CallRecordsPage
