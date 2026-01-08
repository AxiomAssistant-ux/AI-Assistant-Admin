'use client'

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { DataTable } from '@/components/table'
import type { DataTableColumn, DataTableFilterControl } from '@/components/table'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { knowledgeBaseApi } from '@/lib/knowledge-base-api'
import { adminAgentApi } from '@/lib/admin-agent-api'
import type { KnowledgeBaseDependentAgent, KnowledgeBaseDocument } from '@/types/knowledge-base'
import type { AdminAgent } from '@/types/admin-agent'

import { useFeatureGuard } from '@/hooks/useFeatureGuard'

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

const getDocumentIdentifier = (doc?: KnowledgeBaseDocument | null) => doc?.id ?? ''

const getStatusVariant = (status?: string) => {
  if (!status) return 'secondary'
  const normalized = status.toLowerCase()
  if (['ready', 'completed', 'available', 'processed'].some((term) => normalized.includes(term))) return 'success'
  if (['processing', 'queued', 'pending'].some((term) => normalized.includes(term))) return 'warning'
  if (['failed', 'error'].some((term) => normalized.includes(term))) return 'danger'
  return 'secondary'
}

const DEFAULT_PAGE_SIZE = 10

const DocumentsPage = () => {
  useFeatureGuard()
  const { token, user, isAuthenticated, isLoading } = useAuth()

  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const [selectedDocument, setSelectedDocument] = useState<KnowledgeBaseDocument | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [attachModalOpen, setAttachModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [viewDetails, setViewDetails] = useState<KnowledgeBaseDocument | null>(null)
  const [viewDependentAgents, setViewDependentAgents] = useState<KnowledgeBaseDependentAgent[]>([])
  const [viewLoadingId, setViewLoadingId] = useState<string | null>(null)

  const [availableAgents, setAvailableAgents] = useState<AdminAgent[]>([])
  const [agentsLoading, setAgentsLoading] = useState(false)

  const [attachAgentId, setAttachAgentId] = useState('')
  const [attachSubmitting, setAttachSubmitting] = useState(false)

  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setCurrentPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter, pageSize])

  const fetchDocuments = useCallback(async () => {
    if (!token || !isAuthenticated ) {
      setDocuments([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await knowledgeBaseApi.listDocuments(token, {
        page_size: 100,
        search: debouncedSearch || undefined,
        types: typeFilter !== 'all' && typeFilter ? [typeFilter] : undefined
      })

      if (response.error || !response.data) {
        setError(response.error || 'Failed to fetch documents.')
        setDocuments([])
        return
      }

      const payload = response.data.documents ?? []
      setDocuments(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents.')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user?.role, debouncedSearch, typeFilter])

  const fetchAgents = useCallback(async () => {
    if (!token || !isAuthenticated ) {
      setAvailableAgents([])
      return
    }

    setAgentsLoading(true)
    try {
      const response = await adminAgentApi.getAllAgents(token, { skip: 0, limit: 100 })
      if (response.error || !response.data) {
        toast.error(response.error || 'Unable to load agents for attachment.')
        setAvailableAgents([])
        return
      }

      const payload = response.data as AdminAgent[] | { items?: AdminAgent[] }
      const items = Array.isArray(payload) ? payload : payload.items ?? []
      setAvailableAgents(items)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to load agents for attachment.')
      setAvailableAgents([])
    } finally {
      setAgentsLoading(false)
    }
  }, [isAuthenticated, user?.role])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const filteredDocuments = useMemo(() => {
    const query = debouncedSearch.toLowerCase()
    return documents.filter((doc) => {
      const matchesType = typeFilter === 'all' || !typeFilter ? true : (doc.type || '').toLowerCase() === typeFilter.toLowerCase()
      const matchesSearch =
        !query ||
        doc.name?.toLowerCase().includes(query) ||
        doc.id.toLowerCase().includes(query) ||
        (doc.source?.url || '').toLowerCase().includes(query)
      return matchesType && matchesSearch
    })
  }, [documents, debouncedSearch, typeFilter])

  const totalRecords = filteredDocuments.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const currentPageSafe = Math.min(currentPage, totalPages)
  const startIndex = (currentPageSafe - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const documentTypeOptions = useMemo(() => {
    const types = new Set<string>()
    documents.forEach((doc) => {
      if (doc.type) {
        types.add(doc.type)
      }
    })
    return Array.from(types)
      .sort()
      .map((type) => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type }))
  }, [documents])

  const toolbarFilters: DataTableFilterControl[] = useMemo(
    () => [
      {
        id: 'type',
        label: 'Document Type',
        type: 'select',
        value: typeFilter === 'all' ? '' : typeFilter,
        onChange: (value: string) => setTypeFilter(value || 'all'),
        onClear: typeFilter !== 'all' ? () => setTypeFilter('all') : undefined,
        options: [
          { label: 'All types', value: '' },
          ...documentTypeOptions
        ],
        width: 3
      }
    ],
    [typeFilter, documentTypeOptions]
  )

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPageSafe) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    if (size === pageSize) return
    setPageSize(size)
    setCurrentPage(1)
  }

  const ensureAdminAccess = () => {
    if (!token || !isAuthenticated ) {
      toast.error('You are not authorized to manage documents.')
      return false
    }
    return true
  }

  const handleViewRow = useCallback(async (doc: KnowledgeBaseDocument) => {
    if (!ensureAdminAccess()) return
    const docId = getDocumentIdentifier(doc)
    if (!docId) {
      toast.error('Document identifier is missing.')
      return
    }

    setSelectedDocument(doc)
    setViewModalOpen(true)
    setViewDetails(doc)
    setViewDependentAgents(doc.dependent_agents ?? [])
    setViewLoadingId(docId)

    try {
      const [detailsResponse, dependentsResponse] = await Promise.all([
        knowledgeBaseApi.getDocument(token, docId),
        knowledgeBaseApi.getDependentAgents(token, docId)
      ])

      if (detailsResponse.error) {
        toast.error(detailsResponse.error)
      } else if (detailsResponse.data) {
        setViewDetails(detailsResponse.data)
      }

      if (dependentsResponse.error) {
        toast.error(dependentsResponse.error)
      } else if (dependentsResponse.data) {
        setViewDependentAgents(dependentsResponse.data)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to load document.')
    } finally {
      setViewLoadingId(null)
    }
  },[])

  const handleAttachPrompt = useCallback((doc: KnowledgeBaseDocument) => {
    if (!ensureAdminAccess()) return
    setSelectedDocument(doc)
    setAttachAgentId('')
    setAttachModalOpen(true)
  },[])

  const handleAttachSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ensureAdminAccess()) return

    const docId = getDocumentIdentifier(selectedDocument)
    if (!docId) {
      toast.error('Document identifier is missing.')
      return
    }
    if (!attachAgentId) {
      toast.error('Please select an agent.')
      return
    }

    setAttachSubmitting(true)
    try {
      const response = await knowledgeBaseApi.attachDocumentToAgent(token as string, attachAgentId, {
        document_ids: [docId],
        usage_mode: 'auto'
      })

      if (response.error) {
        toast.error(response.error)
        return
      }

      toast.success('Document attached to agent.')
      setAttachModalOpen(false)
      fetchDocuments()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to attach document.')
    } finally {
      setAttachSubmitting(false)
    }
  }

  const handleDeletePrompt = (doc: KnowledgeBaseDocument) => {
    if (!ensureAdminAccess()) return
    setSelectedDocument(doc)
    setDeleteModalOpen(true)
  }

  const columns: DataTableColumn<KnowledgeBaseDocument>[] = useMemo(
    () => [
      {
        key: 'index',
        header: '#',
        width: 60,
        align: 'center',
        sticky: 'left',
        render: (_row, { rowIndex }) => <span className="text-muted">{startIndex + rowIndex + 1}</span>
      },
      {
        key: 'name',
        header: 'Document',
        minWidth: 240,
        sticky: 'left',
        render: (row) => (
          <div>
            <div className="fw-semibold">{row.name || 'Untitled document'}</div>
            <small className="text-muted text-break">{row.id}</small>
          </div>
        )
      },
      {
        key: 'type',
        header: 'Type',
        minWidth: 140,
        render: (row) => (
          <div className="d-flex flex-column gap-1">
            <Badge bg="info" className="text-capitalize align-self-start">
              {row.type || 'unknown'}
            </Badge>
            {row.source?.type && <small className="text-muted text-uppercase">{row.source.type}</small>}
          </div>
        )
      },
      {
        key: 'usedBy',
        header: 'Used By',
        minWidth: 180,
        render: (row) => {
          const count = row.dependent_agents?.length ?? 0
          if (count === 0) {
            return <span className="text-muted">Not attached</span>
          }
          const preview = row.dependent_agents?.slice(0, 2) ?? []
          return (
            <div className="d-flex flex-column gap-1">
              <div className="d-flex flex-wrap gap-1">
                {preview.map((agent) => (
                  <Badge bg="secondary" key={`${row.id}-${agent.agent_id}`} className="text-truncate">
                    {agent.name || agent.agent_id}
                  </Badge>
                ))}
              </div>
              {count > preview.length && <small className="text-muted">+{count - preview.length} more</small>}
            </div>
          )
        }
      },
      {
        key: 'actions',
        header: 'Actions',
        minWidth: 220,
        align: 'center',
        sticky: 'right',
        render: (row) => {
          const docId = getDocumentIdentifier(row)
          const isViewing = viewLoadingId === docId
          const isDeleting = deleteLoadingId === docId

          return (
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              <Button
                size="sm"
                variant="outline-secondary"
                title="View details"
                onClick={() => handleViewRow(row)}
                disabled={isViewing}
              >
                {isViewing ? <Spinner animation="border" size="sm" /> : <IconifyIcon icon="solar:eye-outline" width={16} height={16} />}
              </Button>
              <Button size="sm" variant="outline-primary" title="Attach to agent" onClick={() => handleAttachPrompt(row)}>
                <IconifyIcon icon="solar:link-circle-outline" width={16} height={16} />
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                title="Delete document"
                onClick={() => handleDeletePrompt(row)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <IconifyIcon icon="solar:trash-bin-minimalistic-outline" width={16} height={16} />
                )}
              </Button>
            </div>
          )
        }
      }
    ],
    [startIndex, viewLoadingId, deleteLoadingId, handleViewRow, handleAttachPrompt, handleDeletePrompt]
  )

  const tableMinWidth = useMemo(
    () =>
      columns.reduce((total, column) => {
        const width = column.minWidth ?? column.width ?? 140
        return total + width
      }, 0),
    [columns]
  )

  const handleConfirmDelete = async () => {
    if (!ensureAdminAccess()) return
    const docId = getDocumentIdentifier(selectedDocument)
    if (!docId) {
      toast.error('Document identifier is missing.')
      return
    }

    setDeleteLoadingId(docId)
    try {
      const response = await knowledgeBaseApi.deleteDocument(token as string, docId)
      if (response.error) {
        toast.error(response.error)
        return
      }
      toast.success('Document deleted.')
      setDeleteModalOpen(false)
      fetchDocuments()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete document.')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <h4 className="mb-2">Please sign in</h4>
            <p className="text-muted mb-0">You need an admin account to view documents.</p>
          </div>
        </Col>
      </Row>
    )
  }

  // if (user && user.role !== 'admin') {
  //   return (
  //     <Row className="py-5">
  //       <Col xs={12}>
  //         <div className="text-center">
  //           <IconifyIcon icon="solar:shield-cross-outline" width={48} height={48} className="text-danger mb-3" />
  //           <h4 className="mb-2">Access restricted</h4>
  //           <p className="text-muted mb-0">Only admins can manage documents.</p>
  //         </div>
  //       </Col>
  //     </Row>
  //   )
  // }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-0">Documents</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Taplox</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Documents</li>
              </ol>
            </div>
            <Button variant="primary" onClick={fetchDocuments}>
              <IconifyIcon icon="solar:refresh-outline" width={18} height={18} className="me-2" />
              Refresh
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="knowledge-base-documents"
            title="Knowledge Base"
            description="Manage all knowledge base documents and their agent attachments."
            columns={columns}
            data={paginatedDocuments}
            loading={loading}
            error={error}
            onRetry={fetchDocuments}
            minTableWidth={tableMinWidth}
            toolbar={{
              showFilters,
              onToggleFilters: () => setShowFilters((prev) => !prev),
              search: {
                value: searchQuery,
                placeholder: 'Search documents by name, ID, or URL',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              },
              filters: toolbarFilters
            }}
            pagination={{
              currentPage: currentPageSafe,
              pageSize,
              totalRecords,
              totalPages,
              startRecord: totalRecords === 0 ? 0 : startIndex + 1,
              endRecord: Math.min(endIndex, totalRecords),
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
              pageSizeOptions: [10, 25, 50, 100],
              isLastPage: currentPageSafe >= totalPages,
              hasMore: currentPageSafe < totalPages
            }}
          />
        </Col>
      </Row>

      <Modal show={viewModalOpen} onHide={() => setViewModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Document Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewLoadingId && (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          )}
          {!viewLoadingId && viewDetails ? (
            <div className="d-flex flex-column gap-3">
              <div>
                <p className="text-uppercase text-muted small mb-1">Document Name</p>
                <h5 className="mb-0">{viewDetails.name || 'Untitled document'}</h5>
                <small className="text-muted">{viewDetails.id}</small>
              </div>
              <Row className="g-3">
                <Col md={4}>
                  <p className="text-uppercase text-muted small mb-1">Type</p>
                  <Badge bg="info" className="text-capitalize">
                    {viewDetails.type || 'unknown'}
                  </Badge>
                </Col>
                <Col md={4}>
                  <p className="text-uppercase text-muted small mb-1">Status</p>
                  {viewDetails.status ? (
                    <Badge bg={getStatusVariant(viewDetails.status)} className="text-capitalize">
                      {viewDetails.status}
                    </Badge>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Col>
                <Col md={4}>
                  <p className="text-uppercase text-muted small mb-1">Tokens</p>
                  <span>{viewDetails.tokens ?? viewDetails.token_count ?? viewDetails.estimated_token_count ?? '—'}</span>
                </Col>
                <Col md={6}>
                  <p className="text-uppercase text-muted small mb-1">Created</p>
                  <span>{formatDate(viewDetails.created_at)}</span>
                </Col>
                <Col md={6}>
                  <p className="text-uppercase text-muted small mb-1">Updated</p>
                  <span>{formatDate(viewDetails.updated_at)}</span>
                </Col>
                {viewDetails.source?.url && (
                  <Col md={12}>
                    <p className="text-uppercase text-muted small mb-1">Source URL</p>
                    <a href={viewDetails.source.url} target="_blank" rel="noreferrer" className="text-decoration-underline">
                      {viewDetails.source.url}
                    </a>
                  </Col>
                )}
              </Row>
              <div>
                <p className="text-uppercase text-muted small mb-1">Used By</p>
                {viewDependentAgents.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {viewDependentAgents.map((agent) => (
                      <Badge bg="secondary" key={agent.agent_id}>
                        {agent.name || agent.agent_id}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">Not attached to any agents.</span>
                )}
              </div>
              {viewDetails.metadata && Object.keys(viewDetails.metadata).length > 0 && (
                <div>
                  <p className="text-uppercase text-muted small mb-1">Metadata</p>
                  <pre className="bg-body-tertiary rounded p-3 mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                    {JSON.stringify(viewDetails.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : null}
        </Modal.Body>
      </Modal>

      <Modal show={attachModalOpen} onHide={() => setAttachModalOpen(false)} centered>
        <Form onSubmit={handleAttachSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Attach Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <p className="text-uppercase text-muted small mb-1">Document</p>
              <div className="fw-semibold">{selectedDocument?.name || 'Untitled document'}</div>
              <small className="text-muted">{selectedDocument?.id}</small>
            </div>
            <Form.Group controlId="attachAgentSelect" className="mb-3">
              <Form.Label>Agent</Form.Label>
              <Form.Select
                value={attachAgentId}
                onChange={(event) => setAttachAgentId(event.target.value)}
                disabled={agentsLoading}
              >
                <option value="">Select an agent</option>
                {availableAgents.map((agent) => {
                  const agentId = agent.agent_id || agent.id || ''
                  return (
                    <option key={agentId} value={agentId}>
                      {agent.name || agentId}
                    </option>
                  )
                })}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setAttachModalOpen(false)} disabled={attachSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={attachSubmitting || !attachAgentId}>
              {attachSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Attaching...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:link-circle-outline" width={16} height={16} className="me-2" />
                  Attach Document
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete{' '}
            <strong>{selectedDocument?.name || selectedDocument?.id || 'this document'}</strong>? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} disabled={!!deleteLoadingId}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={!!deleteLoadingId}>
            {deleteLoadingId ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:trash-bin-trash-outline" width={16} height={16} className="me-2" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DocumentsPage

