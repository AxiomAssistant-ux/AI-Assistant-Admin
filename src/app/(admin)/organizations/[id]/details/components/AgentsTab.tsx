'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Modal,
  Row
} from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { toast } from 'react-toastify'

type Agent = {
  id: string
  agent_id: string
  name: string
  default_language?: string
  created_at: string
}

type OrganizationDetails = {
  _id: string
  company_name: string
  agent_id?: string[]
  usage: {
    active_agents: number
    max_agents: number
  }
}

type AgentsTabProps = {
  organization: OrganizationDetails
  onRefresh: () => Promise<void>
}

// Mock agents data
const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent_001',
    agent_id: 'agent_2ef211ab198c6289a03087d23f',
    name: 'Customer Support Agent',
    default_language: 'en',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'agent_002',
    agent_id: 'agent_3fg322bc209d7390b14198e34g',
    name: 'HR Assistant Agent',
    default_language: 'en',
    created_at: '2024-02-15T14:30:00Z'
  }
]

// Mock available agents for assignment
const MOCK_AVAILABLE_AGENTS: Agent[] = [
  {
    id: 'agent_003',
    agent_id: 'agent_4hg433cd310e8401c25209f45h',
    name: 'Sales Agent',
    default_language: 'en',
    created_at: '2024-03-10T09:00:00Z'
  },
  {
    id: 'agent_004',
    agent_id: 'agent_5ih544de421f9512d36310g56i',
    name: 'Tech Support Agent',
    default_language: 'en',
    created_at: '2024-03-25T11:15:00Z'
  }
]

const AgentsTab: React.FC<AgentsTabProps> = ({ organization, onRefresh }) => {
  const { token } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [unassigningId, setUnassigningId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await organizationApi.getAgents(token, organization._id)
        // if (response.error) throw new Error(response.error)
        // setAgents(response.data)

        await new Promise(resolve => setTimeout(resolve, 500))
        setAgents(MOCK_AGENTS)
      } catch (err) {
        toast.error('Failed to load agents')
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [organization._id, token])

  const fetchAvailableAgents = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await agentApi.getUnassigned(token)
      // if (response.error) throw new Error(response.error)
      // setAvailableAgents(response.data)

      await new Promise(resolve => setTimeout(resolve, 300))
      setAvailableAgents(MOCK_AVAILABLE_AGENTS)
    } catch (err) {
      toast.error('Failed to load available agents')
    }
  }, [token])

  const handleOpenAssignModal = () => {
    fetchAvailableAgents()
    setAssignModalOpen(true)
  }

  const handleAssignAgent = async () => {
    if (!selectedAgentId) {
      toast.error('Please select an agent')
      return
    }

    setAssigning(true)
    try {
      // TODO: Replace with actual API call
      // const response = await organizationApi.assignAgent(token, organization._id, selectedAgentId)
      // if (response.error) throw new Error(response.error)

      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Find the agent from available agents and add to current agents
      const agentToAdd = availableAgents.find(a => a.agent_id === selectedAgentId)
      if (agentToAdd) {
        setAgents(prev => [...prev, agentToAdd])
        setAvailableAgents(prev => prev.filter(a => a.agent_id !== selectedAgentId))
      }

      toast.success('Agent assigned successfully')
      setAssignModalOpen(false)
      setSelectedAgentId('')
      onRefresh()
    } catch (err) {
      toast.error('Failed to assign agent')
    } finally {
      setAssigning(false)
    }
  }

  const handleUnassignAgent = async (agentId: string) => {
    const confirmed = window.confirm('Remove this agent from the organization?')
    if (!confirmed) return

    setUnassigningId(agentId)
    try {
      // TODO: Replace with actual API call
      // const response = await organizationApi.unassignAgent(token, organization._id, agentId)
      // if (response.error) throw new Error(response.error)

      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Move agent back to available agents
      const agentToRemove = agents.find(a => a.agent_id === agentId)
      if (agentToRemove) {
        setAvailableAgents(prev => [...prev, agentToRemove])
        setAgents(prev => prev.filter(a => a.agent_id !== agentId))
      }

      toast.success('Agent unassigned successfully')
      onRefresh()
    } catch (err) {
      toast.error('Failed to unassign agent')
    } finally {
      setUnassigningId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <CardTitle as="h5" className="mb-1">Assigned Agents</CardTitle>
            <p className="text-muted small mb-0">
              {agents.length} of {organization.usage.max_agents} agents assigned
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAssignModal}
            disabled={agents.length >= organization.usage.max_agents}
          >
            <IconifyIcon icon="solar:add-circle-linear" width={16} height={16} className="me-1" />
            Assign Agent
          </Button>
        </CardHeader>
        <CardBody>
          {agents.length === 0 ? (
            <div className="text-center py-5">
              <IconifyIcon icon="solar:robot-linear" width={64} height={64} className="text-muted mb-3" />
              <h5>No Agents Assigned</h5>
              <p className="text-muted">Assign AI agents to this organization to get started</p>
              <Button variant="outline-primary" onClick={handleOpenAssignModal}>
                <IconifyIcon icon="solar:add-circle-linear" width={16} height={16} className="me-1" />
                Assign Your First Agent
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Agent Name</th>
                    <th>Agent ID</th>
                    <th>Language</th>
                    <th>Assigned Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.agent_id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-xs bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                            <IconifyIcon icon="solar:robot-linear" width={20} height={20} className="text-primary" />
                          </div>
                          <span className="fw-medium">{agent.name}</span>
                        </div>
                      </td>
                      <td>
                        <code className="text-muted small">{agent.agent_id}</code>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="text-uppercase">
                          {agent.default_language || 'en'}
                        </Badge>
                      </td>
                      <td>{formatDate(agent.created_at)}</td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleUnassignAgent(agent.agent_id)}
                          disabled={unassigningId === agent.agent_id}
                          title="Remove agent"
                        >
                          {unassigningId === agent.agent_id ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                          ) : (
                            <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Assign Agent Modal */}
      <Modal show={assignModalOpen} onHide={() => setAssignModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Agent</Form.Label>
            <Form.Select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
            >
              <option value="">Choose an agent...</option>
              {availableAgents.map((agent) => (
                <option key={agent.agent_id} value={agent.agent_id}>
                  {agent.name} ({agent.agent_id})
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Select an available agent to assign to this organization
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="link" onClick={() => setAssignModalOpen(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignAgent} 
            disabled={assigning || !selectedAgentId}
          >
            {assigning ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Assigning...
              </>
            ) : (
              'Assign Agent'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AgentsTab