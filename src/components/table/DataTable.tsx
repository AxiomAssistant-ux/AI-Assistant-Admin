'use client'

import React, { useEffect, useMemo, useState, useRef, ReactNode, CSSProperties } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table as BootstrapTable
} from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import useLocalStorage from '@/hooks/useLocalStorage'
import type { DataTableProps, DataTableColumn } from './types'

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

const DEFAULT_MIN_WIDTH = 1200

const getWidth = <T,>(column: DataTableColumn<T>) => column.width ?? column.minWidth ?? 150

const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-end'
  return ''
}

function DataTable<T>({
  id,
  title,
  description,
  columns,
  data = [],
  loading = false,
  error = null,
  onRetry,
  toolbar,
  pagination,
  emptyState,
  columnPanel,
  rowKey,
  rowClassName,
  rowStyle,
  sorting,
  stickyHeader = true,
  minTableWidth = DEFAULT_MIN_WIDTH,
  tableContainerStyle
}: DataTableProps<T>) {
  const columnLookup = useMemo(() => {
    const map: Record<string, DataTableColumn<T>> = {}
    columns.forEach((column) => {
      map[column.key] = column
    })
    return map
  }, [columns])

  const derivedVisibility = useMemo(() => {
    const visibility: Record<string, boolean> = {}
    columns.forEach((column) => {
      visibility[column.key] = column.defaultVisible ?? true
    })
    return visibility
  }, [columns])

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(derivedVisibility)
  useEffect(() => {
    setColumnVisibility(derivedVisibility)
  }, [derivedVisibility])

  // Get stable column keys to detect actual column changes (not just array reference)
  const columnKeys = useMemo(() => columns.map((col) => col.key).sort().join(','), [columns])
  const prevColumnKeysRef = useRef<string>('')

  // Get default sticky state from column definitions
  const derivedSticky = useMemo(() => {
    const sticky: Record<string, boolean> = {}
    columns.forEach((column) => {
      sticky[column.key] = Boolean(column.defaultSticky)
    })
    return sticky
  }, [columns])

  // Storage key for this specific table
  const stickyStorageKey = `datatable-sticky-${id}`

  // Initialize from localStorage, merging with defaultSticky
  const [persistedSticky, setPersistedSticky] = useLocalStorage<Record<string, boolean>>(
    stickyStorageKey,
    {}
  )

  // Initialize sticky columns: merge persisted state with defaultSticky
  const [stickyColumns, setStickyColumns] = useState<Record<string, boolean>>(() => {
    // Initialize on first render only
    const merged: Record<string, boolean> = { ...derivedSticky }
    Object.keys(persistedSticky).forEach((key) => {
      if (columns.some((col) => col.key === key)) {
        merged[key] = persistedSticky[key]
      }
    })
    return merged
  })

  // Only update sticky state when column keys actually change (new columns added/removed)
  useEffect(() => {
    // Initialize ref on first render
    if (!prevColumnKeysRef.current) {
      prevColumnKeysRef.current = columnKeys
      return
    }

    // Only proceed if column keys actually changed
    if (prevColumnKeysRef.current === columnKeys) {
      return
    }

    const currentKeys = columns.map((col) => col.key)
    const prevKeys = prevColumnKeysRef.current.split(',').filter(Boolean)

    // Check if any columns were added or removed
    const keysChanged =
      currentKeys.length !== prevKeys.length ||
      currentKeys.some((key) => !prevKeys.includes(key)) ||
      prevKeys.some((key) => !currentKeys.includes(key))

    if (keysChanged) {
      // Merge: use persisted state for existing columns, defaultSticky for new columns
      const merged: Record<string, boolean> = { ...derivedSticky }
      currentKeys.forEach((key) => {
        if (persistedSticky[key] !== undefined) {
          merged[key] = persistedSticky[key]
        }
      })
      setStickyColumns(merged)
      // Update localStorage with merged state
      setPersistedSticky(merged)
    }

    // Update ref to current keys
    prevColumnKeysRef.current = columnKeys
  }, [columnKeys, derivedSticky, persistedSticky, columns, setPersistedSticky])

  const [columnPanelOpen, setColumnPanelOpen] = useState(false)

  const visibleColumns = useMemo(
    () => columns.filter((column) => columnVisibility[column.key]),
    [columns, columnVisibility]
  )

  const columnOrder = useMemo(() => columns.map((column) => column.key), [columns])

  const maxSticky = columnPanel?.maxSticky ?? 4
  const stickyEnabledCount = useMemo(
    () => Object.values(stickyColumns).filter(Boolean).length,
    [stickyColumns]
  )

  const getStickyOffset = (columnKey: string, side: 'left' | 'right') => {
    const widthFor = (key: string) => getWidth(columnLookup[key])
    if (side === 'left') {
      let offset = 0
      // Iterate through visible columns in order
      for (const column of visibleColumns) {
        if (column.key === columnKey) break
        if (
          stickyColumns[column.key] &&
          (column.sticky ?? 'left') === 'left'
        ) {
          offset += widthFor(column.key)
        }
      }
      return offset
    }

    // For right-side sticky, iterate through visible columns in reverse order
    let offset = 0
    for (let i = visibleColumns.length - 1; i >= 0; i--) {
      const column = visibleColumns[i]
      if (column.key === columnKey) break
      if (
        stickyColumns[column.key] &&
        (column.sticky ?? 'left') === 'right'
      ) {
        offset += widthFor(column.key)
      }
    }
    return offset
  }

  const getStickyStyles = (columnKey: string, isHeader = false) => {
    if (!stickyColumns[columnKey]) return undefined
    const columnDef = columnLookup[columnKey]
    if (!columnDef) return undefined

    const side = columnDef.sticky ?? 'left'
    const offset = getStickyOffset(columnKey, side)
    const boxShadow =
      side === 'left'
        ? '2px 0 4px rgba(0,0,0,0.08)'
        : '-2px 0 4px rgba(0,0,0,0.08)'

    // Background colors to prevent content bleeding through
    // These match the CSS classes but provide inline fallback
    const backgroundColor = isHeader
      ? 'var(--bs-body-tertiary-bg, #f8f9fa)'
      : 'var(--bs-body-bg, #ffffff)'

    return {
      position: 'sticky' as const,
      [side]: `${offset}px`,
      zIndex: isHeader ? 103 : 101, // Higher z-index to ensure sticky columns are above regular content
      boxShadow: isHeader ? 'none' : boxShadow,
      backgroundColor,
      isolation: 'isolate' as const
    }
  }

  const getStickyClassName = (columnKey: string, isHeader = false) => {
    if (!stickyColumns[columnKey]) return ''
    return isHeader ? 'sticky-column-header' : 'sticky-column-cell'
  }

  const handleStickyToggle = (columnKey: string) => {
    setStickyColumns((prev) => {
      const currentlySticky = prev[columnKey]
      let newState: Record<string, boolean>

      if (currentlySticky) {
        newState = { ...prev, [columnKey]: false }
      } else {
        if (stickyEnabledCount >= maxSticky) {
          return prev
        }
        newState = { ...prev, [columnKey]: true }
      }

      // Persist to localStorage
      setPersistedSticky(newState)
      return newState
    })
  }

  const allColumnsSelected = useMemo(
    () => Object.values(columnVisibility).every(Boolean),
    [columnVisibility]
  )

  const handleColumnSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = {}
    columns.forEach((column) => {
      next[column.key] = checked
    })
    setColumnVisibility(next)
  }

  const renderToolbar = () => {
    if (!toolbar) return null
    const { search, filters, showFilters, onToggleFilters, extra } = toolbar
    const hasFilters = Boolean(filters && filters.length)
    const hasActions = Boolean(onToggleFilters || search || extra || (columnPanel?.enableColumnVisibility && columns.length))

    return (
      <>
        <Row className="align-items-center g-3 mb-3">
          <Col md={hasActions ? 4 : 12}>
            <CardTitle as="h5" className="mb-0">
              {title}
            </CardTitle>
            {description && <p className="text-muted mb-0 small">{description}</p>}
          </Col>
          {hasActions && (
            <Col md={8} className="ms-auto">
              <div className="d-flex gap-2 flex-wrap align-items-center justify-content-md-end">
                {onToggleFilters && (
                  <Button
                    variant={showFilters ? 'primary' : 'outline-secondary'}
                    className="shadow-sm"
                    onClick={onToggleFilters}
                    title={showFilters ? 'Hide filters' : 'Show filters'}
                    style={{ fontSize: '0.95rem', minWidth: '40px' }}
                  >
                    <IconifyIcon icon="solar:filter-outline" width={20} height={20} />
                  </Button>
                )}
                {search && (
                  <InputGroup
                    className="shadow-sm flex-grow-1"
                    style={{ minWidth: '240px', maxWidth: '420px', flex: '1 1 260px' }}
                  >
                    <InputGroup.Text className="bg-body-secondary border-end-0">
                      <IconifyIcon icon="solar:magnifer-outline" width={20} height={20} />
                    </InputGroup.Text>
                    <Form.Control
                      value={search.value}
                      placeholder={search.placeholder ?? 'Search...'}
                      onChange={(event) => search.onChange(event.target.value)}
                      className="border-start-0 ps-0"
                      style={{ fontSize: '0.95rem' }}
                    />
                    {search.value && search.onClear && (
                      <InputGroup.Text
                        role="button"
                        className="bg-body-secondary border-start-0"
                        onClick={search.onClear}
                      >
                        <IconifyIcon icon="solar:close-circle-bold" width={18} height={18} />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                )}
                {columnPanel?.enableColumnVisibility && (
                  <div className="position-relative">
                    <Button
                      variant={columnPanelOpen ? 'primary' : 'outline-secondary'}
                      className="shadow-sm"
                      onClick={() => setColumnPanelOpen((open) => !open)}
                      style={{ fontSize: '0.95rem' }}
                    >
                      <IconifyIcon icon="solar:settings-outline" width={18} height={18} />
                    </Button>
                    {columnPanelOpen && renderColumnPanel()}
                  </div>
                )}
              </div>
            </Col>
          )}
        </Row>
        {showFilters && hasFilters && (
          <Row className="g-3 align-items-end mb-3">
            {filters!.map((filter) => (
              <Col
                key={`${id}-${filter.id}`}
                md={filter.width && filter.width !== 'auto' ? filter.width : undefined}
              >
                {filter.type === 'select' ? (
                  <InputGroup className="shadow-sm">
                    <Form.Select
                      value={filter.value}
                      onChange={(event) => filter.onChange?.(event.target.value)}
                      className={filter.onClear ? 'border-end-0' : undefined}
                      style={{ fontSize: '0.95rem' }}
                    >
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                    {filter.onClear && filter.value && (
                      <InputGroup.Text
                        role="button"
                        className="bg-body-secondary border-start-0"
                        onClick={filter.onClear}
                      >
                        <IconifyIcon icon="solar:close-circle-bold" width={16} height={16} />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                ) : (
                  filter.element
                )}
              </Col>
            ))}
            {extra && (
              <Col md="auto">
                <div className="d-flex justify-content-md-end">{extra}</div>
              </Col>
            )}
          </Row>
        )}
      </>
    )
  }

  const renderColumnPanel = () => (
    <>
      <div
        className="position-absolute bg-body border rounded shadow-lg p-3"
        style={{
          top: 'calc(100% + 4px)',
          right: 0,
          zIndex: 1050,
          minWidth: '320px'
        }}
      >
        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>
            Column Settings
          </span>
          <Badge bg="secondary" pill>
            {visibleColumns.length}/{columns.length}
          </Badge>
        </div>
        <div className="form-check mb-3 pb-2 border-bottom">
          <input
            id={`${id}-dt-select-all`}
            className="form-check-input"
            type="checkbox"
            checked={allColumnsSelected}
            onChange={(event) => handleColumnSelectAll(event.target.checked)}
          />
          <label
            htmlFor={`${id}-dt-select-all`}
            className="form-check-label fw-semibold"
            style={{ cursor: 'pointer' }}
          >
            Select All
          </label>
        </div>
        {columns.map((column) => {
          const columnId = `${id}-col-${column.key}`
          const stickyId = `${id}-sticky-${column.key}`
          return (
            <div key={column.key} className="mb-2 pb-2 border-bottom">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="form-check flex-grow-1">
                  <input
                    id={columnId}
                    className="form-check-input"
                    type="checkbox"
                    checked={columnVisibility[column.key]}
                    onChange={(event) => {
                      const checked = event.target.checked
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.key]: checked
                      }))

                      if (!checked) {
                        setStickyColumns((prev) => ({
                          ...prev,
                          [column.key]: false
                        }))
                      }
                    }}
                  />
                  <label htmlFor={columnId} className="form-check-label" style={{ cursor: 'pointer' }}>
                    {column.header}
                  </label>
                </div>
                {columnPanel?.enableSticky && column.enableStickyToggle !== false && (
                  <div className="form-check">
                    <input
                      id={stickyId}
                      className="form-check-input"
                      type="checkbox"
                      checked={stickyColumns[column.key]}
                      disabled={
                        !stickyColumns[column.key] &&
                        stickyEnabledCount >= maxSticky
                      }
                      onChange={() => handleStickyToggle(column.key)}
                    />
                    <label
                      htmlFor={stickyId}
                      className="form-check-label text-muted"
                      style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      <IconifyIcon icon="solar:pin-outline" width={14} height={14} className="me-1" />
                      Sticky
                    </label>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div
        className="position-fixed"
        style={{ inset: 0, zIndex: 1040 }}
        onClick={() => setColumnPanelOpen(false)}
      />
    </>
  )

  const resolveColumnWidth = (column: DataTableColumn<T>) =>
    column.width ?? column.minWidth

  const baseColumnSize = (column: DataTableColumn<T>) =>
    column.minWidth ?? column.width ?? 140

  const getColumnWidthStyle = (column: DataTableColumn<T>) => {
    const width = resolveColumnWidth(column)
    return width ? { width: `${width}px` } : undefined
  }

  const renderHeaderCell = (column: DataTableColumn<T>) => {
    const stickyClass = getStickyClassName(column.key, true)
    const stickyStyle = getStickyStyles(column.key, true)
    const sortState = sorting?.state ?? { columnKey: null, direction: 'asc' as const }
    const isSorted = sortState.columnKey === column.key
    const canSort = column.sortable && sorting
    const minWidth = baseColumnSize(column)
    const fixedWidth = resolveColumnWidth(column) ?? minWidth

    const handleSortClick = () => {
      if (!canSort) return
      sorting?.onToggle(column.key)
    }

    return (
      <th
        key={column.key}
        style={{
          width: fixedWidth,
          minWidth,
          maxWidth: fixedWidth,
          padding: '1rem 0.75rem',
          fontWeight: 600,
          fontSize: '0.85rem',
          letterSpacing: '0.5px',
          borderBottom: 'none',
          cursor: canSort ? 'pointer' : 'default',
          ...stickyStyle
        }}
        className={`${getAlignmentClass(column.align)} ${stickyClass}`}
        onClick={handleSortClick}
      >
        <div className="d-flex align-items-center gap-1">
          <span>{column.header}</span>
          {column.subLabel && <small className="text-muted">{column.subLabel}</small>}
          {canSort && (
            <IconifyIcon
              icon={
                !isSorted
                  ? 'solar:sort-outline'
                  : sortState.direction === 'asc'
                    ? 'solar:sort-from-top-to-bottom-bold'
                    : 'solar:sort-from-bottom-to-top-bold'
              }
              width={16}
              height={16}
              className="text-muted"
            />
          )}
        </div>
      </th>
    )
  }

  const renderBodyCell = (row: T, rowIndex: number, column: DataTableColumn<T>) => {
    const stickyClass = getStickyClassName(column.key)
    const stickyStyle = getStickyStyles(column.key)
    const minWidth = baseColumnSize(column)
    const fixedWidth = resolveColumnWidth(column) ?? minWidth
    const value =
      column.accessor !== undefined
        ? (row as Record<string, unknown>)[column.accessor as string]
        : (row as Record<string, unknown>)[column.key]

    const content: React.ReactNode = column.render
      ? column.render(row, { rowIndex, value })
      : ((value ?? '—') as React.ReactNode)

    return (
      <td
        key={`${column.key}-${rowIndex}`}
        style={{
          padding: '0.85rem 0.75rem',
          verticalAlign: 'middle',
          minWidth,
          width: fixedWidth,
          maxWidth: fixedWidth,
          borderBottom: '1px solid var(--bs-border-color)',
          ...stickyStyle
        }}
        className={`${getAlignmentClass(column.align)} ${stickyClass}`}
      >
        {content}
      </td>
    )
  }

  const renderTable = () => {
    if (!loading && data.length === 0 && emptyState) {
      return (
        <div className="text-center py-5">
          {emptyState.icon}
          <h5 className="mt-3">{emptyState.title}</h5>
          {emptyState.description && <p className="text-muted mb-0">{emptyState.description}</p>}
        </div>
      )
    }

    const containerStyle: CSSProperties = {
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflowX: 'auto',
      ...tableContainerStyle
    }

    return (
      <div className="table-responsive" style={containerStyle}>
        <style>{`
          .sticky-column-header {
            background-color: var(--bs-body-tertiary-bg, #f8f9fa) !important;
          }
          .sticky-column-cell {
            background-color: var(--bs-body-bg, #ffffff) !important;
          }
          [data-bs-theme="dark"] .sticky-column-header {
            background-color: var(--bs-body-tertiary-bg, #2f3943) !important;
          }
          [data-bs-theme="dark"] .sticky-column-cell {
            background-color: var(--bs-body-bg, #22282e) !important;
          }
        `}</style>
        <BootstrapTable
          hover
          className="align-middle mb-0"
          style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: `${minTableWidth}px` }}
        >
          <colgroup>
            {visibleColumns.map((column) => (
              <col key={`col-${column.key}`} style={getColumnWidthStyle(column)} />
            ))}
          </colgroup>
          <thead
            className="table-light"
            style={
              stickyHeader
                ? {
                  position: 'sticky',
                  top: 0,
                  // zIndex: 101,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
                : undefined
            }
          >
            <tr>{visibleColumns.map((column) => renderHeaderCell(column))}</tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowKey ? rowKey(row, rowIndex) : `${id}-${rowIndex}`} className={rowClassName?.(row, rowIndex)} style={rowStyle?.(row, rowIndex)} >
                {visibleColumns.map((column) => renderBodyCell(row, rowIndex, column))}
              </tr>
            ))}
          </tbody>
        </BootstrapTable>
      </div>
    )
  }

  const renderPagination = () => {
    if (!pagination) return null
    const {
      currentPage,
      pageSize,
      totalRecords,
      totalPages,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = DEFAULT_PAGE_SIZES,
      startRecord,
      endRecord,
      isLastPage,
      hasMore
    } = pagination

    const totalDisplay =
      typeof totalRecords === 'string' ? totalRecords : totalRecords?.toLocaleString()

    const resolvedTotalPages =
      totalPages ?? (isLastPage ? currentPage : currentPage + 1)

    const pages: ReactNode[] = []
    const maxPages = resolvedTotalPages > 0 ? resolvedTotalPages : 1

    const pushPage = (page: number) => {
      pages.push(
        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
          <a
            href="#"
            className="page-link"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(page)
            }}
          >
            {page}
          </a>
        </li>
      )
    }

    pushPage(1)

    if (currentPage > 3) {
      pages.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(maxPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== maxPages) pushPage(i)
    }

    if (currentPage < maxPages - 2) {
      pages.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )
    }

    if (maxPages > 1) {
      pushPage(maxPages)
    }

    return (
      <Row className="mt-4 pt-3 border-top pb-3 mb-2 align-items-center">
        <Col sm={6} className="mb-3 mb-sm-0">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-muted small">
              Showing {startRecord ?? '-'}–{endRecord ?? '-'} of {totalDisplay}
              {hasMore && !isLastPage ? '+' : ''}
            </span>
            {onPageSizeChange && (
              <Form.Select
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                size="sm"
                style={{ width: 'auto', minWidth: '90px' }}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </Form.Select>
            )}
          </div>
        </Col>
        <Col sm={6}>
          <ul className="pagination pagination-rounded justify-content-sm-end m-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a
                href="#"
                className="page-link"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) onPageChange(currentPage - 1)
                }}
              >
                <IconifyIcon icon="tdesign:arrow-left" />
              </a>
            </li>
            {pages}
            <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
              <a
                href="#"
                className="page-link"
                onClick={(e) => {
                  e.preventDefault()
                  if (!isLastPage) onPageChange(currentPage + 1)
                }}
              >
                <IconifyIcon icon="tdesign:arrow-right" />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    )
  }

  return (
    <Card id={id}>
      <CardHeader className="pb-0 border-0 bg-transparent">
        {toolbar ? renderToolbar() : (
          <>
            <CardTitle as="h5" className="mb-0">{title}</CardTitle>
            {description && <p className="text-muted mb-0 small">{description}</p>}
          </>
        )}
      </CardHeader>
      <CardBody>
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <p className="text-muted mt-3 mb-0">Loading data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <div>{error}</div>
            {onRetry && (
              <Button variant="light" size="sm" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        )}

        {!loading && !error && (
          <>
            {renderTable()}
            {renderPagination()}
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default DataTable

