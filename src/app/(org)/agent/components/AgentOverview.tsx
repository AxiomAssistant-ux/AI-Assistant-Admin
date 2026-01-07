// src/components/agent/AgentOverview.tsx
'use client'

import React, { useState } from 'react'
import { Card, Row, Col, Badge, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { toast } from 'react-toastify'
import type { Agent } from '@/api/org/agents'

interface AgentOverviewProps {
  agent: Agent | null
  loading?: boolean
}

const AgentOverview: React.FC<AgentOverviewProps> = ({ agent, loading }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyPhoneNumber = () => {
    if (agent?.phone_number) {
      navigator.clipboard.writeText(agent.phone_number)
      setCopied(true)
      toast.success('Phone number copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge bg="success" className="px-3 py-2">
        <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="me-1" />
        Active
      </Badge>
    ) : (
      <Badge bg="secondary" className="px-3 py-2">
        <IconifyIcon icon="solar:close-circle-bold" width={16} height={16} className="me-1" />
        Disabled
      </Badge>
    )
  }

  const getProviderBadge = (provider: string) => {
    const colors: Record<string, string> = {
      retell: 'primary',
      elevenlabs: 'info'
    }
    return (
      <Badge bg={colors[provider] || 'secondary'} className="px-3 py-2">
        {provider === 'retell' ? 'Retell AI' : provider === 'elevenlabs' ? 'ElevenLabs' : provider}
      </Badge>
    )
  }

  if (loading || !agent) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <IconifyIcon icon="solar:user-speak-rounded-bold" width={24} height={24} className="me-2" />
            Agent Overview
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="placeholder-glow">
            <span className="placeholder col-12 mb-3"></span>
            <span className="placeholder col-8 mb-3"></span>
            <span className="placeholder col-10 mb-3"></span>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <IconifyIcon icon="solar:user-speak-rounded-bold" width={24} height={24} className="me-2" />
          Agent Overview
        </h5>
        {getStatusBadge(agent.status)}
      </Card.Header>
      <Card.Body>
        <Row className="g-4">
          <Col md={6}>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Agent Name</small>
              <h6 className="mb-0">{agent.name}</h6>
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Provider</small>
              {getProviderBadge(agent.provider)}
            </div>
          </Col>

          {agent.phone_number && (
            <Col md={6}>
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Assigned Phone Number</small>
                <div className="d-flex align-items-center gap-2">
                  <code className="bg-light px-2 py-1 rounded">{agent.phone_number}</code>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleCopyPhoneNumber}
                    title="Copy phone number"
                  >
                    <IconifyIcon 
                      icon={copied ? "solar:check-circle-bold" : "solar:copy-linear"} 
                      width={16} 
                      height={16} 
                    />
                  </Button>
                </div>
              </div>
            </Col>
          )}

          <Col md={6}>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Language</small>
              <strong>{agent.language}</strong>
            </div>
          </Col>

          <Col md={12}>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Voice</small>
              <div className="d-flex align-items-center gap-2">
                <IconifyIcon icon="solar:microphone-bold" width={18} height={18} className="text-primary" />
                <strong>{agent.voice}</strong>
                {agent.voice_gender && (
                  <Badge bg="light" text="dark" className="ms-2">
                    {agent.voice_gender}
                  </Badge>
                )}
                {agent.voice_accent && (
                  <Badge bg="light" text="dark">
                    {agent.voice_accent}
                  </Badge>
                )}
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Created At</small>
              <small>{formatDateTime(agent.created_at)}</small>
            </div>
          </Col>

          <Col md={6}>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Last Updated</small>
              <small>{formatDateTime(agent.updated_at)}</small>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default AgentOverview