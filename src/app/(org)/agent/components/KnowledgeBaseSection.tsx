// src/components/agent/KnowledgeBaseSection.tsx
'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, Button, Badge, Modal } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { DataTable } from '@/components/table'
import type { DataTableColumn } from '@/components/table'
import { toast } from 'react-toastify'
import { agentsApi, type KnowledgeBase } from '@/api/org/agents'

interface KnowledgeBaseSectionProps {
  knowledgeBases: KnowledgeBase[]
  loading?: boolean
  onRefresh: () => void
}

const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({
  knowledgeBases,
  loading,
  onRefresh
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null)

  const handleToggle = useCallback(async (kb: KnowledgeBase) => {
    setActionLoading(kb.id)
    
    // Simulate API call with dummy data
    setTimeout(() => {
      try {
        const newStatus = kb.status === 'enabled' ? 'disabled' : 'enabled'
        toast.success(`Knowledge base ${newStatus} successfully (Demo Mode)`)
        
        // In real implementation, this would update the backend
        // await agentsApi.toggleKnowledgeBase(kb.id, newStatus === 'enabled')
        
        onRefresh()
      } catch (err: any) {
        toast.error('Failed to update knowledge base')
      } finally {
        setActionLoading(null)
      }
    }, 800)
  }, [onRefresh])

  const handleDeleteClick = useCallback((kb: KnowledgeBase) => {
    setSelectedKb(kb)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedKb) return

    setActionLoading(selectedKb.id)
    
    // Simulate API call with dummy data
    setTimeout(() => {
      try {
        toast.success('Knowledge base deleted successfully (Demo Mode)')
        
        // In real implementation, this would delete from backend
        // await agentsApi.deleteKnowledgeBase(selectedKb.id)
        
        setShowDeleteModal(false)
        setSelectedKb(null)
        onRefresh()
      } catch (err: any) {
        toast.error('Failed to delete knowledge base')
      } finally {
        setActionLoading(null)
      }
    }, 800)
  }, [selectedKb, onRefresh])

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      file: 'primary',
      url: 'info',
      text: 'secondary'
    }
    const icons: Record<string, string> = {
      file: 'solar:document-bold',
      url: 'solar:link-bold',
      text: 'solar:text-bold'
    }
    return (
      <Badge bg={colors[type] || 'secondary'} className="d-inline-flex align-items-center gap-1">
        <IconifyIcon icon={icons[type]} width={14} height={14} />
        {type.toUpperCase()}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === 'enabled' ? (
      <Badge bg="success">Enabled</Badge>
    ) : (
      <Badge bg="secondary">Disabled</Badge>
    )
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns: DataTableColumn<KnowledgeBase>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        minWidth: 250,
        render: (kb) => (
          <div>
            <div className="fw-semibold">{kb.name}</div>
            {kb.type === 'url' && kb.url && (
              <small className="text-muted d-block text-truncate" style={{ maxWidth: 300 }}>
                {kb.url}
              </small>
            )}
            {kb.type === 'file' && kb.file_url && (
              <small className="text-muted d-block">Document file</small>
            )}
          </div>
        )
      },
      {
        key: 'type',
        header: 'Type',
        width: 120,
        align: 'center',
        render: (kb) => getTypeBadge(kb.type)
      },
      {
        key: 'status',
        header: 'Status',
        width: 120,
        align: 'center',
        render: (kb) => getStatusBadge(kb.status)
      },
      {
        key: 'created_at',
        header: 'Created',
        minWidth: 180,
        render: (kb) => (
          <small className="text-muted">{formatDateTime(kb.created_at)}</small>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 200,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (kb) => (
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant={kb.status === 'enabled' ? 'outline-warning' : 'outline-success'}
              size="sm"
              onClick={() => handleToggle(kb)}
              disabled={actionLoading === kb.id}
              title={kb.status === 'enabled' ? 'Disable' : 'Enable'}
            >
              {actionLoading === kb.id ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <IconifyIcon
                  icon={kb.status === 'enabled' ? 'solar:eye-closed-linear' : 'solar:eye-linear'}
                  width={16}
                  height={16}
                />
              )}
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(kb)}
              disabled={actionLoading === kb.id}
              title="Delete"
            >
              <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [actionLoading, handleToggle, handleDeleteClick]
  )

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <IconifyIcon icon="solar:book-bookmark-bold" width={24} height={24} className="me-2" />
            Knowledge Base
          </h5>
          <Button variant="outline-primary" size="sm" onClick={onRefresh} disabled={loading}>
            <IconifyIcon icon="solar:refresh-linear" width={16} height={16} />
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <DataTable
            id="knowledge-bases-table"
            title='Knowledge Bases'
            columns={columns}
            data={knowledgeBases}
            rowKey={(kb) => kb.id}
            loading={loading}
            columnPanel={{
              enableColumnVisibility: true,
              enableSticky: true,
              maxSticky: 2
            }}
            emptyState={{
              title: 'No Knowledge Bases',
              description: 'There are no knowledge bases attached to this agent yet.'
            }}
          />
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the knowledge base:</p>
          <strong>{selectedKb?.name}</strong>
          <p className="text-muted mt-2 mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={actionLoading !== null}
          >
            {actionLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default KnowledgeBaseSection