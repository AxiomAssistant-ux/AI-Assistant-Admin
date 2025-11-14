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
  const [isLastPage, setIsLastPage] = useState(false) // Track if we're on the last page
  const [allSummaries, setAllSummaries] = useState<SummaryOut[]>([]) // Store all fetched summaries for client-side sorting

  // Detail modal state
  const [selectedSummary, setSelectedSummary] = useState<SummaryOut | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    rowNumber: true,
    callerName: true,
    email: true,
    phone: true,
    callTime: true,
    duration: true,
    summary: true,
    status: true,
    action: true,
    urgency: true,
    actions: true
  })

  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  // Column sticky state
  const [stickyColumns, setStickyColumns] = useState({
    rowNumber: false,
    callerName: false,
    email: false,
    phone: false,
    callTime: false,
    duration: false,
    summary: false,
    status: false,
    action: false,
    urgency: false,
    actions: false
  })

  // Column widths for calculating sticky positions
  const columnWidths: Record<string, number> = {
    rowNumber: 60,
    callerName: 150,
    email: 200,
    phone: 130,
    callTime: 200,
    duration: 120,
    summary: 250,
    status: 120,
    action: 120,
    urgency: 100,
    actions: 150
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Reset to first page on search
      setIsLastPage(false) // Reset last page status
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
        setIsLastPage(true)
        setTotalCount(0)
      } else if (response.data) {
        // Handle new response format with summaries and total
        const summariesData = response.data.summaries
        const totalFromBackend = response.data.total

        if (shouldFetchAll) {
          // Store all data for client-side sorting and pagination
          setAllSummaries(summariesData)
          setTotalCount(totalFromBackend)
          setHasMore(false) // We fetched all available data
          setIsLastPage(true) // We have all data, so we're effectively on the last page
        } else {
          // Use server-side pagination

          // If we got 0 items and we're not on page 1, we've gone too far
          // This means the previous page was actually the last page
          if (summariesData.length === 0 && currentPage > 1) {
            // Fetch the previous page's data immediately
            const previousPage = currentPage - 1
            try {
              const prevResponse = await summaryApi.getUserSummaries(token, {
                skip: (previousPage - 1) * pageSize,
                limit: pageSize,
                search: debouncedSearch || undefined,
                filter: filter !== 'all' ? filter : undefined,
                sort,
                tz: timezone,
              })

              if (prevResponse.data) {
                const prevSummaries = prevResponse.data.summaries
                const prevTotal = prevResponse.data.total
                setSummaries(prevSummaries)
                setAllSummaries([])
                setCurrentPage(previousPage)
                setIsLastPage(true)
                setHasMore(false)
                setTotalCount(prevTotal)
          } else {
                // Fallback: just set state and let effect handle it
                setCurrentPage(previousPage)
                setIsLastPage(true)
                setHasMore(false)
                setSummaries([])
                setAllSummaries([])
              }
            } catch (prevErr) {
              // Fallback: just set state and let effect handle it
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

          // Set the exact total count from backend
          if (totalFromBackend !== undefined) {
            setTotalCount(totalFromBackend)
          }

          // Determine if we're on the last page
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

  const handleViewDetails = (summary: SummaryOut) => {
    setSelectedSummary(summary)
    setShowDetailModal(true)
  }

  // Format call timing to remove day name and prefix
  const formatCallTime = (timeString: string | null | undefined): string => {
    if (!timeString) return 'N/A'
    // Remove "Start (", ")", and the day name (e.g., "Wednesday, ")
    let formatted = timeString.replace(/Start \([^)]*\):\s*/i, '').replace(/End \([^)]*\):\s*/i, '')
    // Remove day name pattern (e.g., "Wednesday, ")
    formatted = formatted.replace(/^[A-Za-z]+,\s*/, '')
    return formatted
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
    setIsLastPage(false) // Reset last page status
  }

  // Clear sorting (when needed)
  const clearSort = () => {
    setSortColumn(null)
    setSortDirection('asc')
    setCurrentPage(1)
    setIsLastPage(false)
  }

  // Clear all filters (not search - search has its own clear button)
  const clearFilters = () => {
    setFilter('all')
    setSort('newest')
    setTimezone('UTC')
    setCurrentPage(1)
    setIsLastPage(false)
  }

  // Calculate left offset for sticky columns
  const getStickyLeft = (columnKey: string): number => {
    const columnOrder = ['rowNumber', 'callerName', 'email', 'phone', 'callTime', 'duration', 'summary', 'status', 'action', 'urgency', 'actions']
    const currentIndex = columnOrder.indexOf(columnKey)
    let left = 0

    for (let i = 0; i < currentIndex; i++) {
      const prevKey = columnOrder[i]
      if (columnVisibility[prevKey as keyof typeof columnVisibility] && stickyColumns[prevKey as keyof typeof stickyColumns]) {
        left += columnWidths[prevKey] || 0
      }
    }

    return left
  }

  // Get sticky styles for a column
  const getStickyStyles = (columnKey: string, isHeader: boolean = false) => {
    const isSticky = stickyColumns[columnKey as keyof typeof stickyColumns]
    if (!isSticky) return {}

    const left = getStickyLeft(columnKey)
    return {
      position: 'sticky' as const,
      left: `${left}px`,
      zIndex: isHeader ? 101 : 1,
      backgroundColor: isHeader
        ? 'var(--bs-table-bg, var(--bs-body-tertiary-bg, #f8f9fa))'
        : 'var(--bs-body-bg, #ffffff)'
    }
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
    setIsLastPage(false) // Reset last page status when page size changes
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
      // This button should be disabled for server-side pagination
      // But if somehow called, just go to next page if available
      if (hasMore && !isLastPage) {
        handlePageChange(currentPage + 1)
      }
    }
  }

  // Calculate pagination info based on whether we're using client-side or server-side pagination
  const effectiveTotalCount = sortColumn ? allSummaries.length : totalCount
  const totalPages = sortColumn
    ? Math.ceil(effectiveTotalCount / pageSize)
    : (isLastPage ? currentPage : currentPage + 1) // For server-side, use current page if last, otherwise estimate
  const startRecord = sortedAndPaginatedSummaries.length > 0 ? (currentPage - 1) * pageSize + 1 : 0
  const endRecord = (currentPage - 1) * pageSize + sortedAndPaginatedSummaries.length
  const totalRecords = sortColumn
    ? effectiveTotalCount
    : (isLastPage ? totalCount : `${totalCount}+`) // Show "+" if there's more data

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
      <style>{`
        /* Custom scrollbar styling - horizontal scrollbar visible */
        .table-responsive::-webkit-scrollbar {
          height: 8px;
        }

        .table-responsive::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .table-responsive::-webkit-scrollbar-thumb {
          background: #6c757d;
          border-radius: 4px;
        }

        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: #5a6268;
        }

        /* Hide vertical scrollbar but keep scrolling functionality */
        .table-responsive {
          scrollbar-width: thin;
          scrollbar-color: #6c757d #f1f1f1;
          -ms-overflow-style: -ms-autohiding-scrollbar;
        }

        /* Hide vertical scrollbar in webkit browsers */
        .table-responsive::-webkit-scrollbar:vertical {
          width: 0px;
        }
      `}</style>
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
              <Row className="align-items-center">
                <Col md={4}>
                  <CardTitle as="h5" className="mb-0">Call Records</CardTitle>
                </Col>
                <Col md={4} className="ms-auto">
                  <div className="d-flex gap-2 align-items-center">
                    <Button
                      variant={showFilters ? "primary" : "outline-secondary"}
                      className="shadow-sm"
                      onClick={() => setShowFilters(!showFilters)}
                      title={showFilters ? "Hide filters" : "Show filters"}
                      style={{ fontSize: '0.95rem', minWidth: '40px' }}
                    >
                      <IconifyIcon icon="solar:filter-outline" width={20} height={20} />
                    </Button>
                    <InputGroup className="shadow-sm flex-grow-1">
                      <InputGroup.Text className="bg-body-secondary border-end-0">
                      <IconifyIcon icon="solar:magnifer-outline" width={20} height={20} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-start-0 ps-0"
                        style={{ fontSize: '0.95rem' }}
                      />
                      {searchQuery && (
                        <InputGroup.Text
                          className="bg-body-secondary border-start-0"
                          onClick={() => setSearchQuery('')}
                          style={{ cursor: 'pointer' }}
                          title="Clear search"
                        >
                          <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} className="text-muted" />
                        </InputGroup.Text>
                      )}
                  </InputGroup>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {/* Filters */}
              {showFilters && (
              <Row className="mb-4 g-3 align-items-end">
                <Col md={3}>
                  <InputGroup className="shadow-sm">
                  <Form.Select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value as SummaryFilters)
                      setCurrentPage(1)
                        setIsLastPage(false)
                    }}
                      className="border-end-0"
                      style={{ fontSize: '0.95rem' }}
                  >
                    <option value="all">All Records</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                    {filter !== 'all' && (
                      <InputGroup.Text
                        className="bg-body-secondary border-start-0"
                        onClick={() => {
                          setFilter('all')
                          setCurrentPage(1)
                          setIsLastPage(false)
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Clear filter"
                      >
                        <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} className="text-muted" />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup className="shadow-sm">
                  <Form.Select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SummarySort)
                      setCurrentPage(1)
                        setIsLastPage(false)
                    }}
                      className="border-end-0"
                      style={{ fontSize: '0.95rem' }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </Form.Select>
                    {sort !== 'newest' && (
                      <InputGroup.Text
                        className="bg-body-secondary border-start-0"
                        onClick={() => {
                          setSort('newest')
                          setCurrentPage(1)
                          setIsLastPage(false)
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Clear sort"
                      >
                        <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} className="text-muted" />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup className="shadow-sm">
                  <Form.Select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value as Timezone)
                      setCurrentPage(1)
                        setIsLastPage(false)
                    }}
                      className="border-end-0"
                      style={{ fontSize: '0.95rem' }}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="CST">CST</option>
                    <option value="MST">MST</option>
                    <option value="PST">PST</option>
                  </Form.Select>
                    {timezone !== 'UTC' && (
                      <InputGroup.Text
                        className="bg-body-secondary border-start-0"
                        onClick={() => {
                          setTimezone('UTC')
                          setCurrentPage(1)
                          setIsLastPage(false)
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Clear timezone"
                      >
                        <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} className="text-muted" />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Col>
                {(filter !== 'all' || sort !== 'newest' || timezone !== 'UTC') && (
                  <Col md="auto">
                    <Button
                      variant="outline-secondary"
                      className="shadow-sm"
                      onClick={clearFilters}
                      title="Clear all filters"
                      style={{ fontSize: '0.95rem' }}
                    >
                      <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} />
                    </Button>
                  </Col>
                )}
                <Col md="auto" className="ms-auto">
                  <div className="position-relative">
                    <Button
                      variant={showColumnMenu ? "primary" : "outline-secondary"}
                      className="shadow-sm"
                      onClick={() => setShowColumnMenu(!showColumnMenu)}
                      style={{ fontSize: '0.95rem' }}
                    >
                      <IconifyIcon icon="solar:settings-outline" width={18} height={18}  />
                    </Button>
                    {showColumnMenu && (
                      <>
                          <div
                            className="position-absolute bg-body border rounded shadow-lg p-3"
                            style={{
                              top: '100%',
                              right: 0,
                              zIndex: 1000,
                              minWidth: '200px',
                              marginTop: '4px'
                            }}
                          >
                          <div className="mb-2 fw-bold" style={{ fontSize: '0.9rem' }}>Column Settings</div>
                          <div className="form-check mb-3 pb-2 border-bottom">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={Object.values(columnVisibility).every(v => v)}
                              onChange={(e) => {
                                const allChecked = e.target.checked
                                setColumnVisibility({
                                  rowNumber: allChecked,
                                  callerName: allChecked,
                                  email: allChecked,
                                  phone: allChecked,
                                  callTime: allChecked,
                                  duration: allChecked,
                                  summary: allChecked,
                                  status: allChecked,
                                  action: allChecked,
                                  urgency: allChecked,
                                  actions: allChecked
                                })
                              }}
                              id="col-select-all"
                            />
                            <label className="form-check-label fw-semibold" htmlFor="col-select-all" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                              Select All
                            </label>
                          </div>
                          {Object.entries({
                            rowNumber: '#',
                            callerName: 'Caller Name',
                            email: 'Email',
                            phone: 'Phone',
                            callTime: 'Call Time',
                            duration: 'Duration',
                            summary: 'Summary',
                            status: 'Status',
                            action: 'Action',
                            urgency: 'Urgency',
                            actions: 'Actions'
                          }).map(([key, label]) => (
                            <div key={key} className="mb-3 pb-2 border-bottom">
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={columnVisibility[key as keyof typeof columnVisibility]}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked
                                    setColumnVisibility(prev => ({
                                      ...prev,
                                      [key]: isChecked
                                    }))
                                    // Reset sticky state when column is hidden
                                    if (!isChecked) {
                                      setStickyColumns(prev => ({
                                        ...prev,
                                        [key]: false
                                      }))
                                    }
                                  }}
                                  id={`col-${key}`}
                                />
                                <label className="form-check-label" htmlFor={`col-${key}`} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                  {label}
                                </label>
                              </div>
                              {columnVisibility[key as keyof typeof columnVisibility] && (
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={stickyColumns[key as keyof typeof stickyColumns]}
                                    onChange={(e) => {
                                      setStickyColumns(prev => ({
                                        ...prev,
                                        [key]: e.target.checked
                                      }))
                                    }}
                                    id={`sticky-${key}`}
                                  />
                                  <label className="form-check-label text-muted" htmlFor={`sticky-${key}`} style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                                    <IconifyIcon icon="solar:pin-outline" width={14} height={14} className="me-1" />
                                    Sticky
                                  </label>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div
                          className="position-fixed"
                          style={{
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999
                          }}
                          onClick={() => setShowColumnMenu(false)}
                        />
                      </>
                    )}
                  </div>
                </Col>
              </Row>
              )}

              {/* Loading State */}
              {loading && (
                    <div
                      className="text-center py-5"
                      style={{
                        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8eaf6 100%)',
                        borderRadius: '6px',
                        padding: '3rem'
                      }}
                    >
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
              )}

              {/* Error State */}
              {error && !loading && (
                <div
                  className="alert d-flex align-items-center"
                  role="alert"
                  style={{
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    border: '2px solid #f87171',
                    borderRadius: '6px',
                    padding: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      background: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}
                  >
                    <IconifyIcon icon="solar:danger-triangle-bold" width={24} height={24} style={{ color: 'white' }} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1" style={{ color: '#991b1b', fontWeight: '600' }}>Error Loading Records</h6>
                    <p className="mb-0" style={{ color: '#7f1d1d' }}>{error}</p>
                  </div>
                  <button
                    onClick={fetchSummaries}
                    style={{
                      border: 'none',
                      background: '#dc2626',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Table */}
              {!loading && !error && (
                <>
                  {sortedAndPaginatedSummaries.length === 0 && summaries.length === 0 ? (
                    <div
                      className="text-center py-5"
                      style={{
                        background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
                        borderRadius: '6px',
                        padding: '4rem 2rem'
                      }}
                    >
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
                      <h5 style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem' }}>
                        No Call Records Found
                      </h5>
                      <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                        {debouncedSearch
                          ? 'Try adjusting your search or filter criteria to see results.'
                          : 'There are no call records available at this time.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className="table-responsive"
                        style={{
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          overflowX: 'auto',
                          overflowY: 'auto',
                          maxWidth: '100%',
                          maxHeight: 'calc(100vh - 350px)'
                        }}
                      >
                        <Table hover className="align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: '1650px' }}>
                          <thead className="table-light" style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 100,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <tr>
                              {columnVisibility.rowNumber && (
                                <th
                                  style={{
                                    width: '60px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('rowNumber', true)
                                  }}
                                  className="text-center"
                                >
                                  #
                                </th>
                              )}
                              {columnVisibility.callerName && (
                                <th
                                  style={{
                                    width: '150px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('callerName', true)
                                  }}
                                >
                                  Caller Name
                              </th>
                              )}
                              {columnVisibility.email && (
                                <th
                                  style={{
                                    width: '200px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('email', true)
                                  }}
                                >
                                  Email
                              </th>
                              )}
                              {columnVisibility.phone && (
                                <th
                                  style={{
                                    width: '130px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('phone', true)
                                  }}
                                >
                                  Phone
                              </th>
                              )}
                              {columnVisibility.callTime && (
                                <th
                                  style={{
                                    width: '200px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('callTime', true)
                                  }}
                                >
                                  Call Time
                              </th>
                              )}
                              {columnVisibility.duration && (
                                <th
                                  style={{
                                    width: '120px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('duration', true)
                                  }}
                                  className="text-center"
                                >
                                  Duration
                              </th>
                              )}
                              {columnVisibility.summary && (
                                <th
                                  style={{
                                    width: '250px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('summary', true)
                                  }}
                                >
                                  Summary
                              </th>
                              )}
                              {columnVisibility.status && (
                                <th
                                  style={{
                                    width: '120px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('status', true)
                                  }}
                                  className="text-center"
                                >
                                  Status
                              </th>
                              )}
                              {columnVisibility.action && (
                                <th
                                  style={{
                                    width: '120px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('action', true)
                                  }}
                                  className="text-center"
                                >
                                  Action
                              </th>
                              )}
                              {columnVisibility.urgency && (
                                <th
                                  style={{
                                    width: '100px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('urgency', true)
                                  }}
                                  className="text-center"
                                >
                                  Urgency
                              </th>
                              )}
                              {columnVisibility.actions && (
                                <th
                                  style={{
                                    width: '150px',
                                    borderBottom: 'none',
                                    padding: '1rem 0.75rem',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px',
                                    ...getStickyStyles('actions', true)
                                  }}
                                  className="text-center"
                                >
                                  Actions
                              </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {sortedAndPaginatedSummaries.map((summary, index) => (
                              <tr
                                key={summary.id || index}
                                style={{
                                  borderBottom: '1px solid #dee2e6'
                                }}
                              >
                                {columnVisibility.rowNumber && (
                                  <td className="text-center" style={{ padding: '1rem 0.75rem', ...getStickyStyles('rowNumber', false) }}>
                                    <span className="text-muted">
                                      {(currentPage - 1) * pageSize + index + 1}
                                    </span>
                                  </td>
                                )}
                                {columnVisibility.callerName && (
                                  <td style={{ padding: '1rem 0.75rem', ...getStickyStyles('callerName', false) }}>
                                    <span className="fw-medium">
                                      {summary['Caller Name'] || <span className="text-muted fst-italic">N/A</span>}
                                    </span>
                                  </td>
                                )}
                                {columnVisibility.email && (
                                  <td style={{ padding: '1rem 0.75rem', ...getStickyStyles('email', false) }}>
                                  <div className="text-truncate" style={{ maxWidth: '200px' }} title={summary['Caller Email'] || ''}>
                                      {summary['Caller Email'] || <span className="text-muted fst-italic">N/A</span>}
                                  </div>
                                </td>
                                )}
                                {columnVisibility.phone && (
                                  <td style={{ padding: '1rem 0.75rem', ...getStickyStyles('phone', false) }}>
                                    {summary['Caller Number'] || <span className="text-muted fst-italic">N/A</span>}
                                  </td>
                                )}
                                {columnVisibility.callTime && (
                                  <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem', ...getStickyStyles('callTime', false) }}>
                                    {summary['Call timing'] || summary['Call Timing'] ? (
                                      <span>{formatCallTime(summary['Call timing'] || summary['Call Timing'])}</span>
                                    ) : (
                                      <span className="text-muted fst-italic">N/A</span>
                                    )}
                                  </td>
                                )}
                                {columnVisibility.duration && (
                                  <td className="text-center" style={{ padding: '1rem 0.75rem', ...getStickyStyles('duration', false) }}>
                                  {summary['Duration'] ? (
                                      <Badge bg="info" className="px-2 py-1">{summary['Duration']}</Badge>
                                  ) : (
                                      <span className="text-muted fst-italic">N/A</span>
                                  )}
                                </td>
                                )}
                                {columnVisibility.summary && (
                                  <td style={{ padding: '1rem 0.75rem', ...getStickyStyles('summary', false) }}>
                                    <div
                                      className="text-truncate"
                                      style={{
                                        maxWidth: '250px',
                                        fontSize: '0.9rem',
                                        color: '#4b5563',
                                        lineHeight: '1.5'
                                      }}
                                      title={summary['Brief Summary'] || ''}
                                    >
                                    {summary['Brief Summary']
                                      ? (summary['Brief Summary'].length > 80
                                        ? summary['Brief Summary'].substring(0, 80) + '...'
                                        : summary['Brief Summary'])
                                        : <span className="text-muted fst-italic">No summary available</span>}
                                  </div>
                                </td>
                                )}
                                {columnVisibility.status && (
                                  <td className="text-center" style={{ padding: '1rem 0.75rem', ...getStickyStyles('status', false) }}>
                                  {summary['View_Status'] ? (
                                      <Badge bg="success" className="px-2 py-1">Read</Badge>
                                  ) : (
                                      <Badge bg="warning" text="dark" className="px-2 py-1">Unread</Badge>
                                  )}
                                </td>
                                )}
                                {columnVisibility.action && (
                                  <td className="text-center" style={{ padding: '1rem 0.75rem', ...getStickyStyles('action', false) }}>
                                  {summary['Action_flag'] ? (
                                      <Badge
                                        bg={summary['Action_status'] === 'Done' ? 'success' : 'danger'}
                                        className="px-2 py-1"
                                      >
                                      {summary['Action_status'] || 'Pending'}
                                    </Badge>
                                  ) : (
                                      <Badge bg="secondary" className="px-2 py-1">None</Badge>
                                  )}
                                </td>
                                )}
                                {columnVisibility.urgency && (
                                  <td className="text-center" style={{ padding: '1rem 0.75rem', ...getStickyStyles('urgency', false) }}>
                                  {summary['Urgency'] ? (
                                      <Badge bg="danger" className="px-2 py-1">Urgent</Badge>
                                  ) : (
                                      <Badge bg="secondary" className="px-2 py-1">Normal</Badge>
                                  )}
                                </td>
                                )}
                                {columnVisibility.actions && (
                                  <td className="text-center" style={{ padding: '1rem 0.75rem', ...getStickyStyles('actions', false) }}>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="primary"
                                      size="sm"
                                      onClick={() => handleViewDetails(summary)}
                                      title="View Details"
                                    >
                                      <IconifyIcon icon="solar:eye-outline" width={16} height={16} />
                                    </Button>
                                    {summary['Recording Link'] && (
                                      <Button
                                          variant="success"
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
                                )}
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

                      {/* Pagination */}
                      <Row className="mt-4 pt-3 border-top">
                        <Col sm={6} className="mb-3 mb-sm-0">
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">Rows per page:</span>
                          <Form.Select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                              style={{ width: 'auto', minWidth: '70px' }}
                            size="sm"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </Form.Select>
                            <span className="text-muted ms-2">
                              Showing {sortedAndPaginatedSummaries.length} of {typeof totalRecords === 'string' ? totalRecords.replace('+', '') : totalRecords.toLocaleString()} records
                            </span>
                        </div>
                        </Col>
                        <Col sm={6}>
                          <ul className="pagination pagination-rounded justify-content-sm-end m-0">
                            <li className={`page-item ${currentPage === 1 || loading ? 'disabled' : ''}`}>
                              <a
                                href="#"
                                className="page-link"
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (currentPage > 1 && !loading) handlePageChange(currentPage - 1)
                                }}
                              >
                                <IconifyIcon icon="tdesign:arrow-left" />
                              </a>
                            </li>
                            {(() => {
                              const pages = []
                              const maxPages = totalPages > 0 ? totalPages : 1

                              // Always show first page
                              pages.push(
                                <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                                  <a
                                    href="#"
                                    className="page-link"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (!loading) handlePageChange(1)
                                    }}
                                  >
                                    1
                                  </a>
                                </li>
                              )

                              // Show ellipsis if current page is far from start
                              if (currentPage > 3) {
                                pages.push(
                                  <li key="ellipsis-start" className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                )
                              }

                              // Show pages around current page
                              for (let i = Math.max(2, currentPage - 1); i <= Math.min(maxPages - 1, currentPage + 1); i++) {
                                pages.push(
                                  <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                    <a
                                      href="#"
                                      className="page-link"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        if (!loading) handlePageChange(i)
                                      }}
                                    >
                                      {i}
                                    </a>
                                  </li>
                                )
                              }

                              // Show ellipsis if current page is far from end
                              if (currentPage < maxPages - 2) {
                                pages.push(
                                  <li key="ellipsis-end" className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                )
                              }

                              // Always show last page if there's more than 1 page
                              if (maxPages > 1) {
                                pages.push(
                                  <li key={maxPages} className={`page-item ${currentPage === maxPages ? 'active' : ''}`}>
                                    <a
                                      href="#"
                                      className="page-link"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        if (!loading) handlePageChange(maxPages)
                                      }}
                                    >
                                      {maxPages}
                                    </a>
                                  </li>
                                )
                              }

                              return pages
                            })()}
                            <li className={`page-item ${isLastPage || loading || sortedAndPaginatedSummaries.length === 0 ? 'disabled' : ''}`}>
                              <a
                                href="#"
                                className="page-link"
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (!isLastPage && !loading && sortedAndPaginatedSummaries.length > 0) {
                                    handlePageChange(currentPage + 1)
                                  }
                                }}
                              >
                                <IconifyIcon icon="tdesign:arrow-right" />
                              </a>
                            </li>
                          </ul>
                        </Col>
                      </Row>
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

