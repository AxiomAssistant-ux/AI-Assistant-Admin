'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { adminAgentApi } from '@/lib/admin-agent-api'
import type { AdminAgent, AssignmentFilter } from '@/types/admin-agent'

const matchesSearch = (agent: AdminAgent, term: string) => {
  const id = (agent.agent_id || agent.id || '').toLowerCase()
  const name = (agent.name || '').toLowerCase()
  const languages = [
    agent.default_language,
    ...(agent.additional_languages ?? [])
  ]
    .filter(Boolean)
    .join(',')
    .toLowerCase()
  const assigned = (agent.assigned_users ?? []).join(',').toLowerCase()

  return (
    id.includes(term) ||
    name.includes(term) ||
    languages.includes(term) ||
    assigned.includes(term)
  )
}

const matchesAssignment = (agent: AdminAgent, assignment: AssignmentFilter) => {
  if (assignment === 'all') return true
  const hasAssignedUsers = Boolean(agent.assigned_users && agent.assigned_users.length > 0)
  return assignment === 'assigned' ? hasAssignedUsers : !hasAssignedUsers
}

const AgentsPage = () => {
  const { token, isAuthenticated, user, isLoading } = useAuth()
  const [agents, setAgents] = useState<AdminAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, assignmentFilter, pageSize])

  const fetchAgents = useCallback(async () => {
    if (!token || !isAuthenticated || user?.role !== 'admin') {
      setAgents([])
      setTotalRecords(0)
      return
    }

    setLoading(true)
    setError(null)

    const response = await adminAgentApi.getAllAgents(token, {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      search: debouncedSearch || undefined,
      assignment: assignmentFilter !== 'all' ? assignmentFilter : undefined
    })

    if (response.error || !response.data) {
      setError(response.error || 'Failed to load agents')
      setAgents([])
      setTotalRecords(0)
      setLoading(false)
      return
    }

    const payload = response.data
    const isLegacyResponse = Array.isArray(payload)

    if (isLegacyResponse) {
      const legacyList = payload as AdminAgent[]
      let filteredList = legacyList

      if (debouncedSearch) {
        const term = debouncedSearch.toLowerCase()
        filteredList = filteredList.filter((agent) => matchesSearch(agent, term))
      }

      if (assignmentFilter !== 'all') {
        filteredList = filteredList.filter((agent) => matchesAssignment(agent, assignmentFilter))
      }

      const total = filteredList.length
      const startIndex = (currentPage - 1) * pageSize

      if (startIndex >= total && total > 0) {
        const lastPage = Math.max(1, Math.ceil(total / pageSize))
        setCurrentPage(lastPage)
        setLoading(false)
        return
      }

      const pagedItems = filteredList.slice(startIndex, startIndex + pageSize)
      setAgents(pagedItems)
      setTotalRecords(total)
      setLoading(false)
      return
    }

    const dataObject = (payload as { items?: AdminAgent[]; total?: number }) ?? {}
    const items = Array.isArray(dataObject.items) ? dataObject.items : []
    const total = typeof dataObject.total === 'number' ? dataObject.total : items.length

    if (items.length === 0 && total > 0 && currentPage > 1) {
      const lastPage = Math.max(1, Math.ceil(total / pageSize))
      setCurrentPage(lastPage)
      setLoading(false)
      return
    }

    setAgents(items)
    setTotalRecords(total)
    setLoading(false)
  }, [token, isAuthenticated, user?.role, currentPage, pageSize, debouncedSearch, assignmentFilter])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const formatDate = (value?: string) => {
    if (!value) return '—'
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(value))
    } catch {
      return value
    }
  }

  const columns: DataTableColumn<AdminAgent>[] = useMemo(
    () => [
      {
        key: 'index',
        header: '#',
        align: 'center',
        width: 60,
        sticky: 'left',
        render: (_row, { rowIndex }) => (
          <span className="text-muted">{(currentPage - 1) * pageSize + rowIndex + 1}</span>
        )
      },
      {
        key: 'name',
        header: 'Agent',
        minWidth: 220,
        sticky: 'left',
        render: (row) => (
          <div>
            <div className="fw-semibold">{row.name || 'Unnamed Agent'}</div>
            <small className="text-muted d-block">{row.agent_id || row.id || '—'}</small>
          </div>
        )
      },
      {
        key: 'languages',
        header: 'Languages',
        minWidth: 180,
        render: (row) => {
          const languages = [
            row.default_language,
            ...(row.additional_languages ?? [])
          ].filter(Boolean)
          if (!languages.length) return <span className="text-muted">—</span>
          return (
            <div className="d-flex flex-wrap gap-1">
              {languages.map((lang) => (
                <Badge bg="secondary" key={`${row.agent_id}-${lang}`} className="text-uppercase">
                  {lang}
                </Badge>
              ))}
            </div>
          )
        }
      },
      {
        key: 'voice',
        header: 'Voice',
        minWidth: 160,
        render: (row) => row.tts?.voice_id || '—'
      },
      {
        key: 'model',
        header: 'Model',
        minWidth: 160,
        render: (row) => row.conversation_config?.agent?.prompt?.llm || '—'
      },
      {
        key: 'assigned',
        header: 'Assigned Users',
        minWidth: 220,
        render: (row) =>
          row.assigned_users && row.assigned_users.length > 0 ? (
            <div className="d-flex flex-wrap gap-1">
              {row.assigned_users.map((username) => (
                <Badge bg="info" key={`${row.agent_id}-${username}`}>
                  {username}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted">Unassigned</span>
          )
      },
      {
        key: 'updated_at',
        header: 'Updated',
        minWidth: 170,
        sticky: 'right',
        render: (row) => formatDate(row.updated_at || row.created_at)
      }
    ],
    [currentPage, pageSize]
  )

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'assignment',
        label: 'Assignment',
        type: 'select',
        value: assignmentFilter === 'all' ? '' : assignmentFilter,
        onChange: (value: string) => setAssignmentFilter((value || 'all') as AssignmentFilter),
        onClear: assignmentFilter !== 'all' ? () => setAssignmentFilter('all') : undefined,
        options: [
          { label: 'All agents', value: '' },
          { label: 'Assigned only', value: 'assigned' },
          { label: 'Unassigned only', value: 'unassigned' }
        ],
        width: 3
      }
    ],
    [assignmentFilter]
  )

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalRecords)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    if (size === pageSize) return
    setPageSize(size)
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <h4 className="mb-2">Please sign in</h4>
            <p className="text-muted mb-0">You need an admin account to view agents.</p>
          </div>
        </Col>
      </Row>
    )
  }

  if (user && user.role !== 'admin') {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <IconifyIcon icon="solar:shield-cross-outline" width={48} height={48} className="text-danger mb-3" />
            <h4 className="mb-2">Access restricted</h4>
            <p className="text-muted mb-0">Only admins can manage agents.</p>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-0">Agents</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Taplox</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Agents</li>
              </ol>
            </div>
            <Link href="/create-agent" className="btn btn-primary shadow-sm d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:add-square-outline" width={18} height={18} />
              Create Agent
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="all-agents"
            title="All Agents"
            description="Overview of every conversational agent in your workspace."
            columns={columns}
            data={agents}
            loading={loading}
            error={error}
            onRetry={fetchAgents}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search agents by name, ID, or user',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              },
              filters: toolbarFilters
            }}
            columnPanel={{
              enableColumnVisibility: true,
              enableSticky: true,
              maxSticky: 4
            }}
            tableContainerStyle={{
              maxHeight: 'calc(100vh - 350px)',
              overflowY: 'auto',
              maxWidth: '100%'
            }}
            pagination={{
              currentPage,
              pageSize,
              totalRecords,
              totalPages,
              startRecord,
              endRecord,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default AgentsPage

