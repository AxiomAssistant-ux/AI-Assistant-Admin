// app/(dashboard)/agent/page.tsx - UPDATED FOR UNIFIED BACKEND
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Row, Spinner, Alert } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'
import { AgentSetupWizard } from './components/AgentSetupWizard'
import { QuickSetupWizard } from './components/QuickSetupWizard'
import { agentsApi, type AgentConfiguration, type KnowledgeBase } from '@/api/org/agents'

type ConfigStatus = 'pending_review' | 'approved' | 'rejected' | 'active'

interface AgentConfig {
  id: string
  org_id: string
  name: string
  status: ConfigStatus
  configuration: AgentConfiguration
  retell_agent_id: string | null
  agent_assigned: boolean
  created_at: string
  updated_at: string
  admin_notes?: string
  rejection_reason?: string
}

interface AgentStatus {
  has_config: boolean
  status: ConfigStatus | null
  agent_assigned: boolean
  can_upload_kb: boolean
  retell_agent_id: string | null
  message: string
}

const AgentPage = () => {
  const { isAuthenticated } = useAuth()

  // Agent config state
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null)
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null)
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)

  // Knowledge base state
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loadingKnowledge, setLoadingKnowledge] = useState(false)
  const [syncingKB, setSyncingKB] = useState<string | null>(null)

  // Wizard state
  const [showQuickSetup, setShowQuickSetup] = useState(false)
  const [showDetailedWizard, setShowDetailedWizard] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState<AgentConfiguration | null>(null)

  /**
   * Fetch agent config and status
   */
  const fetchAgentStatus = useCallback(async () => {
    if (!isAuthenticated) return

    setLoadingConfig(true)
    setConfigError(null)

    try {
      // Get config
      const configData = await agentsApi.getConfig()
      setAgentConfig(configData)
      
      // Get status
      const statusData = await agentsApi.getStatus()
      setAgentStatus(statusData)
      
      setConfigError(null)
    } catch (err: any) {
      console.error('Error fetching agent status:', err)
      
      // If 404, no config exists yet
      if (err?.response?.status === 404) {
        setAgentConfig(null)
        setAgentStatus({
          has_config: false,
          status: null,
          agent_assigned: false,
          can_upload_kb: false,
          retell_agent_id: null,
          message: 'No agent configuration found. Please create one.'
        })
        setConfigError('no_config')
      } else {
        setAgentConfig(null)
        setAgentStatus(null)
        setConfigError('Failed to load agent configuration')
        toast.error('Failed to load agent configuration')
      }
    } finally {
      setLoadingConfig(false)
    }
  }, [isAuthenticated])

  /**
   * Fetch knowledge bases
   */
  const fetchKnowledgeBases = useCallback(async () => {
    if (!isAuthenticated || !agentStatus?.can_upload_kb) return
    
    setLoadingKnowledge(true)

    try {
      const data = await agentsApi.listKnowledgeBases();
      const kbArray = Array.isArray(data) ? data : (data.items || [])
      setKnowledgeBases(kbArray)
    } catch (err) {
      console.error('Failed to load knowledge bases:', err)
      // Don't show error if agent not assigned yet (403)
      if (err?.response?.status !== 403) {
        toast.error('Failed to load knowledge bases')
      }
    } finally {
      setLoadingKnowledge(false)
    }
  }, [isAuthenticated, agentStatus])

  useEffect(() => {
    fetchAgentStatus()
  }, [fetchAgentStatus])

  useEffect(() => {
    if (agentStatus?.can_upload_kb) {
      fetchKnowledgeBases()
    }
  }, [fetchKnowledgeBases, agentStatus])

  /**
   * Handle quick setup config generation
   */
  const handleQuickSetupComplete = (config: AgentConfiguration) => {
    setGeneratedConfig(config)
    setShowQuickSetup(false)
    setShowDetailedWizard(true)
  }

  /**
   * Wizard submit
   */
  const handleWizardSubmit = async (config: AgentConfiguration) => {
    try {
      toast.info('Saving agent configuration...')

      if (!agentConfig) {
        // Create new agent config
        const newConfig = await agentsApi.createConfig({
          name: config?.branding?.agent_name || 'Customer Care Assistant',
          configuration: config
        })
        
        setAgentConfig(newConfig)
        
        // Refresh status
        const statusData = await agentsApi.getStatus()
        setAgentStatus(statusData)
        
        toast.success('✅ Agent configuration submitted! Awaiting admin approval.')
      } else {
        // Update existing config
        await agentsApi.updateConfig(config)
        
        // Refresh config and status
        const updatedConfig = await agentsApi.getConfig()
        setAgentConfig(updatedConfig)
        
        const statusData = await agentsApi.getStatus()
        setAgentStatus(statusData)
        
        toast.success('✅ Agent configuration updated successfully!')
      }

      setShowDetailedWizard(false)
      setGeneratedConfig(null)
    } catch (e: any) {
      console.error('Failed to save agent config:', e)
      toast.error(e?.response?.data?.detail || 'Failed to save configuration')
    }
  }

  /**
   * Toggle KB enable/disable
   */
  const handleToggleKnowledge = async (kb: KnowledgeBase) => {
    setSyncingKB(kb.id)

    try {
      if (kb.enabled) {
        // Disable KB
        await agentsApi.disableKnowledgeBase(kb.id)
        toast.success(`📴 "${kb.name}" disabled and removed from agent`)
      } else {
        // Enable KB (sync to Retell)
        await agentsApi.enableKnowledgeBase(kb.id)
        toast.success(`✅ "${kb.name}" enabled and synced to agent!`)
      }

      // Refresh KB list
      const data = await agentsApi.listKnowledgeBases()
      const kbArray = Array.isArray(data) ? data : (data.items || [])
      setKnowledgeBases(kbArray)
    } catch (err: any) {
      const action = kb.enabled ? 'disable' : 'enable'
      toast.error(err?.response?.data?.detail || `Failed to ${action} knowledge base`)
    } finally {
      setSyncingKB(null)
    }
  }

  /**
   * Delete KB
   */
  const handleDeleteKnowledge = async (kb: KnowledgeBase) => {
    if (!confirm(`Are you sure you want to delete "${kb.name}"?`)) return

    try {
      await agentsApi.deleteKnowledgeBase(kb.id)
      setKnowledgeBases((prev) => prev.filter((item) => item.id !== kb.id))
      toast.success('🗑️ Knowledge base deleted successfully')
    } catch (err) {
      toast.error('Failed to delete knowledge base')
    }
  }

  /**
   * Upload KB
   */
  const handleUploadKB = async (file: File, name: string, description: string) => {
    try {
      toast.info('Uploading knowledge base...')
      
      const newKB = await agentsApi.createKnowledgeBase({
        name,
        description,
        file
      })
      
      setKnowledgeBases((prev) => [...prev, newKB])
      toast.success('📤 Knowledge base uploaded! Enable it to sync with your agent.')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to upload knowledge base')
    }
  }

  /**
   * Helpers
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'approved':
        return 'info'
      case 'pending_review':
        return 'warning'
      case 'rejected':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getSyncStatusBadge = (kb: KnowledgeBase) => {
    if (kb.enabled && kb.sync_status === 'synced') {
      return <Badge bg="success">✓ Active</Badge>
    } else if (kb.sync_status === 'syncing') {
      return <Badge bg="warning">⏳ Syncing...</Badge>
    } else if (kb.sync_status === 'failed') {
      return <Badge bg="danger">✗ Failed</Badge>
    } else {
      return <Badge bg="secondary">⚪ Inactive</Badge>
    }
  }

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
            <p>Please sign in to view agent details.</p>
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
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">AI Agent Configuration</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Agent</li>
              </ol>
            </div>
            {agentConfig && agentConfig.status !== 'rejected' && (
              <Button variant="primary" onClick={() => setShowDetailedWizard(true)} disabled={loadingConfig}>
                <IconifyIcon icon="solar:settings-linear" width={18} height={18} className="me-2" />
                Update Configuration
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Agent Status */}
      <Row className="mt-4">
        <Col xs={12}>
          {loadingConfig ? (
            <Card>
              <Card.Body className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-3 mb-0">Loading agent status...</p>
              </Card.Body>
            </Card>
          ) : configError === 'no_config' ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <IconifyIcon icon="solar:robot-linear" width={64} height={64} className="text-muted mb-3" />
                <h5>No Agent Configuration Found</h5>
                <p className="text-muted mb-4">Set up your AI agent configuration in minutes with our smart wizard</p>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => setShowQuickSetup(true)}
                    className="px-4"
                  >
                    <IconifyIcon icon="solar:magic-stick-bold-duotone" width={20} height={20} className="me-2" />
                    Quick Setup (Recommended)
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    onClick={() => setShowDetailedWizard(true)}
                    className="px-4"
                  >
                    <IconifyIcon icon="solar:settings-linear" width={20} height={20} className="me-2" />
                    Manual Setup
                  </Button>
                </div>
                
                <div className="mt-4">
                  <small className="text-muted">
                    <IconifyIcon icon="solar:info-circle-linear" width={16} className="me-1" />
                    Quick Setup uses AI to auto-fill all fields based on your answers
                  </small>
                </div>
              </Card.Body>
            </Card>
          ) : agentStatus ? (
            <>
              {/* Status Alerts */}
              {agentStatus.status === 'pending_review' && (
                <Alert variant="warning" className="mb-3">
                  <div className="d-flex align-items-center">
                    <IconifyIcon icon="solar:clock-circle-bold" width={24} className="me-2" />
                    <div>
                      <strong>⏳ Configuration Under Review</strong>
                      <p className="mb-0 small">
                        {agentStatus.message}
                      </p>
                    </div>
                  </div>
                </Alert>
              )}

              {agentStatus.status === 'approved' && !agentStatus.agent_assigned && (
                <Alert variant="info" className="mb-3">
                  <div className="d-flex align-items-center">
                    <IconifyIcon icon="solar:settings-minimalistic-bold" width={24} className="me-2" />
                    <div>
                      <strong>✓ Configuration Approved</strong>
                      <p className="mb-0 small">
                        Your configuration has been approved! The support team is setting up your Retell agent.
                      </p>
                    </div>
                  </div>
                </Alert>
              )}

              {agentStatus.status === 'rejected' && (
                <Alert variant="danger" className="mb-3">
                  <div className="d-flex align-items-center">
                    <IconifyIcon icon="solar:close-circle-bold" width={24} className="me-2" />
                    <div>
                      <strong>✗ Configuration Rejected</strong>
                      <p className="mb-0 small">
                        {agentConfig?.rejection_reason || 'Please revise and resubmit your configuration.'}
                      </p>
                      {agentConfig?.admin_notes && (
                        <p className="mb-0 small mt-1 text-muted">
                          <strong>Admin Notes:</strong> {agentConfig.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button variant="danger" size="sm" onClick={() => setShowDetailedWizard(true)}>
                      <IconifyIcon icon="solar:pen-linear" width={16} className="me-2" />
                      Revise Configuration
                    </Button>
                  </div>
                </Alert>
              )}

              {agentStatus.status === 'active' && agentStatus.agent_assigned && (
                <Alert variant="success" className="mb-3">
                  <div className="d-flex align-items-center">
                    <IconifyIcon icon="solar:check-circle-bold" width={24} className="me-2" />
                    <div>
                      <strong>✅ Agent Active!</strong>
                      <p className="mb-0 small">
                        Your agent is live and ready. You can now upload knowledge bases below.
                      </p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Configuration Details */}
              {agentConfig && (
                <Card className="mb-3">
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <IconifyIcon icon="solar:settings-linear" width={24} height={24} className="me-2" />
                        Configuration Details
                      </h5>
                      <Badge bg={getStatusVariant(agentConfig.status)} className="text-capitalize px-3 py-2">
                        {agentConfig.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-4">
                      <Col md={6}>
                        <label className="text-muted small d-block mb-1">Configuration Name</label>
                        <h5 className="mb-0">{agentConfig.name}</h5>
                      </Col>
                      <Col md={6}>
                        <label className="text-muted small d-block mb-1">Company Name</label>
                        <div className="fw-medium">{agentConfig.configuration.branding.company_name}</div>
                      </Col>
                      <Col md={6}>
                        <label className="text-muted small d-block mb-1">Agent Name</label>
                        <div className="fw-medium">{agentConfig.configuration.branding.agent_name}</div>
                      </Col>
                      <Col md={6}>
                        <label className="text-muted small d-block mb-1">Industry</label>
                        <div className="fw-medium">{agentConfig.configuration.branding.industry}</div>
                      </Col>
                      <Col md={6}>
                        <label className="text-muted small d-block mb-1">Primary Language</label>
                        <div className="fw-medium">{agentConfig.configuration.operations.primary_language}</div>
                      </Col>
                      <Col md={6}>
                        <label className="text-muted small d-block mb-1">Operating Hours</label>
                        <div className="fw-medium">{agentConfig.configuration.operations.operating_hours}</div>
                      </Col>
                      {agentStatus.retell_agent_id && (
                        <Col md={12}>
                          <label className="text-muted small d-block mb-1">Retell Agent ID</label>
                          <code className="small">{agentStatus.retell_agent_id}</code>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </>
          ) : null}
        </Col>
      </Row>

      {/* Knowledge Base Section */}
      {agentStatus?.can_upload_kb && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <IconifyIcon icon="solar:book-linear" width={24} height={24} className="me-2" />
                    Knowledge Base
                  </h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = '.pdf,.txt,.docx'
                      input.onchange = async (e: any) => {
                        const file = e.target.files[0]
                        if (file) {
                          const name = prompt('Knowledge Base Name:', file.name.replace(/\.[^/.]+$/, ''))
                          const description = prompt('Description:', '')
                          if (name && description) {
                            await handleUploadKB(file, name, description)
                          }
                        }
                      }
                      input.click()
                    }}
                  >
                    <IconifyIcon icon="solar:upload-linear" width={16} height={16} className="me-2" />
                    Upload Knowledge Base
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {loadingKnowledge ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <p className="text-muted mt-2 mb-0 small">Loading knowledge bases...</p>
                  </div>
                ) : knowledgeBases.length === 0 ? (
                  <div className="text-center py-4">
                    <IconifyIcon icon="solar:book-linear" width={48} height={48} className="text-muted mb-3" />
                    <h6 className="text-muted">No Knowledge Bases Yet</h6>
                    <p className="text-muted small mb-3">
                      Upload documents to enhance your agent knowledge
                    </p>
                    <p className="text-muted small mb-0">
                      <IconifyIcon icon="solar:info-circle-linear" width={16} className="me-1" />
                      Supported formats: PDF, TXT, DOCX (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {knowledgeBases.map((kb) => (
                      <Card key={kb.id} className="shadow-none border">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Col md={6}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="p-2 bg-light rounded">
                                  <IconifyIcon icon="solar:document-linear" width={24} height={24} className="text-primary" />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="mb-0">{kb.name}</h6>
                                    {getSyncStatusBadge(kb)}
                                  </div>
                                  <p className="text-muted small mb-2">{kb.description}</p>
                                  <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <Badge bg="light" text="dark" className="font-monospace">
                                      {kb.file_name}
                                    </Badge>
                                    <Badge bg="light" text="dark">
                                      {formatFileSize(kb.file_size)}
                                    </Badge>
                                  </div>
                                  {kb.sync_error && (
                                    <Alert variant="danger" className="mt-2 mb-0 small">
                                      <strong>Sync Error:</strong> {kb.sync_error}
                                    </Alert>
                                  )}
                                </div>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className="d-flex justify-content-md-end align-items-center gap-2 mt-3 mt-md-0">
                                <Button
                                  variant={kb.enabled ? 'success' : 'outline-success'}
                                  size="sm"
                                  onClick={() => handleToggleKnowledge(kb)}
                                  disabled={syncingKB === kb.id || kb.sync_status === 'syncing'}
                                  title={kb.enabled ? 'Disable (remove from agent)' : 'Enable (sync to agent)'}
                                >
                                  {syncingKB === kb.id ? (
                                    <>
                                      <Spinner animation="border" size="sm" className="me-2" />
                                      {kb.enabled ? 'Disabling...' : 'Enabling...'}
                                    </>
                                  ) : (
                                    <>
                                      <IconifyIcon 
                                        icon={kb.enabled ? 'solar:check-circle-bold' : 'solar:play-circle-linear'} 
                                        width={16} 
                                        height={16} 
                                        className="me-2"
                                      />
                                      {kb.enabled ? 'Enabled' : 'Enable'}
                                    </>
                                  )}
                                </Button>

                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteKnowledge(kb)}
                                  disabled={syncingKB === kb.id}
                                  title="Delete knowledge base"
                                >
                                  <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* KB Upload Blocked Message */}
      {agentStatus && !agentStatus.can_upload_kb && agentConfig && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="border-warning">
              <Card.Body className="text-center py-4">
                <IconifyIcon icon="solar:lock-keyhole-linear" width={48} height={48} className="text-warning mb-3" />
                <h6>Knowledge Base Uploads Locked</h6>
                <p className="text-muted small mb-0">
                  Knowledge base uploads will be available after your agent has been assigned by the support team.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Setup Wizard Modal */}
      <QuickSetupWizard
        show={showQuickSetup}
        onHide={() => setShowQuickSetup(false)}
        onConfigGenerated={handleQuickSetupComplete}
      />

      {/* Detailed Setup Wizard Modal */}
      <AgentSetupWizard
        show={showDetailedWizard}
        onHide={() => {
          setShowDetailedWizard(false)
          setGeneratedConfig(null)
        }}
        onSubmit={handleWizardSubmit}
        initialConfig={generatedConfig || agentConfig?.configuration}
      />
    </>
  )
}

export default AgentPage

export const dynamic = 'force-dynamic'