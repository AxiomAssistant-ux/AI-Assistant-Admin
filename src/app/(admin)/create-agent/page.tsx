'use client'

import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import { adminAgentApi } from '@/lib/admin-agent-api'
import type { CreateAgentPayload, TTSModelLiteral } from '@/types/admin-agent'

type AgentFormState = {
  // Basic fields
  name: string
  tags: string

  // Agent config
  prompt: string
  llm: string
  language: string
  firstMessage: string
  temperature: string
  maxTokens: string

  // TTS config
  voiceId: string
  ttsModelId: string
  stability: string
  speed: string
  similarityBoost: string

  // Platform settings
  recordCalls: boolean
  debug: boolean
}

const initialFormState: AgentFormState = {
  name: '',
  tags: '',
  prompt: '',
  llm: '',
  language: 'en',
  firstMessage: '',
  temperature: '',
  maxTokens: '',
  voiceId: '',
  ttsModelId: '',
  stability: '',
  speed: '',
  similarityBoost: '',
  recordCalls: false,
  debug: false
}

const CreateAgentPage = () => {
  const { token, isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<AgentFormState>(initialFormState)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (field: keyof AgentFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    const value = target.type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
    setFormErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.prompt.trim()) {
      errors.prompt = 'System prompt is required'
    }
    if (!formData.voiceId.trim()) {
      errors.voiceId = 'Voice ID is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token || !isAuthenticated || user?.role !== 'admin') {
      toast.error('You are not authorized to create agents')
      return
    }
    if (!validateForm()) return

    setSubmitting(true)
    try {
      // Build tags array
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      // Build conversation_config
      const ttsModelId = formData.ttsModelId.trim()
      const validTTSModelIds: TTSModelLiteral[] = ['eleven_turbo_v2', 'eleven_flash_v2', 'eleven_multilingual_v2']
      const modelId: TTSModelLiteral | undefined = validTTSModelIds.includes(ttsModelId as TTSModelLiteral)
        ? (ttsModelId as TTSModelLiteral)
        : undefined

      const conversationConfig: CreateAgentPayload['conversation_config'] = {
        agent: {
          language: formData.language.trim() || undefined,
          first_message: formData.firstMessage.trim() || undefined,
          prompt: {
            prompt: formData.prompt.trim(),
            llm: formData.llm.trim() || undefined,
            temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
            max_tokens: formData.maxTokens ? parseInt(formData.maxTokens, 10) : undefined
          }
        },
        tts: {
          voice_id: formData.voiceId.trim(),
          model_id: modelId,
          stability: formData.stability ? parseFloat(formData.stability) : undefined,
          speed: formData.speed ? parseFloat(formData.speed) : undefined,
          similarity_boost: formData.similarityBoost ? parseFloat(formData.similarityBoost) : undefined
        }
      }

      // Build platform_settings
      const platformSettings = formData.recordCalls || formData.debug
        ? {
            record_calls: formData.recordCalls || undefined,
            debug: formData.debug || undefined
          }
        : undefined

      // Build payload matching AgentCreateRequest
      const payload: CreateAgentPayload = {
        conversation_config: conversationConfig,
        name: formData.name.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        platform_settings: platformSettings
      }

      const response = await adminAgentApi.createAgent(token, payload)
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success('Agent created successfully')
        setFormData(initialFormState)
        setTimeout(() => {
          router.push('/agents')
        }, 400)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create agent')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Row className="py-5">
        <Col xs={12}>
          <div className="text-center">
            <h4 className="mb-2">Please sign in</h4>
            <p className="text-muted mb-0">You need an admin account to manage agents.</p>
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
          <div className="page-title-box">
            <h4 className="mb-0">Create Agent</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Taplox</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Create Agent</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <CardTitle as="h5">New Agent Configuration</CardTitle>
              <p className="text-muted mb-0">
                Define the core personality, voice, and language settings for your conversational agent.
              </p>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleCreateAgent}>
                <Row className="g-3">
                  {/* Basic Information */}
                  <Col xs={12}>
                    <h6 className="mb-3 text-primary">Basic Information</h6>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Agent Name</Form.Label>
                      <Form.Control
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        placeholder="Sales Concierge"
                      />
                      <Form.Text className="text-muted">Optional: Name for the agent</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        value={formData.tags}
                        onChange={handleInputChange('tags')}
                        placeholder="sales, support, english"
                      />
                      <Form.Text className="text-muted">Comma separated tags (optional)</Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Agent Configuration */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Agent Configuration</h6>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Language</Form.Label>
                      <Form.Control
                        value={formData.language}
                        onChange={handleInputChange('language')}
                        placeholder="en"
                      />
                      <Form.Text className="text-muted">Primary language code (e.g., en, es, fr)</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>First Message</Form.Label>
                      <Form.Control
                        value={formData.firstMessage}
                        onChange={handleInputChange('firstMessage')}
                        placeholder="Hello! How can I help you today?"
                      />
                      <Form.Text className="text-muted">Optional: Initial greeting message</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>System Prompt <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={formData.prompt}
                        onChange={handleInputChange('prompt')}
                        placeholder="Describe how the agent should behave..."
                        isInvalid={!!formErrors.prompt}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.prompt}</Form.Control.Feedback>
                      <Form.Text className="text-muted">Required: Define the agent's behavior and personality</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>LLM Model</Form.Label>
                      <Form.Control
                        value={formData.llm}
                        onChange={handleInputChange('llm')}
                        placeholder="gpt-4o-mini"
                      />
                      <Form.Text className="text-muted">Optional: LLM model identifier</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Temperature</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={formData.temperature}
                        onChange={handleInputChange('temperature')}
                        placeholder="0.7"
                      />
                      <Form.Text className="text-muted">Optional: 0-2, controls randomness</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Max Tokens</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.maxTokens}
                        onChange={handleInputChange('maxTokens')}
                        placeholder="1000"
                      />
                      <Form.Text className="text-muted">Optional: Maximum response length</Form.Text>
                    </Form.Group>
                  </Col>

                  {/* TTS Configuration */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Text-to-Speech Configuration</h6>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Voice ID <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={formData.voiceId}
                        onChange={handleInputChange('voiceId')}
                        placeholder="voice_123"
                        isInvalid={!!formErrors.voiceId}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.voiceId}</Form.Control.Feedback>
                      <Form.Text className="text-muted">Required: ElevenLabs voice identifier</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>TTS Model</Form.Label>
                      <Form.Select
                        value={formData.ttsModelId}
                        onChange={handleInputChange('ttsModelId')}
                      >
                        <option value="">Select TTS Model (Optional)</option>
                        <option value="eleven_turbo_v2">Eleven Turbo v2</option>
                        <option value="eleven_flash_v2">Eleven Flash v2</option>
                        <option value="eleven_multilingual_v2">Eleven Multilingual v2</option>
                      </Form.Select>
                      <Form.Text className="text-muted">Optional: TTS model selection</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Stability</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={formData.stability}
                        onChange={handleInputChange('stability')}
                        placeholder="0.5"
                      />
                      <Form.Text className="text-muted">Optional: 0-1, voice stability</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Speed</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        min="0.25"
                        max="4"
                        value={formData.speed}
                        onChange={handleInputChange('speed')}
                        placeholder="1.0"
                      />
                      <Form.Text className="text-muted">Optional: 0.25-4, speech speed</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Similarity Boost</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={formData.similarityBoost}
                        onChange={handleInputChange('similarityBoost')}
                        placeholder="0.75"
                      />
                      <Form.Text className="text-muted">Optional: 0-1, voice similarity</Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Platform Settings */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Platform Settings</h6>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="recordCalls"
                        label="Record Calls"
                        checked={formData.recordCalls}
                        onChange={handleInputChange('recordCalls')}
                      />
                      <Form.Text className="text-muted">Enable call recording for this agent</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="debug"
                        label="Debug Mode"
                        checked={formData.debug}
                        onChange={handleInputChange('debug')}
                      />
                      <Form.Text className="text-muted">Enable debug logging for this agent</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="text-end mt-4">
                    <Button type="submit" disabled={submitting} variant="primary">
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <IconifyIcon icon="solar:add-square-outline" width={18} height={18} className="me-2" />
                          Create Agent
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </>
  )
}

export default CreateAgentPage

