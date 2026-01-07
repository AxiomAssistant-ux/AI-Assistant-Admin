// src/components/agent/AgentCapabilities.tsx
'use client'

import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { Agent } from '@/api/org/agents'

interface AgentCapabilitiesProps {
  agent: Agent | null
  loading?: boolean
}

const AgentCapabilities: React.FC<AgentCapabilitiesProps> = ({ agent, loading }) => {
  // Show loading state if loading or agent is null
  if (loading || !agent) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <IconifyIcon icon="solar:settings-bold" width={24} height={24} className="me-2" />
            Agent Capabilities
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="placeholder-glow">
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12 mb-2"></span>
          </div>
        </Card.Body>
      </Card>
    )
  }

  const capabilities = [
    {
      key: 'call_recording_enabled',
      label: 'Call Recording',
      icon: 'solar:record-circle-bold',
      enabled: agent.capabilities.call_recording_enabled
    },
    {
      key: 'call_summaries_enabled',
      label: 'Call Summaries',
      icon: 'solar:document-text-bold',
      enabled: agent.capabilities.call_summaries_enabled
    },
    {
      key: 'action_items_enabled',
      label: 'Action Items',
      icon: 'solar:checklist-minimalistic-bold',
      enabled: agent.capabilities.action_items_enabled
    },
    {
      key: 'knowledge_base_enabled',
      label: 'Knowledge Base',
      icon: 'solar:book-bookmark-bold',
      enabled: agent.capabilities.knowledge_base_enabled
    }
  ]

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <IconifyIcon icon="solar:settings-bold" width={24} height={24} className="me-2" />
          Agent Capabilities
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {capabilities.map((capability) => (
            <Col key={capability.key} xs={12} sm={6} lg={3}>
              <div className="d-flex align-items-center gap-3 p-3 border rounded">
                <div className={`rounded-circle p-2 ${capability.enabled ? 'bg-success bg-opacity-10' : 'bg-secondary bg-opacity-10'}`}>
                  <IconifyIcon 
                    icon={capability.icon} 
                    width={24} 
                    height={24} 
                    className={capability.enabled ? 'text-success' : 'text-secondary'}
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold small">{capability.label}</div>
                  <div className="d-flex align-items-center gap-1 mt-1">
                    <IconifyIcon 
                      icon={capability.enabled ? 'solar:check-circle-bold' : 'solar:close-circle-bold'} 
                      width={14} 
                      height={14} 
                      className={capability.enabled ? 'text-success' : 'text-secondary'}
                    />
                    <small className={capability.enabled ? 'text-success' : 'text-muted'}>
                      {capability.enabled ? 'Enabled' : 'Disabled'}
                    </small>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  )
}

export default AgentCapabilities